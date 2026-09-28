import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(join(root, 'content/site.json'), 'utf8'));
const projects = JSON.parse(readFileSync(join(root, 'content/projects.json'), 'utf8'));
const careerPosts = JSON.parse(readFileSync(join(root, 'content/careers.json'), 'utf8'));

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const attr = esc;
const slugify = (value) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const urlFor = (project, prefix = '') => `${prefix}our-work/${slugify(project.title)}/index.html`;
const asset = (path, prefix = '') => `${prefix}${path}`;
const arrow = '<span aria-hidden="true">↗</span>';

function write(relativePath, html) {
  const fullPath = join(root, relativePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, html.replace(/[ \t]+$/gm, ''), 'utf8');
}

function header(prefix, active = '') {
  const nav = [
    ['About', `${prefix}index.html#about`, 'about'],
    ['Services', `${prefix}index.html#services`, 'services'],
    ['Our Work', `${prefix}our-work/index.html`, 'work'],
    ['Careers', `${prefix}careers/index.html`, 'careers'],
    ['Contact', `${prefix}index.html#contact`, 'contact']
  ];
  return `
    <header class="site-header" id="top">
      <div class="header-inner container">
        <a class="brand" href="${prefix}index.html" aria-label="Global Digital Centre home">
          <span class="brand-mark"><img src="${prefix}assets/media/branding/gdc-logo-alt.png" alt="" width="83" height="43"></span>
          <span class="brand-name">GLOBAL DIGITAL<br>CENTRE</span>
        </a>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">
          <span></span><span></span>
        </button>
        <nav class="main-nav" id="main-nav" aria-label="Main navigation">
          ${nav.map(([label, href, key]) => `<a href="${href}" ${key === active ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
          <a class="nav-cta" href="${prefix}index.html#contact">Let's talk ${arrow}</a>
        </nav>
      </div>
    </header>`;
}

function footer(prefix) {
  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <p class="footer-kicker">GLOBAL DIGITAL CENTRE</p>
          <p class="footer-statement">Ideas made real.<br>Impact made visible.</p>
        </div>
        <div class="footer-links">
          <span>Explore</span>
          <a href="${prefix}index.html#about">About</a>
          <a href="${prefix}index.html#services">Services</a>
          <a href="${prefix}our-work/index.html">Our Work</a>
          <a href="${prefix}careers/index.html">Careers</a>
        </div>
        <div class="footer-links">
          <span>Connect</span>
          <a href="mailto:${attr(site.contact.email)}">${esc(site.contact.email)}</a>
          <a href="tel:+254758431170">${esc(site.contact.phones[0])}</a>
          <a href="tel:+254724997041">${esc(site.contact.phones[1])}</a>
          <div class="social-links">
            <a href="${attr(site.social.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="${attr(site.social.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      <div class="container footer-bottom"><span>© ${new Date().getFullYear()} Global Digital Centre</span><span>Nairobi, Kenya · Across Africa</span></div>
    </footer>`;
}

function page({ title, description, prefix = '', active = '', body, bodyClass = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f8f7f5">
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${prefix}styles.css">
  <script src="${prefix}script.js" defer></script>
</head>
<body class="${bodyClass}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${header(prefix, active)}
  <main id="main">${body}</main>
  ${footer(prefix)}
</body>
</html>`;
}

function card(project, prefix = '', size = '', headingLevel = 3) {
  return `<a class="project-card ${size}" href="${urlFor(project, prefix)}" data-category="${attr(groupFor(project))}">
    <div class="project-card-image"><img src="${asset(project.cover, prefix)}" alt="${attr(project.title)} project" loading="lazy" decoding="async"><span class="card-arrow" aria-hidden="true">↗</span></div>
    <div class="project-card-meta"><span>${esc(project.category)}</span><span>View project ${arrow}</span></div>
    <h${headingLevel}>${esc(project.title)}</h${headingLevel}>
  </a>`;
}

function groupFor(project) {
  if (['shanila', 'ariel', 'un-sacco'].includes(project.id)) return 'Experiences';
  if (['nssf', 'migaa'].includes(project.id)) return 'Corporate';
  return 'Conferences';
}

const featured = ['swift', 'iea', 'ariel', 'un-sacco'].map(id => projects.find(project => project.id === id));
const clientLogos = [
  ['iea.png', 'International Energy Agency'],
  ['nssf.png', 'NSSF'],
  ['swift.png', 'SWIFT'],
  ['pandg.png', 'P&G'],
  ['issa.png', 'ISSA'],
  ['kentraco.png', 'KETRACO']
];

const home = `
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-line"></span> NAIROBI · WORKING ACROSS AFRICA</p>
        <h1 id="hero-title">Your vision.<br>Our strategy.<br><em>Real impact.</em></h1>
        <p class="hero-lead">${esc(site.heroLead)}</p>
        <div class="hero-actions">
          <a class="button button-dark" href="#services">Explore our services ${arrow}</a>
          <a class="text-link" href="our-work/index.html">See our work <span aria-hidden="true">→</span></a>
        </div>
        <div class="hero-caption"><span class="tiny-red-line"></span> Strategy · Creativity · Delivery</div>
      </div>
      <div class="hero-media">
        <div class="hero-image-main"><img src="assets/media/projects/un-sacco/cover.jpg" alt="A GDC-produced celebration venue ready for guests" fetchpriority="high"></div>
        <div class="hero-image-inset"><img src="assets/media/projects/issa/cover.jpg" alt="GDC production crew at work" loading="lazy"></div>
        <div class="hero-media-label">BEHIND EVERY MOMENT IS A PLAN</div>
      </div>
    </div>
    <div class="hero-bottom container"><span>01 / DISCOVER GDC</span><a href="#about" aria-label="Scroll to about GDC">Scroll to explore <span aria-hidden="true">↓</span></a></div>
  </section>

  <section class="client-strip" aria-label="Selected clients">
    <div class="container client-strip-inner"><span>TRUSTED BY TEAMS INCLUDING</span><div class="client-logos">${clientLogos.map(([file, name]) => `<span class="client-logo"><img src="assets/media/clients/${file}" alt="${name}" loading="lazy"></span>`).join('')}</div></div>
  </section>

  <section class="section about-section" id="about">
    <div class="container about-layout">
      <div><p class="section-label">01 / ABOUT US</p><h2 class="section-heading">${esc(site.aboutHeading)}</h2></div>
      <div class="about-content"><p class="large-copy">${esc(site.aboutText)}</p><p class="muted-copy">We shape experiences, tell stories and build the systems that help organisations connect with the people who matter.</p><a class="underlined-link" href="#services">Discover what we do <span aria-hidden="true">↗</span></a></div>
    </div>
  </section>

  <section class="section services-section" id="services">
    <div class="container">
      <div class="section-intro"><div><p class="section-label">02 / WHAT WE DO</p><h2 class="section-heading">Seven ways to bring<br>your brief to life.</h2></div><p>${esc(site.servicesIntro)}</p></div>
      <div class="services-list">${site.services.map((service, index) => `<article class="service-item">
        <span class="service-number">${String(index + 1).padStart(2, '0')}</span>
        <div><h3>${esc(service.title)}</h3><p>${esc(service.summary)}</p><span class="service-detail">${esc(service.detail)}</span></div>
        <span class="service-plus" aria-hidden="true">↗</span>
      </article>`).join('')}</div>
    </div>
  </section>

  <section class="section approach-section" id="approach">
    <div class="container approach-layout">
      <div class="approach-heading"><p class="section-label">03 / HOW WE WORK</p><h2 class="section-heading">Thought through.<br><em>Well delivered.</em></h2><p>One connected approach, shaped around your objective and carried through every stage.</p></div>
      <div class="approach-steps">${site.approach.map((step, index) => `<div class="approach-step"><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${esc(step.step)}</h3><p>${esc(step.description)}</p></div></div>`).join('')}</div>
    </div>
  </section>

  <section class="section work-preview" id="work">
    <div class="container">
      <div class="section-intro work-intro"><div><p class="section-label">04 / SELECTED WORK</p><h2 class="section-heading">The work behind<br>the moments.</h2></div><div><p>Different briefs. One commitment to work that is thoughtful, visible and carefully delivered.</p><a class="button button-outline-light" href="our-work/index.html">View more work ${arrow}</a></div></div>
      <div class="preview-grid">${featured.map((project, index) => card(project, '', index === 0 ? 'project-card-large' : '')).join('')}</div>
      <div class="work-bottom-link"><a href="our-work/index.html">Explore all projects <span aria-hidden="true">↗</span></a></div>
    </div>
  </section>

  <section class="section why-section">
    <div class="container"><div class="section-intro"><div><p class="section-label">05 / WHY GDC</p><h2 class="section-heading">Good ideas deserve<br>excellent execution.</h2></div><p>Our strength is bringing different disciplines together around one clear brief.</p></div><div class="why-grid">${site.why.map((item, index) => `<article><span>0${index + 1}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></article>`).join('')}</div></div>
  </section>

  <section class="section contact-section" id="contact">
    <div class="container contact-grid"><div><p class="section-label">06 / LET'S TALK</p><h2 class="contact-heading">Tell us what<br>you <em>have in mind.</em></h2><p>Share the idea, challenge or event you are planning. We will start with a conversation.</p><div class="contact-direct"><a href="mailto:${attr(site.contact.email)}">${esc(site.contact.email)} <span aria-hidden="true">↗</span></a><div><a href="tel:+254758431170">${esc(site.contact.phones[0])}</a><a href="tel:+254724997041">${esc(site.contact.phones[1])}</a></div><span>${esc(site.contact.address)}</span></div></div>
    <form class="contact-form" action="https://formsubmit.co/${attr(site.contact.email)}" method="post"><input type="hidden" name="_subject" value="New enquiry from GDC website"><input type="hidden" name="_captcha" value="false"><input type="text" name="_honey" tabindex="-1" autocomplete="off" class="visually-hidden" aria-hidden="true"><div class="form-row"><label>Your name<input name="name" autocomplete="name" required></label><label>Email address<input type="email" name="email" autocomplete="email" required></label></div><label>What can we help with?<select name="service" required><option value="" selected disabled>Select a service</option>${site.services.map(service => `<option>${esc(service.title)}</option>`).join('')}<option>Something else</option></select></label><label>Your message<textarea name="message" rows="5" placeholder="Tell us a little about your project..." required></textarea></label><button class="button button-dark" type="submit">Send enquiry ${arrow}</button></form></div>
  </section>`;

write('index.html', page({ title: 'Global Digital Centre', description: site.heroLead, body: home, bodyClass: 'home-page' }));

const categories = [['All projects', 'all'], ['Conferences & forums', 'Conferences'], ['Experiences', 'Experiences'], ['Corporate', 'Corporate']];
const work = `
  <section class="inner-hero work-hero"><div class="container"><p class="section-label">OUR WORK / GLOBAL DIGITAL CENTRE</p><div class="inner-hero-row"><h1>Work made<br><em>to matter.</em></h1><p>Explore the experiences and platforms we have helped bring to life. Open any project to see more of the story.</p></div></div></section>
  <section class="section projects-section"><div class="container"><div class="filter-bar" role="group" aria-label="Filter projects">${categories.map(([label, value], index) => `<button type="button" class="filter-button ${index === 0 ? 'is-active' : ''}" data-filter="${value}" aria-pressed="${index === 0}">${label}</button>`).join('')}</div><div class="project-grid">${projects.map(project => card(project, '../', '', 2)).join('')}</div><p class="empty-filter" hidden>No projects in this category yet.</p></div></section>
  <section class="work-cta"><div class="container"><p>Have a project in mind?</p><h2>Let's make it happen.</h2><a class="button button-light" href="../index.html#contact">Start a conversation ${arrow}</a></div></section>`;
write('our-work/index.html', page({ title: 'Our Work | Global Digital Centre', description: 'Explore selected GDC projects and case studies.', prefix: '../', active: 'work', body: work, bodyClass: 'work-page' }));

projects.forEach((project, index) => {
  const prefix = '../../';
  const next = projects[(index + 1) % projects.length];
  const gallery = project.gallery.map((image, i) => `<figure><a class="gallery-trigger" href="${asset(image, prefix)}" data-gallery-item aria-label="Open ${attr(project.title)} image ${i + 1}"><img src="${asset(image, prefix)}" alt="${attr(project.title)} project image ${i + 1}" loading="lazy" decoding="async"><span class="gallery-view" aria-hidden="true">View image ${arrow}</span></a></figure>`).join('');
  const lightbox = `<dialog class="gallery-modal" aria-labelledby="gallery-caption"><div class="gallery-modal-content"><button class="gallery-close" type="button" aria-label="Close gallery">×</button><img class="gallery-full-image" alt=""><div class="gallery-modal-bar"><button class="gallery-previous" type="button" aria-label="Previous image">←</button><div><p id="gallery-caption">Project gallery</p><p class="gallery-count" aria-live="polite" aria-atomic="true"></p></div><button class="gallery-next" type="button" aria-label="Next image">→</button></div></div></dialog>`;
  const video = project.video ? `<section class="case-video-section"><div class="container"><div class="case-section-heading"><p class="section-label">PROJECT FILM</p><h2>See the work in motion.</h2></div><video controls preload="none" playsinline poster="${asset(project.cover, prefix)}"><source src="${attr(project.video)}" type="video/mp4">Your browser does not support video playback.</video></div></section>` : '';
  const body = `
    <section class="case-hero"><div class="case-hero-image"><img src="${asset(project.cover, prefix)}" alt="${attr(project.title)}" fetchpriority="high"></div><div class="case-hero-shade"></div><div class="container case-hero-content"><a class="back-link" href="../index.html">← All projects</a><p class="eyebrow">${esc(project.category)} / GDC PROJECT</p><h1>${esc(project.articleTitle)}</h1><p>${esc(project.lead)}</p></div></section>
    <section class="section case-story"><div class="container case-layout"><aside><p class="section-label">THE PROJECT</p><span class="case-aside-line"></span><p>Global Digital Centre<br>Nairobi, Kenya</p></aside><div class="case-copy">${project.bodyHtml.replace(/<(\/?)h4>/g, '<$1h2>')}</div></div></section>
    <section class="section case-gallery"><div class="container"><div class="case-section-heading"><p class="section-label">PROJECT GALLERY</p><h2>A closer look.</h2></div><div class="gallery-grid">${gallery}</div></div></section>
    ${video}
    <section class="next-project"><div class="container"><span>NEXT PROJECT</span><a href="../${slugify(next.title)}/index.html">${esc(next.title)} <span aria-hidden="true">↗</span></a></div></section>
    ${lightbox}`;
  write(`our-work/${slugify(project.title)}/index.html`, page({ title: `${project.title} | Global Digital Centre`, description: project.lead, prefix, active: 'work', body, bodyClass: 'case-page' }));
});

const careers = `
  <section class="inner-hero careers-hero"><div class="container"><p class="section-label">CAREERS / GLOBAL DIGITAL CENTRE</p><div class="inner-hero-row"><h1>Do work that<br><em>moves people.</em></h1><p>Our projects bring people, ideas and disciplines together. Explore opportunities to be part of the team.</p></div></div></section>
  <section class="section careers-content"><div class="container careers-grid"><div><p class="section-label">JOIN GDC</p><h2>Bring your perspective<br>to the work.</h2><p>We work across events, communications, production, design, research and consultancy.</p><p class="careers-demo-note">These are sample posts for design review. They are not current vacancies, and applications are not open.</p></div><div class="career-list"><h2 class="career-list-heading">Sample opportunities</h2>${careerPosts.map(post => `<details class="career-post"><summary><span class="career-summary"><span class="career-post-title">${esc(post.title)}</span><span class="career-post-meta">${esc(post.location)} · ${esc(post.type)}</span></span><span class="career-sample-tag">Sample</span><span class="career-toggle" aria-hidden="true">+</span></summary><div class="career-post-body"><p>${esc(post.description)}</p><h3>What the role could involve</h3><ul>${post.responsibilities.map(item => `<li>${esc(item)}</li>`).join('')}</ul><p class="career-post-status">Sample listing — applications are not open.</p></div></details>`).join('')}</div></div></section>`;
write('careers/index.html', page({ title: 'Careers | Global Digital Centre', description: 'Explore careers at Global Digital Centre.', prefix: '../', active: 'careers', body: careers, bodyClass: 'careers-page' }));

for (const [legacyPath, target, label] of [['projects.html', 'our-work/index.html', 'Our Work'], ['careers.html', 'careers/index.html', 'Careers']]) {
  write(legacyPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><title>${label} | Global Digital Centre</title></head><body><p><a href="${target}">Continue to ${label}</a></p></body></html>`);
}

console.log(`Built home, work, careers, ${projects.length} case-study pages, and 2 compatibility pages.`);
