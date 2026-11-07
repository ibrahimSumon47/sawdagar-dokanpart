# Credits

## Fonts and icons

- Fraunces, Inter and Noto Sans Bengali are loaded through `next/font` from Google Fonts and are licensed under the SIL Open Font License 1.1. No font files are committed.
- Icons come from [Lucide](https://lucide.dev/) (`lucide-react`, ISC licence).
- The jamdani brand mark, the jamdani pattern and the diagrams are original SVGs drawn for this project; no third-party logo or motif is copied.

## Catalog photography

Twelve department photographs are stored in `apps/web/public/media/departments` (800 × 600, JPEG). They stand in for the whole department, so a product card shows a representative photograph rather than the exact item; the site labels the catalog as demo data. The same credits are published at `/credits`, which is linked from the footer.

| Department           | File                   | Photographer            | Licence       | Source                                                                                                                                                                    |
| -------------------- | ---------------------- | ----------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Saree                | `sarees.jpg`           | Bikrampur               | CC0           | [Dhaka Sari Fabric 1](https://commons.wikimedia.org/wiki/File:Dhaka_Sari_Fabric_1.jpg)                                                                                    |
| Panjabi              | `panjabi.jpg`          | S.M.M.Musabbir Uddin    | CC BY-SA 4.0  | [Button of Panjabi 1](https://commons.wikimedia.org/wiki/File:Button_of_Panjabi_1.jpg)                                                                                    |
| Handloom weaving     | `handloom.jpg`         | Unknown (public domain) | Public domain | [BN-weaver](https://commons.wikimedia.org/wiki/File:BN-weaver.jpg)                                                                                                        |
| Nakshi kantha        | `nakshi-kantha.jpg`    | Salim Khandoker         | CC BY-SA 3.0  | [Embroidered Quilt](<https://commons.wikimedia.org/wiki/File:Embroidered_Quilt_(%E0%A6%A8%E0%A6%95%E0%A6%B6%E0%A6%BF_%E0%A6%95%E0%A6%BE%E0%A6%81%E0%A6%A5%E0%A6%BE).jpg>) |
| Jute goods           | `jute.jpg`             | Fahad Faisal            | CC BY-SA 3.0  | [Jute Bag](https://commons.wikimedia.org/wiki/File:Jute_Bag.JPG)                                                                                                          |
| Cane and bamboo      | `cane-bamboo.jpg`      | Thamizhpparithi Maari   | CC BY-SA 3.0  | [A bamboo basket image 1](https://commons.wikimedia.org/wiki/File:A_bamboo_basket_image_1.JPG)                                                                            |
| Pottery              | `pottery.jpg`          | Rayhan9d                | CC BY-SA 4.0  | [The story of clay pottery 2](https://commons.wikimedia.org/wiki/File:The_story_of_clay_pottery_2.jpg)                                                                    |
| Brassware            | `brassware.jpg`        | Gurnoor ghuman          | CC BY-SA 4.0  | [Brass pot](https://commons.wikimedia.org/wiki/File:Brass_pot.jpg)                                                                                                        |
| Leather goods        | `leather.jpg`          | Pauloleong2002          | CC BY-SA 4.0  | [An old wallet with brown color](https://commons.wikimedia.org/wiki/File:An_old_wallet_with_brown_color.jpg)                                                              |
| Kitchenware          | `home-kitchen.jpg`     | Philtom12               | CC BY-SA 4.0  | [Clay pot workshop](https://commons.wikimedia.org/wiki/File:Clay_pot_workshop_20220916120232.jpg)                                                                         |
| Beauty and care      | `beauty-care.jpg`      | Malene Thyssen          | CC BY 2.5     | [Handmade soap](https://commons.wikimedia.org/wiki/File:Handmade_soap.jpg)                                                                                                |
| Books and stationery | `books-stationery.jpg` | Ch. Maderthoner         | CC0           | [Old Books 01](https://commons.wikimedia.org/wiki/File:Old_Books_01.JPG)                                                                                                  |

The images were resized and centre-cropped to 800 × 600; no other alterations were made. CC BY and CC BY-SA files remain under their original licences, and the table above provides the attribution those licences require. `scripts/fetch-catalog-media.mjs` records the same metadata and regenerates `apps/web/features/catalog/mediaCredits.ts`. Before replacing any file, check its licence and update both this table and that manifest.

## Seed data

All 12 departments, 72 leaf categories, 24 vendor names, 432 product titles, descriptions and variant names were written for this demo, in English and Bangla. Ratings, review counts and follower counts are fabricated display summaries, not real customer reviews. Demo mobile numbers such as `01712345678` are fabricated examples in the public Bangladeshi format; they are not real customers. The planned full seed sources are described in the [data specification](spec/04-data-and-seed.md); they have not been imported.

Third-party software and its licences are listed in [technology versions](TECH_VERSIONS.md).

## Product photography

Twenty-eight product photographs back the published catalogue, one per product. They are served from Cloudinary and their source page, licence and photographer are recorded in the manifest and repeated here. The same credits are published at `/credits`, which reads the rows attached to each product.

| Photo                | Subcategory      | Photographer                 | Licence       | Source                                                                                                               |
| -------------------- | ---------------- | ---------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------- |
| `baby-quilt/2`       | baby-quilt       | Anne Norman                  | CC BY 2.0     | [source](https://commons.wikimedia.org/wiki/File:Quilt_002.jpg)                                                      |
| `baby-quilt/3`       | baby-quilt       | jude from new york, usa      | CC BY 2.0     | [source](https://commons.wikimedia.org/wiki/File:Baby_quilt_detail.jpg)                                              |
| `baby-quilt/4`       | baby-quilt       | Jim from Lexington, KY, USA  | CC BY-SA 2.0  | [source](https://commons.wikimedia.org/wiki/File:Baby_quilt_in_pinwheel_pattern.jpg)                                 |
| `flower-vase/1`      | flower-vase      | André Karwath aka Aka        | CC BY-SA 2.5  | [source](https://commons.wikimedia.org/wiki/File:Chinese_vase.jpg)                                                   |
| `flower-vase/6`      | flower-vase      | Sobei KINKOZAN; Kinkozan     | CC BY 4.0     | [source](<https://commons.wikimedia.org/wiki/File:Vase_(AM_1934.316-7).jpg>)                                         |
| `flower-vase/7`      | flower-vase      | Unknown authorUnknown author | CC BY 4.0     | [source](<https://commons.wikimedia.org/wiki/File:Vase_(AM_1922.60-2).jpg>)                                          |
| `clay-cooking-pot/3` | clay-cooking-pot | Hanay                        | CC BY-SA 3.0  | [source](https://commons.wikimedia.org/wiki/File:Clay_cooking_pot_Bronze_II_age_02.jpg)                              |
| `clay-cooking-pot/5` | clay-cooking-pot | Kabiru123                    | CC BY-SA 4.0  | [source](https://commons.wikimedia.org/wiki/File:Clay_Pot.jpg)                                                       |
| `clay-cooking-pot/6` | clay-cooking-pot | Kid Keen 47                  | CC BY-SA 4.0  | [source](https://commons.wikimedia.org/wiki/File:Clay_pot_2.jpg)                                                     |
| `clay-cooking-pot/9` | clay-cooking-pot | Davidbena                    | CC BY-SA 4.0  | [source](https://commons.wikimedia.org/wiki/File:Earthenware_cooking_pot.jpg)                                        |
| `brass-lamp/4`       | brass-lamp       | Tropenmuseum                 | CC BY-SA 3.0  | [source](https://commons.wikimedia.org/wiki/File:COLLECTIE_TROPENMUSEUM_Messingen_lamp_TMnr_1259-19.jpg)             |
| `brass-jug/2`        | brass-jug        | Unknown author               | CC BY 4.0     | [source](<https://commons.wikimedia.org/wiki/File:Jug_(AM_1966.202-1).jpg>)                                          |
| `leather-wallet/1`   | leather-wallet   | Nicholas Gemini              | CC BY-SA 3.0  | [source](https://commons.wikimedia.org/wiki/File:Leather_wallets_04.JPG)                                             |
| `leather-wallet/4`   | leather-wallet   | Nicholas Gemini              | CC BY-SA 3.0  | [source](https://commons.wikimedia.org/wiki/File:Leather_wallets_08.JPG)                                             |
| `leather-wallet/7`   | leather-wallet   | Eugenepik                    | CC BY-SA 4.0  | [source](<https://commons.wikimedia.org/wiki/File:Leather_bi-fold_wallet_by_Eugene_Pik_(2021)_04.jpg>)               |
| `leather-belt/1`     | leather-belt     | Hedwig von Ebbel             | Public domain | [source](https://commons.wikimedia.org/wiki/File:Belt_G%C3%BCrtel.jpg)                                               |
| `leather-belt/3`     | leather-belt     | Ulfbastel                    | Public domain | [source](https://commons.wikimedia.org/wiki/File:Flachriemen_leder.jpg)                                              |
| `leather-belt/9`     | leather-belt     | Sta.K                        | CC BY-SA 3.0  | [source](https://commons.wikimedia.org/wiki/File:Black_Belt.jpg)                                                     |
| `leather-sandal/9`   | leather-sandal   | Geoffreyrabbit               | CC BY-SA 4.0  | [source](https://commons.wikimedia.org/wiki/File:Leather_sandal_for_men_in_summer_2.jpg)                             |
| `handmade-soap/1`    | handmade-soap    | Malene Thyssen               | CC BY 2.5     | [source](https://commons.wikimedia.org/wiki/File:Handmade_soap.jpg)                                                  |
| `handmade-soap/2`    | handmade-soap    | Bernard Gagnon               | CC BY-SA 3.0  | [source](https://commons.wikimedia.org/wiki/File:Aleppo_soap_01.jpg)                                                 |
| `handmade-soap/3`    | handmade-soap    | Bernard Gagnon               | CC BY-SA 3.0  | [source](https://commons.wikimedia.org/wiki/File:Aleppo_soap_03.jpg)                                                 |
| `notebook/3`         | notebook         | Melinda Pack melindapack     | CC0           | [source](<https://commons.wikimedia.org/wiki/File:Camera_keys_notebook_coffee_(Unsplash).jpg>)                       |
| `notebook/6`         | notebook         | 8joKeaton                    | CC BY-SA 4.0  | [source](https://commons.wikimedia.org/wiki/File:Tsubamenote.jpg)                                                    |
| `pen/7`              | pen              | Petar Milošević              | CC BY-SA 4.0  | [source](<https://commons.wikimedia.org/wiki/File:Fountain_pen_writing_(literacy).jpg>)                              |
| `sketchbook/9`       | sketchbook       | Aline Savioz                 | CC BY-SA 4.0  | [source](https://commons.wikimedia.org/wiki/File:Rylsee-sketchbook-2018.jpg)                                         |
| `storage-jar/3`      | storage-jar      | Hiart                        | CC0           | [source](https://commons.wikimedia.org/wiki/File:Storage_jar_from_Iran,_c._9th_century,_glazed_earthenware,_HAA.JPG) |
| `cookware-set/2`     | cookware-set     | Japanesegreentea             | CC BY-SA 3.0  | [source](https://commons.wikimedia.org/wiki/File:Cookware_set_with_removable_handle.jpg)                             |

No photograph was cropped or altered beyond Cloudinary's delivery transformations. Every row above was reviewed against the product name; photographs that did not match were removed rather than renamed.

## Seed data
