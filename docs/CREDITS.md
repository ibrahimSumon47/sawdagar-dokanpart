# Credits

## Fonts and icons

- Fraunces, Inter and Noto Sans Bengali are loaded through `next/font` from Google Fonts and are licensed under the SIL Open Font License 1.1. No font files are committed.
- Icons come from [Lucide](https://lucide.dev/) (`lucide-react`, ISC licence).
- The jamdani brand mark, the jamdani pattern and the diagrams are original SVGs drawn for this project; no third-party logo or motif is copied.

## Catalog photography

Twelve department photographs are stored in `apps/web/public/media/departments` (800 × 600, JPEG). They stand in for the whole department, so a product card shows a representative photograph rather than the exact item; the site labels the catalog as demo data. The same credits are published at `/credits`, which is linked from the footer.

| Department | File | Photographer | Licence | Source |
|---|---|---|---|---|
| Saree | `sarees.jpg` | Bikrampur | CC0 | [Dhaka Sari Fabric 1](https://commons.wikimedia.org/wiki/File:Dhaka_Sari_Fabric_1.jpg) |
| Panjabi | `panjabi.jpg` | S.M.M.Musabbir Uddin | CC BY-SA 4.0 | [Button of Panjabi 1](https://commons.wikimedia.org/wiki/File:Button_of_Panjabi_1.jpg) |
| Handloom weaving | `handloom.jpg` | Unknown (public domain) | Public domain | [BN-weaver](https://commons.wikimedia.org/wiki/File:BN-weaver.jpg) |
| Nakshi kantha | `nakshi-kantha.jpg` | Salim Khandoker | CC BY-SA 3.0 | [Embroidered Quilt](https://commons.wikimedia.org/wiki/File:Embroidered_Quilt_(%E0%A6%A8%E0%A6%95%E0%A6%B6%E0%A6%BF_%E0%A6%95%E0%A6%BE%E0%A6%81%E0%A6%A5%E0%A6%BE).jpg) |
| Jute goods | `jute.jpg` | Fahad Faisal | CC BY-SA 3.0 | [Jute Bag](https://commons.wikimedia.org/wiki/File:Jute_Bag.JPG) |
| Cane and bamboo | `cane-bamboo.jpg` | Thamizhpparithi Maari | CC BY-SA 3.0 | [A bamboo basket image 1](https://commons.wikimedia.org/wiki/File:A_bamboo_basket_image_1.JPG) |
| Pottery | `pottery.jpg` | Rayhan9d | CC BY-SA 4.0 | [The story of clay pottery 2](https://commons.wikimedia.org/wiki/File:The_story_of_clay_pottery_2.jpg) |
| Brassware | `brassware.jpg` | Gurnoor ghuman | CC BY-SA 4.0 | [Brass pot](https://commons.wikimedia.org/wiki/File:Brass_pot.jpg) |
| Leather goods | `leather.jpg` | Pauloleong2002 | CC BY-SA 4.0 | [An old wallet with brown color](https://commons.wikimedia.org/wiki/File:An_old_wallet_with_brown_color.jpg) |
| Kitchenware | `home-kitchen.jpg` | Philtom12 | CC BY-SA 4.0 | [Clay pot workshop](https://commons.wikimedia.org/wiki/File:Clay_pot_workshop_20220916120232.jpg) |
| Beauty and care | `beauty-care.jpg` | Malene Thyssen | CC BY 2.5 | [Handmade soap](https://commons.wikimedia.org/wiki/File:Handmade_soap.jpg) |
| Books and stationery | `books-stationery.jpg` | Ch. Maderthoner | CC0 | [Old Books 01](https://commons.wikimedia.org/wiki/File:Old_Books_01.JPG) |

The images were resized and centre-cropped to 800 × 600; no other alterations were made. CC BY and CC BY-SA files remain under their original licences, and the table above provides the attribution those licences require. `scripts/fetch-catalog-media.mjs` records the same metadata and regenerates `apps/web/features/catalog/mediaCredits.ts`. Before replacing any file, check its licence and update both this table and that manifest.

## Seed data

All 12 departments, 72 leaf categories, 24 vendor names, 432 product titles, descriptions and variant names were written for this demo, in English and Bangla. Ratings, review counts and follower counts are fabricated display summaries, not real customer reviews. Demo mobile numbers such as `01712345678` are fabricated examples in the public Bangladeshi format; they are not real customers. The planned full seed sources are described in the [data specification](spec/04-data-and-seed.md); they have not been imported.

Third-party software and its licences are listed in [technology versions](TECH_VERSIONS.md).
