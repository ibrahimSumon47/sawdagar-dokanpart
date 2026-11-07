"""Scores every product photo in the manifest with CLIP.

For each photo the model compares it with one "correct" label built from the
subcategory and a set of junk labels (comic, portrait, landscape, and every
other subcategory). A photo passes only when the correct label wins and clears
the probability floor while no junk label clears the ceiling. Thresholds live in
packages/seed/images/clip-thresholds.json so they can be tuned without code.

Run: python scripts/images/clip-check.py <manifest> <thresholds> <keywords> <out>
"""

from __future__ import annotations

import io
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

MODEL_NAME = "openai/clip-vit-base-patch32"


def load_image(url: str) -> Image.Image:
    """Downloads one Cloudinary photo and returns it as RGB."""
    with urllib.request.urlopen(url, timeout=60) as response:
        return Image.open(io.BytesIO(response.read())).convert("RGB")


def photo_url(cloud: str, public_id: str) -> str:
    """Builds a 512 px delivery URL, enough detail for CLIP and quick to fetch."""
    return f"https://res.cloudinary.com/{cloud}/image/upload/c_limit,w_512/{public_id}"


def main() -> int:
    manifest_path, thresholds_path, keywords_path, out_path = map(Path, sys.argv[1:5])
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    thresholds = json.loads(thresholds_path.read_text(encoding="utf-8"))
    keywords = json.loads(keywords_path.read_text(encoding="utf-8"))
    cloud = os.environ.get("CLOUDINARY_CLOUD_NAME", "uapiw50d")

    junk_labels = list(thresholds["junkLabels"])
    labels_by_subcategory = {
        slug: f"a photo of a {entry['label']}" for slug, entry in keywords.items()
    }
    other_labels = sorted(set(labels_by_subcategory.values()))

    model = CLIPModel.from_pretrained(MODEL_NAME).eval()
    processor = CLIPProcessor.from_pretrained(MODEL_NAME)

    def text_probs(image: Image.Image, labels: list[str]) -> list[float]:
        inputs = processor(text=labels, images=image, return_tensors="pt", padding=True)
        with torch.no_grad():
            logits = model(**inputs).logits_per_image[0]
        return torch.softmax(logits, dim=0).tolist()

    results = []
    for subcategory, photos in manifest["subcategories"].items():
        if not photos:
            continue
        correct_label = labels_by_subcategory.get(subcategory)
        if correct_label is None:
            results.append(
                {
                    "subcategory": subcategory,
                    "publicId": photos[0]["publicId"],
                    "error": "no keyword entry",
                    "pass": False,
                }
            )
            continue
        labels = [correct_label, *junk_labels, *[l for l in other_labels if l != correct_label]]
        junk_indexes = range(1, len(labels))
        for photo in photos:
            try:
                image = load_image(photo_url(cloud, photo["publicId"]))
            except Exception as error:  # noqa: BLE001 - report the URL, keep going
                results.append(
                    {
                        "subcategory": subcategory,
                        "publicId": photo["publicId"],
                        "error": str(error),
                        "pass": False,
                    }
                )
                continue
            probs = text_probs(image, labels)
            correct = probs[0]
            junk_best = max(junk_indexes, key=lambda index: probs[index])
            junk_max = probs[junk_best]
            passes = (
                correct >= thresholds["correctMin"]
                and probs.index(max(probs)) == 0
                and junk_max < thresholds["junkMax"]
            )
            results.append(
                {
                    "subcategory": subcategory,
                    "publicId": photo["publicId"],
                    "correctLabel": correct_label,
                    "correctProb": round(correct, 4),
                    "topLabel": labels[probs.index(max(probs))],
                    "topProb": round(max(probs), 4),
                    "junkMax": round(junk_max, 4),
                    "junkLabel": labels[junk_best],
                    "pass": bool(passes),
                }
            )
            print(f"{photo['publicId']}: {correct:.3f} vs {junk_max:.3f} -> {passes}", flush=True)

    payload = {
        "model": MODEL_NAME,
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "thresholds": thresholds,
        "images": results,
        "passed": sum(1 for item in results if item["pass"]),
        "total": len(results),
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"{payload['passed']}/{payload['total']} photos passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
