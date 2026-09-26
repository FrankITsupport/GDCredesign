# GDC website redesign — plan and task tracker

Status: visual build complete; content and media review in progress
Last updated: 26 September 2026

Update this file as work progresses: change `[ ]` to `[x]` only when the task is finished. Record major client decisions under **Decision log**.

## Goal

Redesign [gdc-ltd.org](https://gdc-ltd.org/) as an elegant, easy-to-navigate site with a single-flow home page, a dedicated **Our Work** page with full case studies, and a **Careers** placeholder. The first delivery focuses on appearance, layout, media, and working navigation. SEO work follows final client content edits.

## Agreed direction

- Use HTML and CSS with light JavaScript. PHP can provide shared templates and later power the Careers posting editor.
- Use a visible, simple navigation and a natural vertical page flow inspired by [KClassique Event Rentals](https://kclassiqueventrentals.co.ke/).
- Use white or warm neutral space, charcoal/black text, slim modern typography, restrained red accents, and subtle gradients. Avoid large solid-red page sections.
- Cover all seven services currently listed on GDC's [About page](https://gdc-ltd.org/about.html):
  1. Event Design, Management & Technical Support
  2. Public Relations & Communications
  3. Creative Design, Branding & Digital Solutions
  4. Simultaneous Interpretation Equipment & Services
  5. Photography, Videography & Livestreaming
  6. Data Analysis & Visualization
  7. Consultancy & Research
- Remove Team from the new navigation and page plan.
- Show selected projects on the home page with a **View More Work** link. The Our Work page opens individual, fuller case studies.
- Keep Careers as a public placeholder in this phase. Discuss the simple job-posting admin and application flow in a later phase; the current site uses email applications.
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
| Home | Header and hero; short company introduction; seven services; approach or reasons to choose GDC; selected client/project proof; selected work with View More Work; contact and footer. Confirm section order against the team's skeleton. |
| Our Work | Project-card grid. Each card opens a dedicated case study with a brief, GDC's role, execution, outcome where supported, and relevant images/video. |
| Careers | Designed placeholder with a short introduction and space for future openings. The posting editor is a later phase. |

## Tasks

Preview the current build with `node scripts/serve.mjs`, then open `http://localhost:4173/`. The build contains the home page, Our Work, 13 case studies, and the Careers placeholder.

### 1. Discovery and alignment

- [x] Confirm target website and visual inspiration.
- [x] Confirm single-flow home page, separate Our Work page, and Careers placeholder.
- [x] Confirm all seven live-site services must appear.
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
- [x] Build all seven service presentations and the selected-work section.
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

### Later scope — Careers posting editor

- [ ] Agree on the admin workflow and access requirements.
- [ ] Build or adapt the job-posting editor for creating, editing, publishing, and closing roles.
- [ ] Confirm the application destination and verify expired roles no longer appear open.

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

## Preview review notes

- The preview was checked at 390 px, 768 px, and 1440 px widths. The tested pages returned successfully, had no horizontal overflow or browser script errors, and each had one main heading.
- The mobile menu and four Our Work filters worked. The selected project images loaded in the preview.
- All 13 case-study cards open. The skip link, mobile menu keyboard controls, required form fields, and reduced-motion setting worked. An automated WCAG A/AA scan found no violations on the tested home, work, case-study, and Careers layouts at mobile and desktop widths; manual review remains important as content changes.
- All 13 remote video URLs returned MP4 responses. The Swift case-study video loaded its metadata in the browser, and its local cover displayed as a poster. The contact enquiry form has not been submitted, and the full set of final videos has not been played through.

## Content review queue

- **Featured work:** the home page currently highlights Swift Connect Africa, IEA Global Conference, ARIEL Product Launch, and UN SACCO Jubilee Celebration. Confirm the four projects and their order with the client.
- **Specific claims to confirm:** KAIICO's attendance/exhibitor counts and named guests; Midnight East's audience size and four-city connection; and the IEA case study's broad impact statements. These are carried over from the live website and should be checked against client records before publication.
- **Short case studies:** ISSA, Regional Climate Change Summit, NSSF AGM, APRA, ARIEL, YNBS, UN SACCO, and Migaa mainly describe the event and GDC's general role. Ask the client for concrete deliverables, GDC's exact scope, and approved outcomes. Avoid inventing results.
- **Contact and identity:** confirm which of the two published phone numbers to show, plus approval for client logos and project media.
- **Media delivery:** keep the local photo galleries; choose compression and hosting for the 13 case videos before launch. The original files total about 934 MB and are not in the Git repository.

## Open decisions

- Final home-page section order after reviewing the team's skeleton.
- Which projects should appear in the home-page preview, and which case studies need fuller content.
- Final choice of phone number(s) after client review.
- Whether the first hero uses a still image or a short video.
