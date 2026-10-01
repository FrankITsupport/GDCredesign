import assert from 'node:assert/strict';

const origin = process.env.GDC_TEST_ORIGIN || 'http://127.0.0.1:4174';
const adminUser = process.env.GDC_ADMIN_USER;
const adminPassword = process.env.GDC_ADMIN_PASSWORD;
if (!/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(origin) || !adminUser || !adminPassword) {
  throw new Error('Use a local PHP server and set GDC_ADMIN_USER and GDC_ADMIN_PASSWORD for the test account.');
}

let cookie = '';
async function request(path, options = {}) {
  const response = await fetch(origin + path, {
    redirect: 'manual',
    ...options,
    headers: { ...(cookie ? { Cookie: cookie } : {}), ...(options.headers || {}) }
  });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  return { status: response.status, headers: response.headers, body: await response.text() };
}
const csrf = html => {
  const token = html.match(/name="csrf" value="([^"]+)"/)?.[1];
  assert(token, 'Admin form needs a CSRF token');
  return token;
};
const submit = (data, path = '/admin/index.php') => request(path, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(data)
});

const publicBefore = await request('/careers/index.php');
assert.equal(publicBefore.status, 200);
assert.doesNotMatch(publicBefore.body, /Sample opportunities/);

const loginPage = await request('/admin/index.php');
assert.equal(loginPage.status, 200);
assert.match(loginPage.body, /Sign in to manage careers/);
const deniedLogin = await submit({ action: 'login', csrf: csrf(loginPage.body), username: adminUser, password: 'incorrect-password' });
assert.equal(deniedLogin.status, 200);
assert.match(deniedLogin.body, /username or password is incorrect/);
const login = await submit({ action: 'login', csrf: csrf(loginPage.body), username: adminUser, password: adminPassword });
assert.equal(login.status, 303, 'Valid login redirects to the workspace');

const dashboard = await request('/admin/index.php');
assert.match(dashboard.body, /Career positions/);
assert.match(dashboard.body, /<dialog class="admin-modal" id="position-editor"/);
assert.match(dashboard.body, /index\.php\?new=1/);
const newEditor = await request('/admin/index.php?new=1');
assert.match(newEditor.body, /<dialog class="admin-modal" id="position-editor"[^>]* open>/);
const token = csrf(dashboard.body);
const title = 'Test Event Coordinator ' + Date.now();
const fields = {
  action: 'save', csrf: token, id: '', title, location: 'Nairobi', country: 'Kenya',
  country_code: 'KE', employment_type: 'FULL_TIME', workplace: 'onsite',
  description: 'Plan and deliver events with the production team.\n\n<script>alert("unsafe")</script>',
  responsibilities: 'Coordinate suppliers\nPrepare event schedules',
  qualifications: 'Experience in event production',
  application_type: 'email', application_to: '', closing_date: '', status: 'draft'
};
const missingCsrf = await submit({ ...fields, csrf: '' });
assert.equal(missingCsrf.status, 403);

const titleOnly = {
  ...fields, title: 'Draft role ' + Date.now(), location: '', country: '', country_code: '',
  description: '', responsibilities: '', qualifications: ''
};
const minimalDraft = await submit(titleOnly);
assert.equal(minimalDraft.status, 303, 'A draft saves with only a title');
const minimalId = new URL(minimalDraft.headers.get('location'), origin).searchParams.get('edit');
assert.match(minimalId, /^[a-f0-9]{16}$/);
const savedDashboard = await request(`/admin/index.php?saved=1&edit=${minimalId}`);
assert.doesNotMatch(savedDashboard.body, /<dialog class="admin-modal" id="position-editor"[^>]* open>/);
const editEditor = await request(`/admin/index.php?edit=${minimalId}`);
assert.match(editEditor.body, /<dialog class="admin-modal" id="position-editor"[^>]* open>/);
const incompletePublish = await submit({ ...titleOnly, id: minimalId, status: 'published' });
assert.equal(incompletePublish.status, 200);
assert.match(incompletePublish.body, /Enter a location or city with at least two characters before publishing/);
assert.match(incompletePublish.body, /<dialog class="admin-modal" id="position-editor"[^>]* open>/);
assert.match(incompletePublish.body, new RegExp(`name="title"[^>]*value="${titleOnly.title}"`));

const draft = await submit(fields);
assert.equal(draft.status, 303, 'Draft saves and redirects');
const id = new URL(draft.headers.get('location'), origin).searchParams.get('edit');
assert.match(id, /^[a-f0-9]{16}$/);
assert.doesNotMatch((await request('/careers/index.php')).body, new RegExp(title));

const unsafeLink = await submit({ ...fields, id, application_type: 'url', application_to: 'javascript:alert(1)', status: 'published' });
assert.equal(unsafeLink.status, 200);
assert.match(unsafeLink.body, /valid application email or HTTPS web address/);
const missingQualifications = await submit({ ...fields, id, qualifications: '', application_to: 'jobs@example.com', status: 'published' });
assert.equal(missingQualifications.status, 200);
assert.match(missingQualifications.body, /at least one responsibility and one qualification/);

const published = await submit({ ...fields, id, application_to: 'jobs@example.com', status: 'published' });
assert.equal(published.status, 303, 'Published role saves and redirects');
const listing = await request('/careers/index.php');
assert.match(listing.body, new RegExp(title));
assert.match(listing.body, new RegExp(`job\\.php\\?id=${id}`));
const detail = await request(`/careers/job.php?id=${id}`);
assert.equal(detail.status, 200);
assert.match(detail.body, /"@type":"JobPosting"/);
const schema = JSON.parse(detail.body.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1] || '{}');
assert.equal(schema.title, title);
assert.equal(schema.jobLocation.address.addressCountry, 'KE');
assert.match(schema.datePosted, /^\d{4}-\d{2}-\d{2}$/);
assert.match(schema.description, /Responsibilities/);
assert.match(detail.body, /&lt;script&gt;alert/);
assert.doesNotMatch(detail.body, /<script>alert/);
assert.match(detail.body, /mailto:jobs@example.com/);
const sitemap = await request('/careers/sitemap.php');
assert.match(sitemap.body, new RegExp(`job\\.php\\?id=${id}`));

const closed = await submit({ ...fields, id, application_to: 'jobs@example.com', status: 'closed' });
assert.equal(closed.status, 303);
assert.doesNotMatch((await request('/careers/index.php')).body, new RegExp(title));
assert.equal((await request(`/careers/job.php?id=${id}`)).status, 404);
assert.doesNotMatch((await request('/careers/sitemap.php')).body, new RegExp(id));

const logout = await submit({ action: 'logout', csrf: token });
assert.equal(logout.status, 303);
assert.match((await request('/admin/index.php')).body, /Sign in to manage careers/);
console.log('Careers smoke test passed: login, CSRF, draft, publish, escaping, sitemap, close, and logout.');
