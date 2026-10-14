# Life Together · 《生命同行营》第二期

A bilingual (Chinese / English) daily devotional calendar. Each day pairs a short Scripture passage with a brief reflection and a four-part prayer, so participants can read and pray through the same passage together.

**Live site:** `https://<your-username>.github.io/<repository-name>/`

## What's on each day

- **Scripture**: the day's passage, with verse numbers
  - Chinese: 新标点和合本 (Chinese Union Version, New Punctuation)
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
| Oct 17 – Oct 18 | 2 John 1–6 |

New days are added in batches.

## Features

- Language toggle (中 / EN) that remembers the reader's choice
- Monthly calendar starting on Sunday; days with a devotion are marked with a dot
- Previous / next navigation, a "Today" button, and ← → keyboard shortcuts
- Light and dark mode that follow the device setting
- Phone-friendly single-column layout
- No build step, no server, no database, and no tracking

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `style.css` | Styles (light / dark themes, mobile layout) |
| `app.js` | Calendar, navigation, and language switching |
| `prayers.js` | All daily content (Chinese and English) |

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
  "ref": "约翰二书 7-9",
  "verses": [{ "v": 7, "t": "…" }],
  "title": "…",
  "interpretation": "…",
  "prayer": { "adoration": "…", "confession": "…", "thanksgiving": "…", "supplication": "…" },
  "closing": "奉主耶稣基督的名祷告，阿们！",
  "en": {
    "ref": "2 John 7–9",
    "verses": [{ "v": 7, "t": "…" }],
    "title": "…",
    "interpretation": "…",
    "prayer": { "adoration": "…", "confession": "…", "thanksgiving": "…", "supplication": "…" },
    "closing": "In the name of the Lord Jesus Christ I pray. Amen!"
  }
}
```

If an entry has no `en` block, the English view falls back to the Chinese text. Days without an entry show "No devotion for this day yet."

## Scripture and sources

- **Berean Standard Bible (BSB)**: dedicated to the public domain on April 30, 2023. See [berean.bible/terms.htm](https://berean.bible/terms.htm).
- **NIV**: only linked, never reproduced. The NIV is copyrighted by Biblica, and quoting a complete book of the Bible requires written permission. See [biblica.com/permissions](https://www.biblica.com/permissions/).
- **新标点和合本 (Chinese Union Version)**: the text follows the edition used in 《圣经综合解读》, which uses 祂 / 祢 for God.
- **Reflections**: original writing that draws on 《圣经综合解读》 ([cmcbiblereading.com](https://cmcbiblereading.com)). No commentary text is copied.
- **Fonts**: Noto Serif SC and Noto Sans SC from Google Fonts, with system fonts as a fallback.

## License

Not yet chosen. Add a `LICENSE` file before inviting others to reuse the code or text.
