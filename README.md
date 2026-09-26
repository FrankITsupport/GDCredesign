# GDC redesign preview

This folder contains a first visual build of the GDC website redesign. The working checklist and decisions are in [REDESIGN_PLAN_AND_TASKS.md](REDESIGN_PLAN_AND_TASKS.md).

## Preview locally

Requires Node.js 18 or later. No package installation is needed.

```powershell
node scripts/build.mjs
node scripts/serve.mjs
```

Open `http://localhost:4173/` in a browser. The preview includes the home page, Our Work, 13 case studies, and a Careers placeholder.

Screenshots for quick review: [desktop home](previews/home-desktop.png), [mobile home](previews/home-mobile.png), [Our Work](previews/our-work-desktop.png), [case study](previews/case-study-desktop.png), and [Careers](previews/careers-desktop.png).

## Where to edit

- `content/site.json`: home-page and shared copy.
- `content/projects.json`: project titles, summaries, case-study copy, and media references imported from the existing GDC website.
- `styles.css`: visual design and responsive layouts.
- `scripts/build.mjs`: page templates. Run this script after changing content or templates.

Selected GDC images and logos are stored in `assets/media/`. The case-study video players currently reference files on the live GDC site. Those videos should be copied and compressed for the final deployment after the visual selection is approved.

The 13 source videos total about 934 MB, so they are not committed to this repository. The plan records the pending content checks and final media delivery decision.

The contact form is a preview of an email enquiry flow. A live submission has not been tested. The Careers placeholder does not accept applications or direct candidates to email; the posting and application workflow will be planned later.

SEO work remains in the later phase of the task tracker, after the client finalises content.
