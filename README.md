# GDC redesign preview

This folder contains a first visual build of the GDC website redesign. The working checklist and decisions are in [REDESIGN_PLAN_AND_TASKS.md](REDESIGN_PLAN_AND_TASKS.md).

## Preview locally

Requires Node.js 18 or later for the static pages and PHP 8.1 or later for Careers. No package installation is needed.

```powershell
node scripts/build.mjs
php -S 127.0.0.1:4174 -t .
```

Open http://127.0.0.1:4174/ in a browser. The PHP preview includes Home, Our Work, 13 case studies and the live Careers page. The Node preview server still works for static pages but cannot execute PHP.

You can also open index.html directly to review static pages. Careers and its admin require the PHP server. The old projects.html and careers.html files forward to their current pages.

Screenshots for quick review: [desktop home](previews/home-desktop.png), [mobile home](previews/home-mobile.png), [Our Work](previews/our-work-viewport.png), [case study](previews/case-study-desktop.png), [image gallery](previews/gallery-modal-desktop.png), and [Careers](previews/careers-desktop.png).

Case-study gallery thumbnails open an image viewer with next/previous controls, arrow-key navigation, and Escape to close. Project cards link to full case studies.

The main home sections fill at least the available screen height below the navigation and grow when needed for smaller screens. The hero uses four full-width, silent video clips with a darker gradient behind the left-side copy and an unobscured right half on desktop. The mobile overlay remains stronger where copy spans the video. The two buttons lead to Services and Selected Work. The client ribbon remains directly below the video, with its existing pause/resume control. Review the [hero viewport](previews/home-viewport.png), [mobile hero](previews/home-mobile-viewport.png), and [six service cards](previews/services-desktop.png).

Hero clips rotate at the end of each 12-second video. Visitors can select a video or pause playback; playback also pauses when the hero leaves the screen or the browser tab is hidden. Reduced-motion and data-saving preferences start with still images and an explicit Play button. A missing video keeps its poster and advances to the next selection. Without JavaScript, the first poster and both CTAs remain visible.

The client ribbon displays all six existing logo assets in their original colours at full opacity, including while scrolling and in reduced-motion mode.

About uses real GDC crew and event photography, a soft warm background, a welcoming introduction, and three short statements about collaboration and care. Its buttons lead to Contact and Services. The section label comes first on mobile, followed by the photos and company story. Its copy is editable through the `aboutIntro`, `aboutText`, and `aboutValues` fields in `content/site.json`.

All pages use the original logo's red G and black arrow as the tab icon. `favicon.ico` includes 16, 32, and 48 px versions; the branding folder contains a 32 px PNG fallback and a 180 px Apple touch icon.

Services uses a premium six-card layout with a distinct GDC project photo behind every card, consistent dark overlays, concise titles and summaries, and expandable full descriptions. “Discuss your brief” takes visitors to Contact and selects the matching service in the enquiry form. Disclosures work with the keyboard and without JavaScript; without JavaScript, visitors select their service in the form themselves. Review [Services on desktop](previews/services-desktop.png), [laptop](previews/services-laptop.png), and [mobile](previews/services-mobile.png). Edit `servicesHeading`, `servicesHeadingAccent`, `servicesIntro`, and the service `displayTitle`, `summary`, `detail`, and optional `image` fields in `content/site.json`.

Home sections have distinct, subtle backgrounds: warm ivory for About, cool blue-grey for Services, charcoal for How We Work, warm stone for Selected Work, soft sage for Why GDC, and warm rose/stone for Contact. Selected Work uses dark text and a dark portfolio button to create a clear transition from the process section. Brand red remains the shared accent.

How We Work is a connected four-stage journey: Understand → Shape → Deliver → Learn. Numbered nodes, connecting lines and arrows show the sequence horizontally on desktop and vertically on tablet and mobile. Each stage includes its outcome, with a Contact button below the flow. The heading, introduction and stage copy are editable in `content/site.json` through `approachHeading`, `approachHeadingAccent`, `approachIntro` and `approach`. Review [the desktop flow](previews/approach-desktop.png), [laptop](previews/approach-laptop.png) and [mobile](previews/approach-mobile.png).

Selected Work shows eight projects in two rows of four on desktop, two columns on tablet, and one on mobile. The header and footer's Our Work links and the hero's See Our Work link lead to this home section. Its View More Work button opens the full portfolio. Review the [Selected Work desktop layout](previews/selected-work-desktop.png), [shorter laptop layout](previews/selected-work-laptop.png), and [mobile layout](previews/selected-work-mobile.png).

Why GDC uses the heading “Big ideas need the right people,” a soft sage background and six expandable reasons alongside real project photography. Opening a reason changes the large photo on desktop; on smaller screens, the photo appears within the open reason. Photos with a matching case study link to it; the Shalina photo has a caption because there is no matching case study. The introduction links to Contact. The descriptions work without JavaScript; desktop keeps the initial photograph in that mode. Edit `whyHeading`, `whyHeadingAccent`, `whyIntro` and the `why` items in `content/site.json`. Review [Why GDC on desktop](previews/why-desktop.png), [laptop](previews/why-laptop.png) and [mobile](previews/why-mobile.png).

## Where to edit

- `content/site.json`: home-page and shared copy.
- `content/site.json` → `heroVideos`: the four hero clips, their posters, and associated project IDs. Short, compressed clips and matching posters live in `assets/media/hero/`.
- `content/projects.json`: project titles, summaries, case-study copy, and media references imported from the existing GDC website.
- `content/seo.json`: canonical domain, page titles, search descriptions, and project cover/gallery image descriptions. Rebuild after editing it.
- careers/index.php and careers/job.php: public roles created through the HR admin.
- admin/index.php: HR login and position editor.
- `styles.css`: visual design and responsive layouts.
- `scripts/build.mjs`: page templates. Run this script after changing content or templates.

Data Analysis & Visualization is preserved in `content/site.json` with `enabled: false` and emitted as an HTML comment. Set it to `true` and rebuild when it is needed again; the cards, discipline count, and enquiry dropdown will update together.

Selected GDC images and logos are stored in `assets/media/`. The four hero clips play in this order: NSSF AGM, Midnight East Nairobi, ARIEL Product Launch, and Swift. They are compressed local assets, about 12.4 MB in total. The case-study video players reference existing compressed files on the live GDC site. The selected media is approved; check those video URLs during final deployment.

Case-study videos, where provided, are not committed to this repository. The BLT case study uses client photos and has no video. The plan records the remaining content checks and final URL verification.

Contact sits in a centered panel capped at 1200 px, with text and the map in its first row and the contact details and enquiry form in its second row. The cards share a height on desktop, and all four elements stack on smaller screens. Review [Contact on desktop](previews/contact-desktop.png), [laptop](previews/contact-laptop.png), and [mobile](previews/contact-mobile.png).

The contact form sends enquiries through FormSubmit to info@gdc-ltd.org; the site does not use SMTP. On 9 October 2026, two labelled test posts to the live FormSubmit endpoint and a browser submission through the published redesign reached the inbox with name, email, service, and message fields. A later labelled diagnostic also arrived; live delivery had a delay. The form shows FormSubmit's default thank-you page after submission and sends no automatic response to the visitor. The map searches the listed South C address and includes a direct Google Maps link; replace the search with the exact office pin when available.

## Careers admin

Careers is a separate PHP page reached from the main navigation. It is not a home-page section. Only published roles with an open closing date appear publicly. Each role has its own page, application email or HTTPS link, and job structured data. Drafts and closed roles stay in the admin; expired roles disappear automatically from the public listing and Careers sitemap.

Set up one HR username and password once on the PHP host. By default, job records and the password hash live in a sibling folder named gdc-careers-data, outside the public website folder. If needed, set GDC_CAREERS_DATA_DIR to a different private writable folder for both setup and the PHP server. No default password is shipped.

    $env:GDC_ADMIN_USER = 'gdcadmin'
    $secure = Read-Host 'Choose a password of at least 12 characters' -AsSecureString
    $env:GDC_ADMIN_PASSWORD = (New-Object System.Net.NetworkCredential('', $secure)).Password
    php scripts/setup-careers-admin.php
    Remove-Item Env:\GDC_ADMIN_PASSWORD
    Remove-Item Env:\GDC_ADMIN_USER

Visit /admin/ to sign in. HR can create a draft, edit it, choose Published, and later choose Closed. Publishing requires a description, at least one responsibility and qualification, and an application email or HTTPS link. Running the setup script again rotates the password and ends existing admin sessions. The editor uses PHP sessions, a password hash, CSRF protection, login throttling, and escaped output. Keep the private data directory outside the website document root.

For an end-to-end local test, run `node scripts/run-careers-tests.mjs`. It starts an isolated PHP server, creates temporary test credentials, checks the admin and public Careers flow, then removes its temporary data.

### cPanel File Manager setup

For the `gdc-ltd.org` cPanel account, the document root is `public_html`. MultiPHP Manager shows PHP 8.4 for this domain, but the old production `.htaccess` still contains an `ea-php74` handler block. The release ZIP replaces that stale file with the new redirects and no PHP 7.4 handler. After extraction, confirm PHP 8.4 remains selected and that any cPanel-generated handler block says `ea-php84`; use MultiPHP Manager to reapply the version if needed. Do not manually edit a cPanel-generated handler block. The default private Careers directory is `gdc-careers-data` in the account home, alongside `public_html`. Do not put this directory or `auth.json` in the public website ZIP.

If cPanel Terminal is unavailable, run `powershell -NoProfile -ExecutionPolicy RemoteSigned -File .\scripts\prepare-careers-auth.ps1` on the local machine. The default username is `gdcadmin`. It prompts for the HR password without printing it and creates `auth.json` in a private `gdc-careers-data` directory beside this project folder. In cPanel File Manager, create `gdc-careers-data` in the account home, outside `public_html`, and upload only that `auth.json` file there. Set the directory permission to `0700` and the file permission to `0600` if the host allows it; the PHP account must be able to write to the directory. No `jobs.json` is needed for an empty Careers listing.

When uploading the new site ZIP, first keep a backup outside `public_html`. Move the old `admin`, `careers`, and `careers-data` folders to an account-home backup folder, then extract their replacements. Extracting over the old admin leaves obsolete scripts accessible. Do not empty `public_html`: keep the existing `assets/projects media` case-study videos, `.well-known`, other site folders such as `wp` and `christinawambui`, and the Google verification file. The release ZIP contains the changed project pages and new local media. Extract it directly into `public_html`, including the hidden `.htaccess` files, and move the ZIP back out of the web root afterward. Then verify `/admin/` shows the new login rather than a directory listing, sign in with the chosen credentials, and test a draft and a temporary published role before closing it. The public Careers listing should then return to no open roles.

## SEO and launch

Run node scripts/check-seo.mjs after each build. It checks the 15 generated indexable pages, all 52 gallery image descriptions, and the six active service anchors. The old HTML compatibility pages are noindex. The PHP Careers listing and open job pages are listed in the dynamic Careers sitemap.

The build writes sitemap.xml and robots.txt; Careers serves careers/sitemap.php dynamically. Publish these with all .htaccess files, including the access rules for admin, careers, content and scripts. Merge the root rules with any existing server rules. Confirm the redirects, both sitemaps, robots file, canonical URLs, PHP execution, private data path, and cache headers on the published host. Submit both sitemaps in Google Search Console and inspect the pages after deployment.

The root `.htaccess` also uses `Options -Indexes` so folders such as `assets/projects media` cannot show an Apache file listing. If this line is added to an existing live `.htaccess`, check that the homepage still loads and that a project video remains accessible; the folder URL itself should return 403.

The Careers page now shows live HR posts. The old Careers HTML preview is noindex and redirects to the PHP page.

On 1 October, local Lighthouse measured SEO 100 on Home and mobile performance 75 (desktop 83). The mobile audit identified the autoplay hero video and oversized original client logos as the largest remaining transfer costs. The local preview server does not apply the Apache cache and compression rules, so check speed again on the published host. The approved original media files have not been changed.
