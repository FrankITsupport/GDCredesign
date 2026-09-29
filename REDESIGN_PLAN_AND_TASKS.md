# GDC website redesign — plan and task tracker

Status: Premium Services redesign and restrained section gradients ready for review; content and final case-study media remain pending
Last updated: 29 September 2026

Update this file as work progresses: change `[ ]` to `[x]` only when the task is finished. Record major client decisions under **Decision log**.

## Goal

Redesign [gdc-ltd.org](https://gdc-ltd.org/) as an elegant, easy-to-navigate site with a single-flow home page, a dedicated **Our Work** page with full case studies, and a **Careers** placeholder. The first delivery focuses on appearance, layout, media, and working navigation. SEO work follows final client content edits.

## Agreed direction

- Use HTML and CSS with light JavaScript. PHP can provide shared templates and later power the Careers posting editor.
- Use a visible, simple navigation and a natural vertical page flow inspired by [KClassique Event Rentals](https://kclassiqueventrentals.co.ke/).
- Use white or warm neutral space, charcoal/black text, slim modern typography, restrained red accents, and subtle gradients. Avoid large solid-red page sections.
- Give each home section a restrained gradient variation: warm ivory, cool blue-grey, charcoal, soft sage, and warm rose/stone. Keep brand red as the shared accent and preserve clear text contrast.
- Present six active services from GDC's [About page](https://gdc-ltd.org/about.html) in a responsive card grid:
  1. Event Design, Management & Technical Support
  2. Public Relations & Communications
  3. Creative Design, Branding & Digital Solutions
  4. Simultaneous Interpretation Equipment & Services
  5. Photography, Videography & Livestreaming
  6. Consultancy & Research
- Retain Data Analysis & Visualization in the source with `enabled: false` and an HTML comment for later. Omit it from visible service cards and the enquiry dropdown.
- Each main landing-page section fills at least the screen height below the sticky navigation. Allow sections to grow when their content needs more space on smaller screens. Keep the client ribbon inside the hero at its bottom.
- Scroll the client logos in a continuous loop, with a pause/resume control and a static, horizontally scrollable ribbon for reduced-motion preferences.
- Use a full-width hero with four short, silent GDC project videos, a light overlay, and a darker gradient on the left for readable copy. Keep two CTA buttons and the clients ribbon directly below the video.
- Remove Team from the new navigation and page plan.
- Show eight selected projects on the home page in two rows of four on desktop. The menu's **Our Work** link leads to this home section, whose **View More Work** button opens the full portfolio. Project cards open individual, fuller case studies.
- Keep Careers as a public placeholder with clearly labelled sample posts in this phase. Discuss the simple job-posting admin and application flow in a later phase; do not direct candidates to email.
- Use `info@gdc-ltd.org` and, for client review, both numbers found on the live website: visible contact number `0758 431 170` and structured-data number `+254 724 997 041`. The client will decide whether both remain.

## Content and media sources

1. **Live GDC website:** baseline for current services, company details, contact information, existing project stories, images, videos, and logos.
2. **[GDC-Co.Profile.pdf](GDC-Co.Profile.pdf):** supporting company, service, client, and positioning material.
3. **[GDC_Customer_Pitch_Deck_v2.00.pdf](GDC_Customer_Pitch_Deck_v2.00.pdf):** supporting event-service, process, and selected-work material.
4. **KClassique website:** layout and flow inspiration only; use GDC's own identity and content.

Select only material that helps visitors understand GDC and take action. Edit document copy for the web instead of transferring whole pages. Check project facts, claims, dates, and contact details when sources disagree. The user has authorized downloading GDC's existing website images, videos, and logos for this redesign.

## Proposed page map

| Page | Initial content |
| --- | --- |
| Home | Header and hero with client ribbon; short company introduction; six active services; approach or reasons to choose GDC; eight selected projects with View More Work; contact and footer. Confirm section order against the team's skeleton. |
| Our Work | Project-card grid. Each card opens a dedicated case study with a brief, GDC's role, execution, outcome where supported, and relevant images/video. |
| Careers | Designed placeholder with three expandable sample posts. Clearly identify them as dummy content and keep applications closed. The posting editor is a later phase. |

## Tasks

Preview the current build with `node scripts/serve.mjs`, then open `http://localhost:4173/`. The build contains the home page, Our Work, 13 case studies, and the Careers placeholder.

### 1. Discovery and alignment

- [x] Confirm target website and visual inspiration.
- [x] Confirm single-flow home page, separate Our Work page, and Careers placeholder.
- [x] Confirm the initial seven-service inventory; defer Data Analysis & Visualization as requested on 28 September.
- [x] Confirm Team removal, restrained red, selective document content, and deferred SEO.
- [x] Locate and review both supplied PDFs at a high level.
- [x] Review the live site's main pages and existing project-card/case-study structure.
- [ ] Review the team's skeleton when shared and agree on the final section order.
- [ ] Confirm the first release's featured projects and any client-supplied content changes.

### 2. Visual design

- [x] Create a compact style direction: colours, typography, spacing, buttons, cards, imagery, and gradient use.
- [x] Design desktop and mobile layouts for the home page.
- [x] Design the Our Work grid and a reusable case-study layout.
- [x] Design the Careers placeholder and shared header/footer.
- [ ] Review the design with the client/team and record changes here.

### 3. Content and asset preparation

- [x] Inventory the existing Our Work projects, case-study copy, project galleries, videos, and selected logos.
- [x] Download the selected GDC images and logos and organise them by project or page.
- [x] Choose hero media and selected-work thumbnails; provide still-image fallbacks for video.
- [x] Draft concise home-page copy from the live site and the relevant PDF material.
- [x] Condense the seven service descriptions for web reading while preserving their meaning.
- [ ] Review other existing site assets and download any additional approved selections.
- [x] Audit case-study text and flag missing outcomes or unclear claims for client review.
- [ ] Edit and confirm final case-study text with the client.
- [ ] Verify displayed contact details and client-logo/project permissions with the client.

### 4. Build the visual site

- [x] Build the responsive home page and navigation.
- [x] Build the six active service cards and the selected-work section; preserve the seventh service in a comment for later.
- [x] Build the Our Work grid and individual case-study pages.
- [x] Build the Careers placeholder.
- [x] Wire contact actions and the existing email enquiry flow in the preview.
- [ ] Copy or optimise final video selections and images for the finished site.

### 5. Review and finish the first design release

- [x] Check desktop, tablet, and mobile layouts for the page types in the preview.
- [x] Verify all 16 generated pages render, local links resolve, the mobile menu opens, and the project filters show the expected results.
- [x] Check all project links, keyboard menu behaviour, required form fields, reduced-motion behaviour, video poster fallbacks, and a representative video metadata load.
- [x] Check readable type, keyboard access, colour contrast, and reduced-motion behaviour on the main page types.
- [ ] Verify the live contact form submission and all final media files before launch.
- [ ] Apply team/client visual and content feedback.
- [ ] Obtain final approval of copy, project facts, media choices, and contact numbers.

### 6. After final content approval — SEO and launch preparation

**Deferred until client edits and content choices are final.**

- [ ] Write final page titles, descriptions, headings, image descriptions, and search-focused service copy.
- [ ] Finalise case-study URLs, canonical links, structured data, and sitemap.
- [ ] Map existing URLs to the redesign and add redirects where content moves.
- [ ] Review page speed and search indexing in Google Search Console.
- [ ] Verify the published site and monitor indexing after launch.

### Requested compact revision — 28 September 2026

- [x] Reduce spacing across home sections, page introductions, case studies, and the footer.
- [x] Reduce project thumbnail, gallery, and video display sizes; show four project cards per row on wide screens.
- [x] Add an image gallery modal to all case studies with next/previous controls, arrow keys, Escape, backdrop close, and focus return.
- [x] Use explicit HTML links so home, work, case-study, and Careers navigation works through both the preview server and direct local files.
- [x] Provide working `projects.html` and `careers.html` compatibility links.
- [x] Add three expandable dummy Careers posts with no application or admin workflow.
- [x] Check the revision at 320, 390, 768, 1440, and 1915 px widths; update review screenshots.

### Later scope — Careers posting editor

- [ ] Agree on the admin workflow and access requirements.
- [ ] Build or adapt the job-posting editor for creating, editing, publishing, and closing roles.
- [ ] Confirm the application destination and verify expired roles no longer appear open.

### Landing-page viewport revision — 28 September 2026

- [x] Make the main home sections fill the available viewport height below the navigation; allow natural growth for smaller screens.
- [x] Include the client ribbon at the bottom of the hero, with About beginning below the first screen.
- [x] Display six services as cards in three columns on desktop, two on tablet, and one on mobile.
- [x] Disable and comment out Data Analysis & Visualization while keeping its source content for later; remove it from the enquiry dropdown.
- [x] Add a seamless repeating client-logo track with pause/resume and reduced-motion handling.
- [x] Check viewport boundaries, card count, loop continuity, responsive widths, and accessibility; update the home and Services previews.

### Selected Work revision — 28 September 2026

- [x] Expand the home selection to eight existing projects in two rows of four on desktop, two columns on tablet, and one on mobile.
- [x] Keep compact thumbnails and a single View More Work button in the section.
- [x] Point the shared Our Work navigation and hero work link to the home-page Selected Work section.
- [x] Preserve project-card links to individual case studies and the section button's link to the full portfolio.
- [x] Check responsive layouts and the navigation flow, including direct-file previews; update screenshots.

### Full-width video hero revision — 29 September 2026

- [x] Replace the split image hero with a full-width video background, light overlay, and darker left-side gradient for readable text.
- [x] Prepare three local, silent, 12-second clips from Swift Connect Africa, IEA Global Conference, and UN SACCO Jubilee Celebration, with matching still-image posters.
- [x] Keep two CTA buttons leading to Services and Selected Work, and preserve the client ribbon directly below the video.
- [x] Rotate clips, add numbered selection and pause/play controls, and pause video when the hero is offscreen or the tab is hidden.
- [x] Start with still images for reduced-motion and data-saving preferences; provide missing-video, blocked-autoplay, and no-JavaScript fallbacks.
- [x] Keep the reduced-motion client ribbon accessible to keyboard scrolling.
- [x] Check seven desktop, tablet, and mobile sizes, all three clips, CTA links, ribbon controls, fallbacks, local-file playback, and accessibility; update the home previews.

### GDC favicon and About redesign — 29 September 2026

- [x] Use the existing logo's G symbol and black arrow as a legible tab icon; provide 16/32/48 px ICO, 32 px PNG, and 180 px Apple touch assets.
- [x] Include favicon links on all pages, including nested case studies and compatibility pages; serve the ICO with its image MIME type.
- [x] Redesign About with real crew photography, inset event imagery, warm gradients, a welcoming heading, and concise statements about listening, collaboration, and care.
- [x] Keep company copy editable in the content file and add working Contact and Services actions.
- [x] Optimise About photos as local WebP assets and arrange the heading, imagery, and story in a readable mobile order.
- [x] Check eight responsive sizes, all 18 pages' favicon references, icon sizes and responses, keyboard navigation, CTA destinations, direct-file previews, and accessibility; refresh About and full-home screenshots.

### Premium Services and section backgrounds — 29 September 2026

- [x] Redesign the six service cards with concise display titles, approachable summaries, refined icon treatment, soft corners, and distinct GDC project photos with matching dark overlays on every card.
- [x] Preserve the official service titles and complete descriptions in accessible, expandable disclosures; keep Data Analysis & Visualization disabled and commented out.
- [x] Add service-specific enquiry links that select the matching official service in the contact form, plus a section-level conversation CTA.
- [x] Add restrained gradient variations to Services, Approach, Selected Work, Why GDC, and Contact while retaining the accepted About design.
- [x] Keep the three-video hero, clients ribbon, favicon, About layout, selected-work navigation, and contact form destinations intact.
- [x] Check eight responsive sizes, all six enquiry selections, keyboard and no-JavaScript disclosures, direct-file previews, expanded/collapsed accessibility, and local references; update Services and full-home previews.

## Decision log

| Date | Decision |
| --- | --- |
| 26 Sep 2026 | Keep the home page as a normal vertical flow. Our Work gets a separate page and full case studies. |
| 26 Sep 2026 | Include all seven live-site services; remove Team. |
| 26 Sep 2026 | Use red sparingly with charcoal, neutral space, and subtle gradients. |
| 26 Sep 2026 | Careers is a placeholder for the first design release; posting admin comes later. |
| 26 Sep 2026 | Use existing website media and selective material from both PDFs. |
| 26 Sep 2026 | Defer SEO work until the client finalises content. |
| 26 Sep 2026 | First visual build completed locally: home, Our Work, 13 case studies, and Careers placeholder. Project videos currently stream from the live GDC site; final media files remain to be prepared. |
| 26 Sep 2026 | The Careers placeholder links to the work portfolio rather than inviting applications by email. |
| 26 Sep 2026 | The first visual direction received positive initial feedback. Continue with functional, content, and media review before final client approval. |
| 26 Sep 2026 | The 13 existing case videos are about 934 MB in total. Keep the live-site links for this review; prepare a compressed delivery plan before release. |
| 28 Sep 2026 | Reduce unused vertical space throughout the site and make project imagery more compact. Case-study gallery images open in a modal; project cards continue to open full case studies. |
| 28 Sep 2026 | Careers now shows three clearly labelled dummy posts with expandable details. Applications and admin access remain deferred. |
| 28 Sep 2026 | Use explicit `index.html` page links for direct-file and server previews, plus compatibility links for `projects.html` and `careers.html`. Final search URL decisions remain deferred. |
| 28 Sep 2026 | Main home sections now fill the available screen height. The client ribbon belongs to the hero, so About does not appear in its initial screen. Sections can grow for readable content on smaller displays. |
| 28 Sep 2026 | Services now use six cards. Data Analysis & Visualization is disabled in the content source and preserved in an HTML comment for later. |
| 28 Sep 2026 | The client-logo ribbon scrolls continuously through two matching groups. Pause/resume preserves its position, and reduced-motion mode displays a static ribbon. |
| 28 Sep 2026 | Expand Selected Work to eight projects in two desktop rows. Our Work in the menu leads to this landing-page section; its View More Work button opens the full portfolio. Footer and hero work links follow the same section flow. |
| 29 Sep 2026 | Use a full-width video hero with three initial GDC project clips, a light overlay and darker left gradient, two CTA buttons, and the clients ribbon below. The initial selection uses Swift, IEA, and UN SACCO; short compressed clips and posters are now local. |
| 29 Sep 2026 | Add a GDC tab icon across the site. Give About a warmer, more inviting design using real GDC crew and event photographs, the heading “Good work starts with a great partnership,” and Contact/Services actions. |
| 29 Sep 2026 | Give Services a more premium presentation with shorter visible titles, expandable full descriptions, a featured GDC event image, and service-specific enquiry links. Use restrained gradient variations across the home sections. |
| 29 Sep 2026 | Extend the photo background treatment to all six service cards. Use distinct GDC images with consistent overlays and white text for a cohesive presentation. |
| 29 Sep 2026 | Display the six existing client logos in their original colours at full opacity. Remove the grayscale styling; retain the ribbon's scrolling, pause/resume, and reduced-motion behaviour. |
| 29 Sep 2026 | Replace the second hero selection, IEA, with a short Midnight East Nairobi excerpt showing the illuminated entrance and evening event. Supply a matching poster and keep Swift and UN SACCO in the first and third positions. |
| 29 Sep 2026 | Replace the third hero selection, UN SACCO, with ARIEL Product Launch footage highlighting the stage, screen, branded reveal, and venue. Keep the approved Midnight East Nairobi clip second and provide a matching ARIEL poster. |
| 29 Sep 2026 | Add a fourth hero selection from the NSSF AGM reel, highlighting the completed stage, screens, lighting, and conference layout. Supply a matching poster and extend the numbered controls and rotation to four videos. |
| 29 Sep 2026 | Move NSSF to the first hero position and Swift to the last. The order is NSSF, Midnight East Nairobi, ARIEL, Swift; NSSF also supplies the initial still-image fallback. |

## Preview review notes

- The fourth hero selection was checked at 1440×900, 390×844, and 320×568: NSSF AGM plays silently for 12 seconds at 1280×720 with a matching loaded poster. All four numbered selectors fit within the viewport and stay below the copy, with no horizontal overflow. Midnight East rotates through ARIEL to NSSF, and NSSF loops back to Swift. All six client logos retain their original colours. Desktop and mobile home previews were refreshed.
- The replacement third hero clip was checked at 1440×900 and 390×844: ARIEL Product Launch plays silently for 12 seconds at 1280×720, has a matching loaded poster, and loops to Swift. The approved Midnight East clip still plays in the second position. Reduced-motion selection displays the ARIEL poster without loading video. All six client logos retain their original colours; no horizontal overflow or browser script errors were found. Home previews were refreshed.
- The replacement second hero clip was checked at 1440×900 and 390×844: Midnight East Nairobi plays silently for 12 seconds at 1280×720, has a matching loaded poster, and advances to UN SACCO. Reduced-motion selection keeps the poster without loading video. All six client logos retain their original colours, no horizontal overflow or browser script errors were found, and home previews were refreshed.
- The six-card photo treatment was checked at 1440×900, 1366×768, 390×844, and 320×568. All six distinct 900×506 images loaded, each card uses readable white headings and a dark fallback background, and no horizontal overflow was found. Automated WCAG A/AA checks found no home-page violations at 390 and 1440 px with all disclosures collapsed or expanded. Services and full-home previews were refreshed.
- The Services revision was checked at 1915×917, 1440×900, 1366×768, 1024×768, 768×1024, 600×900, 390×844, and 320×568. All six cards and the featured photo render with no horizontal overflow, using three/two/one columns. The collapsed section fits the desktop viewport at the three tested desktop sizes and grows as needed on smaller screens or when details open. All six enquiry links select the correct official service, the section CTA reaches Contact, and native disclosures work with Enter and without JavaScript. Direct-file previews and all 18 pages' local references passed. Automated WCAG A/AA checks found no home-page violations at 390 and 1440 px with descriptions both collapsed and expanded; no browser script errors were reported. All main home sections use restrained gradients, and the hero/ribbon counts remain three videos and six clients.
- The About redesign was checked at 1915×917, 1440×900, 1366×768, 1024×768, 768×1024, 600×900, 390×844, and 320×568. Photos loaded, content stayed within its section, and no horizontal overflow was found. About navigation lands below the sticky header; both new actions work through server and direct-file previews. All 18 generated pages have valid local references and favicon links, including nested pages. ICO entries contain 16/32/48 px images, and icon files return the correct image MIME types. Automated WCAG A/AA checks found no home-page violations at 390 and 1440 px; no browser script errors were reported.
- The video hero was checked at 1915×917, 1440×900, 1366×768, 1024×768, 768×1024, 390×844, and 320×568. All three local clips play silently at 1280×720 and rotate correctly. The video spans the viewport, the ribbon sits directly underneath, and no horizontal overflow or overlapping copy/controls was found. Very small screens allow the hero to grow. Manual selection, pause/resume, offscreen pause, both CTAs, client controls, direct-file playback, reduced-motion preference changes, data-saving preferences, missing-video handling, blocked autoplay, and no-JavaScript fallbacks passed. Automated WCAG A/AA checks found no violations on the home page at 390 and 1440 px or on the reduced-motion hero. All 18 generated pages have valid local references, including hero clips and posters.
- The preview was checked at 390 px, 768 px, and 1440 px widths. The tested pages returned successfully, had no horizontal overflow or browser script errors, and each had one main heading.
- The mobile menu and four Our Work filters worked. The selected project images loaded in the preview.
- All 13 case-study cards open. The skip link, mobile menu keyboard controls, required form fields, and reduced-motion setting worked. An automated WCAG A/AA scan found no violations on the tested home, work, case-study, and Careers layouts at mobile and desktop widths; manual review remains important as content changes.
- All 13 remote video URLs returned MP4 responses. The Swift case-study video loaded its metadata in the browser, and its local cover displayed as a poster. The contact enquiry form has not been submitted, and the full set of final videos has not been played through.
- The compact revision has no horizontal overflow at the five tested widths. All 18 HTML files have valid local references. Gallery opening, image navigation, keyboard focus, Escape, backdrop close, mobile sizing, and returning focus were checked. Direct local-file navigation and the three expandable sample Careers posts also worked.
- The viewport revision was checked at 1915×917, 1440×900, 1366×768, 1024×768, 768×1024, 390×844, and 320×568. About stays below the first screen, the ribbon ends with the hero, and no horizontal overflow or hero copy clipping was found. Very small screens allow the hero and longer sections to grow.
- Six active service cards render, and the deferred service is absent from the dropdown. The matching logo groups line up at the animation wrap point with no measured jump. Pause/resume and reduced-motion handling work. The home-page automated accessibility checks found no violations at the tested mobile and desktop widths.
- The eight-project Selected Work grid was checked at the same seven screen sizes. It uses two rows on desktop and fits the available height at 1915×917, 1440×900, and 1366×768. Images fill their cards while staying compact. Header links land below the sticky navigation, the section button opens all 13 projects, and project cards open their case studies. Return navigation, the mobile menu, and direct-file previews passed. All 18 HTML files have valid local references, with no browser script errors or horizontal overflow in the tested layouts. The home-page automated accessibility scan found no violations at 390 and 1440 px.

## Content review queue

- **Featured work:** the home page currently highlights Swift Connect Africa, IEA Global Conference, ARIEL Product Launch, UN SACCO Jubilee Celebration, Midnight East Nairobi, 5th Safe Schools Declaration, 10th NSSF Annual General Meeting, and NSSF Migaa Golf Tournament. Confirm these eight projects and their order with the client.
- **Specific claims to confirm:** KAIICO's attendance/exhibitor counts and named guests; Midnight East's audience size and four-city connection; and the IEA case study's broad impact statements. These are carried over from the live website and should be checked against client records before publication.
- **Short case studies:** ISSA, Regional Climate Change Summit, NSSF AGM, APRA, ARIEL, YNBS, UN SACCO, and Migaa mainly describe the event and GDC's general role. Ask the client for concrete deliverables, GDC's exact scope, and approved outcomes. Avoid inventing results.
- **Contact and identity:** confirm which of the two published phone numbers to show, plus approval for client logos and project media.
- **Media delivery:** keep the local photo galleries; choose compression and hosting for the 13 case videos before launch. The original files total about 934 MB and are not in the Git repository.

## Open decisions

- Final home-page section order after reviewing the team's skeleton.
- Which projects should appear in the home-page preview, and which case studies need fuller content.
- Final choice of phone number(s) after client review.
- Final hero clip selection if the client wants to replace the current Swift, Midnight East Nairobi, ARIEL, or NSSF excerpts.
