import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const seo = JSON.parse(readFileSync(join(root, 'content/seo.json'), 'utf8'));
const projects = JSON.parse(readFileSync(join(root, 'content/projects.json'), 'utf8'));
const site = JSON.parse(readFileSync(join(root, 'content/site.json'), 'utf8'));
const origin = new URL(seo.baseUrl).origin;
const read = path => readFileSync(join(root, path), 'utf8');
const urls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const expectedCount = projects.length + 2;
const retainedLiveVideos = new Set(projects.map(project => project.video).filter(Boolean));

assert.equal(urls.length, expectedCount, 'Sitemap must contain Home, Our Work, and every case study');
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique');
assert.equal(urls[0], `${origin}/`, 'Home must use the root URL');
assert.equal(urls[1], `${origin}/our-work/index.html`, 'Our Work URL must match internal links');
assert.equal(Object.keys(seo.projects).length, projects.length, 'Every project needs a unique SEO entry');
for (const project of projects) {
  const entry = seo.projects[project.id];
  assert(entry && entry.galleryAlt?.length === project.gallery.length, `Every ${project.id} gallery image needs descriptive text`);
  assert(entry.galleryAlt.every(alt => alt && !/project image \d+/i.test(alt)), `Generic gallery image text: ${project.id}`);
}
assert(read('robots.txt').includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt must reference the sitemap');
assert(read('robots.txt').includes(`Sitemap: ${origin}/careers/sitemap.php`), 'robots.txt must reference the dynamic Careers sitemap');

const titles = new Set();
const descriptions = new Set();
for (const url of urls) {
  const pathname = new URL(url).pathname;
  const file = pathname === '/' ? 'index.html' : pathname.slice(1);
  assert(existsSync(join(root, file)), `Sitemap target missing: ${file}`);
  const html = read(file);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/ )?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/ )?.[1];
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/ )?.[1];
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/ )?.[1];
  const structured = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];

  assert(title && !titles.has(title), `Missing or duplicate title: ${file}`);
  assert(description && !descriptions.has(description), `Missing or duplicate description: ${file}`);
  assert.equal(canonical, url, `Canonical differs from sitemap: ${file}`);
  assert.equal(ogUrl, url, `Social URL differs from canonical: ${file}`);
  assert(ogImage?.startsWith(`${origin}/`), `Social image must be local: ${file}`);
  assert(existsSync(join(root, new URL(ogImage).pathname.slice(1))), `Social image missing: ${file}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Page needs one H1: ${file}`);
  assert(structured, `Structured data missing: ${file}`);
  JSON.parse(structured);
  assert(!html.includes('name="robots" content="noindex'), `Indexable page marked noindex: ${file}`);
  titles.add(title);
  descriptions.add(description);
}

for (const file of ['careers/index.html', 'projects.html', 'careers.html']) {
  assert(read(file).includes('name="robots" content="noindex,follow"'), `Placeholder or compatibility page must be noindex: ${file}`);
}
assert(!urls.some(url => /careers|projects\.html/.test(url)), 'Placeholder and old URLs must stay out of sitemap');

for (const file of [...urls.map(url => new URL(url).pathname.slice(1) || 'index.html'), 'careers/index.html']) {
  const html = read(file);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(?:mailto:|tel:|data:|#)/.test(value)) continue;
    if (retainedLiveVideos.has(value)) continue;
    const target = new URL(value, `${origin}/${file}`);
    if (target.origin !== origin) continue;
    const localFile = target.pathname.endsWith('/') ? `${target.pathname.slice(1)}index.html` : target.pathname.slice(1);
    assert(existsSync(join(root, localFile)), `Broken local reference in ${file}: ${value}`);
    if (target.hash && !/\.svg$/.test(localFile)) {
      const anchor = decodeURIComponent(target.hash.slice(1));
      assert(read(localFile).includes(`id="${anchor}"`), `Broken local anchor in ${file}: ${value}`);
    }
  }
}

const home = read('index.html');
const homeData = JSON.parse(home.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
const organization = homeData['@graph'].find(node => node['@type'] === 'Organization');
const offeredServices = organization.hasOfferCatalog.itemListElement.map(offer => offer.itemOffered);
const activeServices = site.services.filter(service => service.enabled !== false);
assert.deepEqual(offeredServices.map(service => service.name), activeServices.map(service => service.title), 'Only the six active services belong in structured data');
for (const service of offeredServices) {
  const anchor = new URL(service.url).hash.slice(1);
  assert(home.includes(`id="${anchor}"`), `Service anchor missing: ${service.name}`);
}

console.log(`SEO checks passed for ${urls.length} indexable pages, ${offeredServices.length} services, ${projects.reduce((count, project) => count + project.gallery.length, 0)} gallery images, local links and anchors, sitemap, robots, and noindex pages.`);
