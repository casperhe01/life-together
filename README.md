# Life Together · 生命同行营 第二期

A bilingual (Chinese / English) daily devotional calendar. Each day pairs a short Scripture passage with a brief reflection and a four-part prayer, so participants can read and pray through the same passage together.

**Live site:** `https://<your-username>.github.io/<repository-name>/`

## What's on each day

- **Scripture**: the day's passage, with verse numbers
  - Chinese: 和合本 (Chinese Union Version, public-domain text), plus a "阅读新译本" link to the Chinese New Version (Simplified) on BibleGateway
  - English: Berean Standard Bible (BSB), plus a "Read in NIV" link to BibleGateway
- **Reflection (经文解读)**: a short explanation of the passage that points to Christ and applies it to daily life
- **Prayer (今日祷告)**: written in the ACTS pattern
  - **A**doration (赞美): praising God for who He is
  - **C**onfession (认罪): honestly naming our sins and weaknesses
  - **T**hanksgiving (感谢): thanking God for His grace in Christ
  - **S**upplication (祈求): asking for ourselves, our families, the church, and others

## Current schedule

| Dates (2026) | Passages |
|---|---|
| Sep 14 – Oct 16 | 1 John 1:1 – 5:21 |
| Oct 17 – Oct 18 | 2 John 1:1–6 |

New days are added in batches.

## Features

- Language toggle (中 / EN) that remembers the reader's choice
- Monthly calendar starting on Sunday; days with a devotion are marked with a dot
- Previous / next navigation, a "Today" button, and ← → keyboard shortcuts
- On phones, swipe left or right on the calendar to change month
- Optional daily release: show only devotions up to today, with today's devotion appearing at 10:00 pm (see **Settings**)
- Light and dark mode that follow the device setting
- Phone-friendly single-column layout
- No build step, no server, no database, and no tracking

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `config.js` | Settings (which days to show, release time, time zone) |
| `style.css` | Styles (light / dark themes, mobile layout) |
| `app.js` | Calendar, navigation, and language switching |
| `prayers.js` | All daily content (Chinese and English) |

## Settings

Edit `config.js`:

| Setting | Values | Effect |
|---|---|---|
| `isAllContentDisplayed` | `1` | Show every devotion that has been written, including future dates |
| | `0` | Show devotions only up to today; today's devotion appears at `publishTime` |
| `publishTime` | e.g. `"22:00"` | Release time for today's devotion (24-hour clock). Used only when `isAllContentDisplayed` is `0` |
| `timeZone` | e.g. `"America/Toronto"` | Time zone used for "today" and the release time. Use `""` to follow each reader's own device |

When `isAllContentDisplayed` is `0`, an open page checks once a minute and updates itself at the release time and after midnight.

Note: this only controls what the page shows. Every devotion in `prayers.js` can still be downloaded by anyone who opens that file directly, so do not rely on it to keep content secret.

## Run locally

Download the files and open `index.html` in any modern browser. Nothing needs to be installed.

## Publish with GitHub Pages

1. Push these files to the root of the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. After a few minutes the site is available at the address shown on that page.

## Adding or editing days

All content lives in `prayers.js` as one entry per day, sorted by date:

```js
{
  "date": "2026-10-19",
  "weekday": "周一",
  "ref": "约翰二书 1:7-9",
  "verses": [{ "v": 7, "t": "…" }],
  "title": "…",
  "interpretation": "…",
  "prayer": { "adoration": "…", "confession": "…", "thanksgiving": "…", "supplication": "…" },
  "closing": "奉主耶稣基督的名祷告，阿们！",
  "en": {
    "ref": "2 John 1:7–9",
    "verses": [{ "v": 7, "t": "…" }],
    "title": "…",
    "interpretation": "…",
    "prayer": { "adoration": "…", "confession": "…", "thanksgiving": "…", "supplication": "…" },
    "closing": "In the name of the Lord Jesus Christ I pray. Amen!"
  }
}
```

References always include the chapter, even for one-chapter books (约翰二书 1:1-3 / 2 John 1:1–3), so readers can look them up in any Bible app.

If an entry has no `en` block, the English view falls back to the Chinese text. Days without an entry show "No devotion for this day yet."

## Scripture, sources, and copyright

**In short:** everything on this site is public domain, linked only, or original writing. No copyrighted Bible text or commentary is reproduced.

| Content | Source | How it is used | Status |
|---|---|---|---|
| Chinese Scripture | 和合本 (Chinese Union Version) | Shown in full, wording unchanged | Public domain |
| English Scripture | Berean Standard Bible (BSB) | Shown in full | Public domain |
| NIV, 新译本 | Copyrighted | Link only, no text copied | Not reproduced |
| Reflections and prayers | Written for this site | Original text; the reflections draw on 《圣经综合解读》 for understanding only | Original |
| 《圣经综合解读》 | cmcbiblereading.com | Used as a study reference; the books and any notes taken from them are not in this repository | Not reproduced |
| Fonts | Google Fonts | Free to use | Open license |

Details:

- **Berean Standard Bible (BSB)**: dedicated to the public domain on April 30, 2023. See [berean.bible/terms.htm](https://berean.bible/terms.htm). The text is taken from [scrollmapper/bible_databases](https://github.com/scrollmapper/bible_databases) (`BSB.json`).
- **新译本 (Chinese New Version, Simplified, CNVS)**: only linked ("阅读新译本 ↗" opens the passage on BibleGateway), never reproduced. The CNV is copyrighted by the Worldwide Bible Society.
- **NIV**: only linked, never reproduced. The NIV is copyrighted by Biblica, and quoting a complete book of the Bible requires written permission. See [biblica.com/permissions](https://www.biblica.com/permissions/).
- **和合本 (Chinese Union Version)**: public-domain text (the 1919 translation), as distributed by the CrossWire Bible Society (SWORD module "ChiUn") and taken from [scrollmapper/bible_databases](https://github.com/scrollmapper/bible_databases). To make it easier to read, the text is converted from traditional to simplified characters, a few character forms are standardized (著 → 着, 藉 → 借, 甚么 → 什么), and translator notes such as （或译……） are removed. The original 「」 quotation marks are kept, and, as in printed editions, a space is left before 神 when it refers to God (a traditional mark of respect). None of these changes alter the meaning or wording of the text. The text refers to God as 他 / 你, as in the original; the reflections and prayers on this site are original writing and use 祂 / 祢.
- **Reflections and prayers**: original writing. The reflections draw on 《圣经综合解读》 ([cmcbiblereading.com](https://cmcbiblereading.com)) for understanding of each passage; no commentary text is copied, and the source is credited in the page footer. The prayers follow the general ACTS pattern (adoration, confession, thanksgiving, supplication), which is a common prayer structure and not anyone's copyrighted work.
- **Fonts**: Noto Serif SC and Noto Sans SC from Google Fonts, with system fonts as a fallback.

The public-domain status of the Chinese and English Bible texts follows the statements of their publishers and distributors. This is not legal advice; if the site will be shared widely, consider having someone familiar with copyright review it.

## License

Not yet chosen. Add a `LICENSE` file before inviting others to reuse the code or text.
