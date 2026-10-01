<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

$id = is_string($_GET['id'] ?? null) ? $_GET['id'] : '';
try {
    $job = career_open_job($id);
} catch (Throwable $error) {
    error_log('Career detail error: ' . $error->getMessage());
    http_response_code(503);
    exit('This position is temporarily unavailable.');
}
if ($job === null) {
    http_response_code(404);
    header('X-Robots-Tag: noindex');
    career_page_start('Position unavailable | Global Digital Centre', 'This position is no longer open.', '/careers/index.php');
    ?><section class="section career-detail"><div class="container"><p class="section-label">CAREERS</p><h1>This position is no longer open.</h1><p>See our current opportunities on the Careers page.</p><a class="button button-dark" href="index.php">View open roles <span aria-hidden="true">↗</span></a></div></section><?php
    career_page_end();
    exit;
}

$description = preg_replace('/\s+/u', ' ', $job['description']);
$metaDescription = 'Apply for ' . $job['title'] . ' at Global Digital Centre. ' . mb_substr($description, 0, 125);
career_page_start(
    $job['title'] . ' | Careers at GDC',
    $metaDescription,
    '/careers/job.php?id=' . $job['id'],
    'careers-page career-detail-page',
    career_job_schema($job)
);
?>
  <section class="inner-hero careers-hero">
    <div class="container">
      <a class="career-back" href="index.php">← All open positions</a>
      <p class="section-label">CAREERS / GLOBAL DIGITAL CENTRE</p>
      <div class="inner-hero-row"><h1><?= career_escape($job['title']) ?></h1><p><?= career_escape($job['location']) ?> · <?= career_escape($job['country']) ?><br><?= career_escape($job['employment_label']) ?><?= $job['workplace'] === 'remote' ? ' · Remote' : ($job['workplace'] === 'hybrid' ? ' · Hybrid' : '') ?></p></div>
    </div>
  </section>
  <section class="section career-detail">
    <div class="container career-detail-layout">
      <article>
        <h2>About the role</h2>
        <?= career_paragraphs($job['description']) ?>
        <?php if ($job['responsibilities'] !== []): ?><h2>Responsibilities</h2><?= career_list($job['responsibilities']) ?><?php endif; ?>
        <?php if ($job['qualifications'] !== []): ?><h2>What we are looking for</h2><?= career_list($job['qualifications']) ?><?php endif; ?>
      </article>
      <aside class="career-apply">
        <h2>Apply for this role</h2>
        <?php if ($job['closing_date'] !== ''): ?><p>Applications close <?= career_escape(date('j F Y', strtotime($job['closing_date']))) ?>.</p><?php endif; ?>
        <p><?= $job['application_type'] === 'email' ? 'Send your application to the address below.' : 'Use the application link below.' ?></p>
        <a class="button button-dark" href="<?= career_escape(career_apply_href($job)) ?>"<?= $job['application_type'] === 'url' ? ' target="_blank" rel="noopener noreferrer"' : '' ?>><?= $job['application_type'] === 'email' ? 'Apply by email' : 'Open application' ?> <span aria-hidden="true">↗</span></a>
        <?php if ($job['application_type'] === 'email'): ?><p class="career-apply-address"><?= career_escape($job['application_to']) ?></p><?php endif; ?>
      </aside>
    </div>
  </section>
<?php career_page_end(); ?>
