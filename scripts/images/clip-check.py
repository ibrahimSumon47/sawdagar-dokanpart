"""Scores every product photo in the manifest with CLIP and geometry checks.

The model compares each photo with its product label, a set of junk labels, and
every other product label. A photo passes only when the correct label wins,
clears the probability floor, no junk label clears the ceiling, no large face
is detected, the page is not mostly text and the long side is at least 800 px.
Thresholds live in packages/seed/images/clip-thresholds.json so the gate can be
tuned without touching this file.

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

import cv2
import numpy as np
import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

MODEL_NAME = os.environ.get("CLIP_MODEL", "openai/clip-vit-large-patch14")
MIN_LONG_SIDE = 800
# A face covering more than this share of the frame is treated as a portrait,
# except for the clothing labels where the garment is expected on a body.
FACE_LIMIT = 0.12
CLOTHING_LABELS = {"cotton saree", "short kurta", "pathani kurta", "boys panjabi", "lungi"}


def load_image(url: str) -> Image.Image:
    """Downloads one Cloudinary photo and returns it as RGB."""
    with urllib.request.urlopen(url, timeout=60) as response:
        return Image.open(io.BytesIO(response.read())).convert("RGB")


def photo_url(cloud: str, public_id: str) -> str:
    """Builds a 512 px delivery URL, enough detail for CLIP and quick to fetch."""
    return f"https://res.cloudinary.com/{cloud}/image/upload/c_limit,w_512/{public_id}"


def face_share(image: Image.Image) -> float:
    """Largest detected face as a share of the frame; 0 when OpenCV finds none."""
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    grey = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    faces = cascade.detectMultiScale(grey, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40))
    if len(faces) == 0:
        return 0.0
    frame = float(image.width * image.height)
    return max(float(width * height) / frame for x, y, width, height in faces)


def text_heavy(image: Image.Image) -> bool:
    """True when sharp edges cover a large part of the frame.

    Product photos have a few strong outlines; a page of text is edges almost
    everywhere. The ratio is deliberately conservative so a printed label on a
    jar does not reject an otherwise clean object photo.
    """
    grey = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(grey, 80, 180)
    return float(np.count_nonzero(edges)) / float(edges.size) > 0.16


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
            width = int(photo.get("width") or 0)
            height = int(photo.get("height") or 0)
            too_small = max(width, height) < MIN_LONG_SIDE
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
            face = face_share(image)
            clothing = keywords.get(subcategory, {}).get("label") in CLOTHING_LABELS
            face_allowed = clothing and face <= 0.35
            text = text_heavy(image)
            passes = (
                correct >= thresholds["correctMin"]
                and probs.index(max(probs)) == 0
                and junk_max < thresholds["junkMax"]
                and (face <= FACE_LIMIT or face_allowed)
                and not text
                and not too_small
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
                    "faceShare": round(face, 4),
                    "textHeavy": bool(text),
                    "tooSmall": bool(too_small),
                    "pass": bool(passes),
                }
            )
            print(
                f"{photo['publicId']}: {correct:.3f} vs {junk_max:.3f} "
                f"face {face:.3f} text {text} -> {passes}",
                flush=True,
            )

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
