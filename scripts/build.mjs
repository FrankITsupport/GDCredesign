import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(join(root, 'content/site.json'), 'utf8'));
const projects = JSON.parse(readFileSync(join(root, 'content/projects.json'), 'utf8'));
const careerPosts = JSON.parse(readFileSync(join(root, 'content/careers.json'), 'utf8'));
// Data Analysis & Visualization stays in the content file for later, but is commented out in the page.
const activeServices = site.services.filter(service => service.enabled !== false);

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
    ['Home', `${prefix}index.html`, 'home'],
    ['About', `${prefix}index.html#about`, 'about'],
    ['Services', `${prefix}index.html#services`, 'services'],
    ['Our Work', `${prefix}index.html#work`, 'work'],
    ['Careers', `${prefix}careers/index.html`, 'careers'],
    ['Contact', `${prefix}index.html#contact`, 'contact']
  ];
  return `
    <header class="site-header" id="top">
      <div class="header-inner container">
        <a class="brand" href="${prefix}index.html" aria-label="Global Digital Centre home">
          <span class="brand-mark"><img src="${prefix}assets/media/branding/gdc-logo-alt.png" alt="" width="83" height="43"></span>
          <span class="brand-name">GLOBAL DIGITAL CENTRE</span>
        </a>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">
          <span></span><span></span>
        </button>
        <nav class="main-nav" id="main-nav" aria-label="Main navigation">
          ${nav.map(([label, href, key]) => `<a href="${href}" ${key === active && key !== 'work' ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
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
          <a href="${prefix}index.html#work">Our Work</a>
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
  <link rel="icon" href="${prefix}favicon.ico" sizes="16x16 32x32 48x48" type="image/x-icon">
  <link rel="icon" href="${prefix}assets/media/branding/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="${prefix}assets/media/branding/apple-touch-icon.png" sizes="180x180">
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

const featured = ['swift', 'iea', 'ariel', 'un-sacco', 'shanila', 'safeschools', 'nssf', 'migaa'].map(id => projects.find(project => project.id === id));
const heroVideos = site.heroVideos.map(video => ({ ...video, project: projects.find(project => project.id === video.projectId) }));
const clientLogos = [
  ['iea.png', 'International Energy Agency'],
  ['nssf.png', 'NSSF'],
  ['swift.png', 'SWIFT'],
  ['pandg.png', 'P&G'],
  ['issa.png', 'ISSA'],
  ['kentraco.png', 'KETRACO']
];

function clientLogoGroup(duplicate = false) {
  return `<div class="client-logo-group"${duplicate ? ' aria-hidden="true"' : ''}>${clientLogos.map(([file, name]) => `<span class="client-logo${file === 'issa.png' ? ' client-logo-issa' : ''}"><img src="assets/media/clients/${file}" alt="${duplicate ? '' : name}" loading="eager" decoding="async"></span>`).join('')}</div>`;
}

const serviceIcons = [
  '<rect x="4" y="6" width="24" height="20" rx="2"/><path d="M4 12h24M10 3v6M22 3v6M10 18h5M10 22h12"/>',
  '<path d="M27 16a11 11 0 0 1-11 11H5l2-6a11 11 0 1 1 20-5Z"/><path d="M10 12h12M10 17h8"/>',
  '<path d="m7 22 14-14 5 5-14 14-7 2 2-7ZM18 11l5 5M5 5h9M5 5v9M19 27h8"/>',
  '<circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4c8 8 8 16 0 24-8-8-8-16 0-24Z"/>',
  '<rect x="3" y="8" width="26" height="20" rx="2"/><path d="m10 8 2-4h8l2 4"/><circle cx="16" cy="18" r="6"/>',
  '<circle cx="13" cy="13" r="9"/><path d="m20 20 8 8M8 15l3-4 4 2 3-5"/>'
];

function serviceCard(service, index) {
  return `<article class="service-card${service.image ? ' service-card-with-image' : ''}" aria-labelledby="service-title-${index + 1}">
    ${service.image ? `<img class="service-card-photo" src="${attr(service.image)}" alt="" aria-hidden="true" width="900" height="506" loading="lazy" decoding="async">` : ''}
    <div class="service-card-top"><span class="service-icon"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${serviceIcons[index] || serviceIcons[5]}</svg></span><span class="service-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span></div>
    <h3 id="service-title-${index + 1}">${esc(service.displayTitle || service.title)}</h3>
    <p class="service-summary">${esc(service.summary)}</p>
    <details class="service-details">
      <summary>Explore this service<span class="visually-hidden">: ${esc(service.displayTitle || service.title)}</span><span class="service-expand" aria-hidden="true">+</span></summary>
      <div class="service-details-body"><p class="service-full-title">${esc(service.title)}</p><p>${esc(service.detail)}</p><a class="service-enquiry" href="#contact" data-service="${attr(service.title)}">Discuss your brief ${arrow}</a></div>
    </details>
  </article>`;
}

const home = `
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-stage" data-hero-player>
      <div class="hero-backdrop" aria-hidden="true">
        ${heroVideos.map((video, index) => `<video class="hero-video${index === 0 ? ' is-active' : ''}" muted playsinline preload="none" poster="${attr(video.poster)}" data-src="${attr(video.src)}" tabindex="-1"></video>`).join('')}
      </div>
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="container hero-content">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-line"></span> NAIROBI · WORKING ACROSS AFRICA</p>
        <h1 id="hero-title">Your vision.<br>Our strategy.<br><em>Real impact.</em></h1>
        <p class="hero-lead">${esc(site.heroLead)}</p>
        <div class="hero-actions">
          <a class="button hero-primary" href="#services">Explore our services ${arrow}</a>
          <a class="button button-outline-light" href="#work">See our work ${arrow}</a>
        </div>
        <div class="hero-caption"><span class="tiny-red-line"></span> Strategy · Creativity · Delivery</div>
      </div>
      </div>
      <div class="hero-bottom container">
        <a href="#about" aria-label="Scroll to about GDC">Scroll to explore <span aria-hidden="true">↓</span></a>
        <div class="hero-controls" hidden>
          <span class="hero-video-title">${esc(heroVideos[0].project.title)}</span>
          <div class="hero-video-selector" role="group" aria-label="Choose a background video">
            ${heroVideos.map((video, index) => `<button class="hero-video-choice${index === 0 ? ' is-active' : ''}" type="button" aria-label="Show ${attr(video.project.title)} video" aria-pressed="${index === 0}" data-video-index="${index}" data-video-title="${attr(video.project.title)}">${String(index + 1).padStart(2, '0')}</button>`).join('')}
          </div>
          <button class="hero-video-toggle" type="button" aria-label="Pause background videos" aria-pressed="false">Pause <span aria-hidden="true">Ⅱ</span></button>
        </div>
      </div>
    </div>
    <div class="client-strip" role="region" aria-label="Selected clients">
      <div class="container client-strip-inner"><div class="client-strip-label"><span>TRUSTED BY TEAMS INCLUDING</span><button class="client-scroll-toggle" type="button" aria-label="Pause client logos" aria-pressed="false">Pause</button></div><div class="client-logos" tabindex="0" role="group" aria-label="Client logos"><div class="client-logos-track">${clientLogoGroup()}${clientLogoGroup(true)}</div></div></div>
    </div>
  </section>

  <section class="section about-section" id="about" aria-labelledby="about-title">
    <div class="container about-layout">
      <div class="about-intro">
        <p class="section-label">01 / ABOUT US</p>
        <h2 class="section-heading" id="about-title">${esc(site.aboutHeading)}<br><em>${esc(site.aboutHeadingAccent)}</em></h2>
        <p class="about-lead">${esc(site.aboutIntro)}</p>
      </div>
      <figure class="about-visual">
        <div class="about-photo-composition">
          <img class="about-photo-main" src="assets/media/about/crew.webp" alt="A smiling GDC production crew member at the controls during the ISSA Technical Seminar" width="1200" height="800" loading="lazy" decoding="async">
          <span class="about-location"><span aria-hidden="true"></span> Nairobi roots. African outlook.</span>
          <div class="about-photo-detail"><img src="assets/media/about/celebration.webp" alt="Flowers and table settings prepared for the UN SACCO Jubilee Celebration" width="900" height="600" loading="lazy" decoding="async"></div>
          <div class="about-photo-note"><span class="tiny-red-line" aria-hidden="true"></span><span>People who care.<br>Details that matter.</span></div>
        </div>
        <figcaption><span aria-hidden="true">↗</span> Behind the scenes, bringing your vision to life.</figcaption>
      </figure>
      <div class="about-story">
        <p class="about-description">${esc(site.aboutText)}</p>
        <ul class="about-values" aria-label="Our way of working">${site.aboutValues.map(value => `<li><h3>${esc(value.title)}</h3><p>${esc(value.text)}</p></li>`).join('')}</ul>
        <div class="about-actions">
          <a class="button button-dark" href="#contact">Let's talk about your idea ${arrow}</a>
          <a class="underlined-link" href="#services">Explore our services ${arrow}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section services-section" id="services" aria-labelledby="services-title">
    <div class="container">
      <div class="section-intro services-intro"><div><p class="section-label">02 / WHAT WE DO</p><h2 class="section-heading" id="services-title">${esc(site.servicesHeading)}<br><em>${esc(site.servicesHeadingAccent)}</em></h2></div><div class="services-intro-copy"><p>${esc(site.servicesIntro)}</p><span class="services-team-note"><span aria-hidden="true"></span> ${activeServices.length} disciplines. One connected team.</span></div></div>
      <div class="services-grid">${activeServices.map(serviceCard).join('')}
      ${site.services.filter(service => service.enabled === false).map(service => `<!-- Deferred for later: ${esc(service.title)}\n${serviceCard(service, 6)}\n-->`).join('')}</div>
      <div class="services-footer"><p>One service or a complete solution.<span> Let’s shape the right mix for your brief.</span></p><a class="underlined-link" href="#contact">Start a conversation ${arrow}</a></div>
    </div>
  </section>

  <section class="section approach-section" id="approach" aria-labelledby="approach-title">
    <div class="container approach-layout">
      <div class="approach-heading">
        <div><p class="section-label">03 / HOW WE WORK</p><h2 class="section-heading" id="approach-title">${esc(site.approachHeading)}<br><em>${esc(site.approachHeadingAccent)}</em></h2></div>
        <div class="approach-intro"><p>${esc(site.approachIntro)}</p><span><span aria-hidden="true"></span> Your brief. One connected team.</span></div>
      </div>
      <div class="approach-journey">
        <ol class="approach-steps" role="list" aria-label="Our process, from your brief to your next opportunity">${site.approach.map((step, index) => `<li class="approach-step"><span class="approach-node" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><div class="approach-step-copy"><h3>${esc(step.step)}</h3><p>${esc(step.description)}</p><div class="approach-outcome"><span>THE OUTCOME</span><strong>${esc(step.outcome)}</strong></div></div></li>`).join('')}</ol>
      </div>
      <div class="approach-footer"><p><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 8a8 8 0 0 0-14-2L3 9m0-5v5h5M4 16a8 8 0 0 0 14 2l3-3m0 5v-5h-5"/></svg><span>In conversation at every stage.<span> Each project makes the next one better.</span></span></p><a class="button button-light" href="#contact">Let's start with your idea ${arrow}</a></div>
    </div>
  </section>

  <section class="section work-preview" id="work">
    <div class="container">
      <div class="section-intro work-intro"><div><p class="section-label">04 / SELECTED WORK</p><h2 class="section-heading">The work behind<br>the moments.</h2></div><div><p>Different briefs. One commitment to work that is thoughtful, visible and carefully delivered.</p><a class="button button-dark" href="our-work/index.html">View more work ${arrow}</a></div></div>
      <div class="preview-grid">${featured.map(project => card(project)).join('')}</div>
    </div>
  </section>

  <section class="section why-section" id="why" aria-labelledby="why-title">
    <div class="container">
      <div class="section-intro why-intro">
        <div>
          <p class="section-label">05 / WHY GDC</p>
          <h2 class="section-heading" id="why-title">Good ideas deserve<br><em>excellent execution.</em></h2>
        </div>
        <p>Our strength is bringing different disciplines together around one clear brief. We don't just deliver projects—we partner with you to shape outcomes that matter.</p>
      </div>
      <div class="why-content">
        <div class="why-grid">
          ${site.why.map((item, index) => `<article class="why-card">
            <div class="why-card-icon">0${index + 1}</div>
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.description)}</p>
          </article>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="section clients-section" id="clients" aria-labelledby="clients-title">
    <div class="container">
      <div class="section-intro clients-intro">
        <div>
          <p class="section-label">TRUSTED BY</p>
          <h2 class="section-heading" id="clients-title">Leading organizations<br><em>working across Africa.</em></h2>
        </div>
        <p>We've had the privilege of working with institutions, development partners, global brands, and organizations that are shaping the continent.</p>
      </div>
      <div class="clients-grid">
        ${clientLogos.map(([file, name]) => `<div class="client-item">
          <img src="assets/media/clients/${file}" alt="${name}" loading="lazy" decoding="async">
        </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section contact-section" id="contact">
    <div class="container contact-grid"><div><p class="section-label">06 / LET'S TALK</p><h2 class="contact-heading">Tell us what<br>you <em>have in mind.</em></h2><p>Share the idea, challenge or event you are planning. We will start with a conversation.</p><div class="contact-direct"><a href="mailto:${attr(site.contact.email)}">${esc(site.contact.email)} <span aria-hidden="true">↗</span></a><div><a href="tel:+254758431170">${esc(site.contact.phones[0])}</a><a href="tel:+254724997041">${esc(site.contact.phones[1])}</a></div><span>${esc(site.contact.address)}</span></div></div>
    <form class="contact-form" action="https://formsubmit.co/${attr(site.contact.email)}" method="post"><input type="hidden" name="_subject" value="New enquiry from GDC website"><input type="hidden" name="_captcha" value="false"><input type="text" name="_honey" tabindex="-1" autocomplete="off" class="visually-hidden" aria-hidden="true"><div class="form-row"><label>Your name<input name="name" autocomplete="name" required></label><label>Email address<input type="email" name="email" autocomplete="email" required></label></div><label>What can we help with?<select name="service" required><option value="" selected disabled>Select a service</option>${activeServices.map(service => `<option>${esc(service.title)}</option>`).join('')}<option>Something else</option></select></label><label>Your message<textarea name="message" rows="5" placeholder="Tell us a little about your project..." required></textarea></label><button class="button button-dark" type="submit">Send enquiry ${arrow}</button></form></div>
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
  write(legacyPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><link rel="icon" href="favicon.ico" sizes="16x16 32x32 48x48" type="image/x-icon"><link rel="icon" href="assets/media/branding/favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="assets/media/branding/apple-touch-icon.png" sizes="180x180"><title>${label} | Global Digital Centre</title></head><body><p><a href="${target}">Continue to ${label}</a></p></body></html>`);
}

console.log(`Built home, work, careers, ${projects.length} case-study pages, and 2 compatibility pages.`);
