# GDC redesign preview

This folder contains a first visual build of the GDC website redesign. The working checklist and decisions are in [REDESIGN_PLAN_AND_TASKS.md](REDESIGN_PLAN_AND_TASKS.md).

## Preview locally

Requires Node.js 18 or later. No package installation is needed.

```powershell
node scripts/build.mjs
node scripts/serve.mjs
```

Open `http://localhost:4173/` in a browser. The preview includes the home page, Our Work, 13 case studies, and a Careers placeholder.

You can also open `index.html` directly. Internal page links include the HTML filename, so Our Work, case studies, and Careers work in direct-file previews too. `projects.html` and `careers.html` forward to their current pages.

Screenshots for quick review: [desktop home](previews/home-desktop.png), [mobile home](previews/home-mobile.png), [Our Work](previews/our-work-viewport.png), [case study](previews/case-study-desktop.png), [image gallery](previews/gallery-modal-desktop.png), and [Careers](previews/careers-desktop.png).

Case-study gallery thumbnails open an image viewer with next/previous controls, arrow-key navigation, and Escape to close. Project cards link to full case studies.

The main home sections fill at least the available screen height below the navigation and grow when needed for smaller screens. The hero uses three full-width, silent video clips with a light overlay and a darker gradient behind the copy. The two buttons lead to Services and Selected Work. The client ribbon remains directly below the video, with its existing pause/resume control. Review the [hero viewport](previews/home-viewport.png), [mobile hero](previews/home-mobile-viewport.png), and [six service cards](previews/services-desktop.png).

Hero clips rotate at the end of each 12-second video. Visitors can select a video or pause playback; playback also pauses when the hero leaves the screen or the browser tab is hidden. Reduced-motion and data-saving preferences start with still images and an explicit Play button. A missing video keeps its poster and advances to the next selection. Without JavaScript, the first poster and both CTAs remain visible.

Selected Work shows eight projects in two rows of four on desktop, two columns on tablet, and one on mobile. The header and footer's Our Work links and the hero's See Our Work link lead to this home section. Its View More Work button opens the full portfolio. Review the [Selected Work desktop layout](previews/selected-work-desktop.png), [shorter laptop layout](previews/selected-work-laptop.png), and [mobile layout](previews/selected-work-mobile.png).

## Where to edit

- `content/site.json`: home-page and shared copy.
- `content/site.json` → `heroVideos`: the three hero clips, their posters, and associated project IDs. Short, compressed clips and matching posters live in `assets/media/hero/`.
- `content/projects.json`: project titles, summaries, case-study copy, and media references imported from the existing GDC website.
- `content/careers.json`: three clearly labelled sample Careers posts for layout review.
- `styles.css`: visual design and responsive layouts.
- `scripts/build.mjs`: page templates. Run this script after changing content or templates.

Data Analysis & Visualization is preserved in `content/site.json` with `enabled: false` and emitted as an HTML comment. Set it to `true` and rebuild when it is needed again; the cards, heading count, and enquiry dropdown will update together.

Selected GDC images and logos are stored in `assets/media/`. The three hero clips are compressed local assets, about 9.7 MB in total. The case-study video players currently reference files on the live GDC site. Those full videos should be copied and compressed for the final deployment after the visual selection is approved.

The 13 source videos total about 934 MB, so they are not committed to this repository. The plan records the pending content checks and final media delivery decision.

The contact form is a preview of an email enquiry flow. A live submission has not been tested. The Careers posts are dummy content with expandable descriptions. They do not accept applications or direct candidates to email; the posting and application workflow will be planned later.

SEO work remains in the later phase of the task tracker, after the client finalises content.
