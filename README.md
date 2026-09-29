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

The main home sections fill at least the available screen height below the navigation and grow when needed for smaller screens. The hero uses four full-width, silent video clips with a light overlay and a darker gradient behind the copy. The two buttons lead to Services and Selected Work. The client ribbon remains directly below the video, with its existing pause/resume control. Review the [hero viewport](previews/home-viewport.png), [mobile hero](previews/home-mobile-viewport.png), and [six service cards](previews/services-desktop.png).

Hero clips rotate at the end of each 12-second video. Visitors can select a video or pause playback; playback also pauses when the hero leaves the screen or the browser tab is hidden. Reduced-motion and data-saving preferences start with still images and an explicit Play button. A missing video keeps its poster and advances to the next selection. Without JavaScript, the first poster and both CTAs remain visible.

The client ribbon displays all six existing logo assets in their original colours at full opacity, including while scrolling and in reduced-motion mode.

About uses real GDC crew and event photography, a soft warm background, a welcoming introduction, and three short statements about collaboration and care. Its buttons lead to Contact and Services. The heading comes first on mobile, followed by the photos and company story. Review [About on desktop](previews/about-desktop.png) and [About on mobile](previews/about-mobile.png). Its copy is editable through the `aboutHeading`, `aboutHeadingAccent`, `aboutIntro`, `aboutText`, and `aboutValues` fields in `content/site.json`.

All pages use the original logo's red G and black arrow as the tab icon. `favicon.ico` includes 16, 32, and 48 px versions; the branding folder contains a 32 px PNG fallback and a 180 px Apple touch icon.

Services uses a premium six-card layout with a distinct GDC project photo behind every card, consistent dark overlays, concise titles and summaries, and expandable full descriptions. “Discuss your brief” takes visitors to Contact and selects the matching service in the enquiry form. Disclosures work with the keyboard and without JavaScript; without JavaScript, visitors select their service in the form themselves. Review [Services on desktop](previews/services-desktop.png), [laptop](previews/services-laptop.png), and [mobile](previews/services-mobile.png). Edit `servicesHeading`, `servicesHeadingAccent`, `servicesIntro`, and the service `displayTitle`, `summary`, `detail`, and optional `image` fields in `content/site.json`.

Home sections have distinct, subtle backgrounds: warm ivory for About, cool blue-grey for Services, charcoal for How We Work, warm stone for Selected Work, soft sage for Why GDC, and warm rose/stone for Contact. Selected Work uses dark text and a dark portfolio button to create a clear transition from the process section. Brand red remains the shared accent.

How We Work is a connected four-stage journey: Understand → Shape → Deliver → Learn. Numbered nodes, connecting lines and arrows show the sequence horizontally on desktop and vertically on tablet and mobile. Each stage includes its outcome, with a Contact button below the flow. The heading, introduction and stage copy are editable in `content/site.json` through `approachHeading`, `approachHeadingAccent`, `approachIntro` and `approach`. Review [the desktop flow](previews/approach-desktop.png), [laptop](previews/approach-laptop.png) and [mobile](previews/approach-mobile.png).

Selected Work shows eight projects in two rows of four on desktop, two columns on tablet, and one on mobile. The header and footer's Our Work links and the hero's See Our Work link lead to this home section. Its View More Work button opens the full portfolio. Review the [Selected Work desktop layout](previews/selected-work-desktop.png), [shorter laptop layout](previews/selected-work-laptop.png), and [mobile layout](previews/selected-work-mobile.png).

## Where to edit

- `content/site.json`: home-page and shared copy.
- `content/site.json` → `heroVideos`: the four hero clips, their posters, and associated project IDs. Short, compressed clips and matching posters live in `assets/media/hero/`.
- `content/projects.json`: project titles, summaries, case-study copy, and media references imported from the existing GDC website.
- `content/careers.json`: three clearly labelled sample Careers posts for layout review.
- `styles.css`: visual design and responsive layouts.
- `scripts/build.mjs`: page templates. Run this script after changing content or templates.

Data Analysis & Visualization is preserved in `content/site.json` with `enabled: false` and emitted as an HTML comment. Set it to `true` and rebuild when it is needed again; the cards, discipline count, and enquiry dropdown will update together.

Selected GDC images and logos are stored in `assets/media/`. The four hero clips play in this order: NSSF AGM, Midnight East Nairobi, ARIEL Product Launch, and Swift. They are compressed local assets, about 12.4 MB in total. The case-study video players currently reference files on the live GDC site. Those full videos should be copied and compressed for the final deployment after the visual selection is approved.

The 13 source videos total about 934 MB, so they are not committed to this repository. The plan records the pending content checks and final media delivery decision.

The contact form is a preview of an email enquiry flow. A live submission has not been tested. The Careers posts are dummy content with expandable descriptions. They do not accept applications or direct candidates to email; the posting and application workflow will be planned later.

SEO work remains in the later phase of the task tracker, after the client finalises content.
