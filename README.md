# Sunsa — studio notebook (sunsaartisan.com)

A static website hosted free on GitHub Pages:

| What | Where it lives | How to change it |
|---|---|---|
| Links (artists, courses, videos) | Google Sheet **"Sunsa Site Links"** | Add a row. Live on the next page refresh |
| Photos | Cloudinary, organized by **tag** | Upload, then tag. Live in about 1 minute |
| Notes text for each study | `content/<page>.md` in this repo | Edit the file on github.com. Live in about 1 minute |
| Pages, categories, settings | `js/config.js` | Rarely needed |

---

## One-time setup (about 30 minutes total)

### 1. Google Sheet: make it readable by the site (1 min)
1. Open **Sunsa Site Links** in Google Drive. It's already created and filled in from your Word doc.
2. Click **Share** → under *General access*, choose **Anyone with the link** → **Viewer** → **Done**.

The columns are **Link | Title | Category**. In Category, use:
- `Artists` for the Artists box on the home page
- `Courses` for the Courses box on the home page
- A study's name (`Edges`, `Shadows`, `Color Work`, `Sky / Clouds`, …) for that page's "Further reading" list

Capitals and spaces don't matter.

### 2. Cloudinary: two settings (5 min)
1. Log in at cloudinary.com. Your **Cloud name** is shown on the dashboard (Home / "Product environment").
2. Open `js/config.js` and replace `YOUR_CLOUD_NAME` with it.
3. In Cloudinary go to **Settings → Security → Restricted image types** (may be labeled *Restricted media types*) and **untick "Resource list"**, then save. This lets the site list the photos that carry a tag.

### 3. GitHub: put the site online (10 min)
1. On github.com, create a new repository named **sunsa**. Make it public, since free GitHub Pages needs that. Don't add a README.
2. Copy all the files from this folder into `C:\Users\ej4\Documents\GitHub\sunsa`.
3. Upload them to the repository using either method:
   - **GitHub Desktop:** File → Add local repository → choose that folder. If prompted, create a repository there. Then Commit, then **Publish / Push**.
   - **Browser:** on the new repo's page, click **uploading an existing file** and drag in everything *inside* the folder, including the `assets`, `content`, `css` and `js` folders. Then click Commit.
4. In the repo, go to **Settings → Pages → Build and deployment**: Source **Deploy from a branch**, Branch **main**, folder **/ (root)** → Save.
5. Within a minute or two, the site is live at `https://evanllewellynjones.github.io/sunsa/`. Check it there first.

### 4. Point sunsaartisan.com at it (10 min, then wait for DNS)
In Wix: **Domains → sunsaartisan.com → ⋯ → Manage DNS Records**. If Wix says the domain is connected to a Wix site, disconnect it first.

| Type | Host | Value |
|---|---|---|
| A | (blank / @) | 185.199.108.153 |
| A | (blank / @) | 185.199.109.153 |
| A | (blank / @) | 185.199.110.153 |
| A | (blank / @) | 185.199.111.153 |
| CNAME | www | evanllewellynjones.github.io |

Delete any other existing **A** records for the blank/@ host, and any other `www` record.

Then in GitHub **Settings → Pages → Custom domain**, enter `www.sunsaartisan.com` → Save. Once the check turns green, tick **Enforce HTTPS**. DNS can take anywhere from minutes to a few hours.

---

## Everyday use

### Add a link
Add a row to the Sheet: `https://…` | `Nice title` | `Trees`. That's it.

### Add photos
1. In Cloudinary, open **Media Library → Upload** (works from your phone's browser too). JPG, PNG and HEIC are all fine.
2. Select the new photos → **Add tag** → type the collection's tag:

| Tag | Shows on |
|---|---|
| `edges` `shadows` `color_work` `human_imagery` `mountains` `beaches` `alleyways` `sky_clouds` `rocks` `trees` `water` | the matching Study + its Photo Folder |
| `asia_africa` `flowers` `other_artists` `travel_pics` `treetop_ridge` | Photo Folders only |

Capitals don't matter. Tip: keep one Cloudinary folder per tag, then after uploading select all in the folder → **Tag**.

- A photo can have several tags and will appear in each collection.
- The newest photos show first, 50 per page.
- Optional: set a photo's **caption** (Cloudinary → asset → Contextual metadata → key `caption`) to show it under the full-screen view.

### Edit notes text
On github.com, open `content/edges.md` (or any page) → click the ✏️ pencil → edit → **Commit changes**. The format is Markdown:
- `## Heading` for a heading
- `- item` for a bullet; indent two spaces for a sub-bullet
- `**bold**` for bold
- `[link text](https://…)` for a link
- `![caption](assets/picture.jpg)` for an image (upload the picture into `assets/` first)

`content/summary.md` is the "Before the first stroke" box on the home page.

### Add a new study or collection
Edit `js/config.js` and copy one line in the `studies` or `collections` list, giving it a new `slug` (used in the web address), `title`, and `tag` (the Cloudinary tag). For a study, also add `content/<slug>.md`.

---

## Notes
- **Privacy:** the site is hidden from search engines (`robots.txt` plus a `noindex` tag) but is not password protected. Anyone with the address can view it.
- **Opening the files locally:** double-clicking an `.html` file won't load the notes, because browsers block that. View the site at its web address instead.
- If the Sheet is ever unreachable, the site falls back to the starter links saved in `js/config.js`.
