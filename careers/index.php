<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

try {
    $jobs = career_open_jobs();
} catch (Throwable $error) {
    error_log('Careers listing error: ' . $error->getMessage());
    http_response_code(503);
    $jobs = [];
    $unavailable = true;
}

career_page_start(
    'Careers at Global Digital Centre | GDC',
    'Explore current opportunities at Global Digital Centre in events, communications, production, design and consultancy.',
    '/careers/index.php'
);
?>
  <section class="inner-hero careers-hero">
    <div class="container">
      <p class="section-label">CAREERS / GLOBAL DIGITAL CENTRE</p>
      <div class="inner-hero-row"><h1>Do work that<br><em>moves people.</em></h1><p>Our projects bring people, ideas and disciplines together. Explore current opportunities to be part of the team.</p></div>
    </div>
  </section>
  <section class="section careers-content">
    <div class="container careers-grid">
      <div>
        <p class="section-label">JOIN GDC</p>
        <h2>Bring your perspective<br>to the work.</h2>
        <p>We work across events, communications, production, design, research and consultancy.</p>
        <p>Open roles appear here when we are hiring. Each listing explains the work and how to apply.</p>
      </div>
      <div class="career-list">
        <h2 class="career-list-heading">Open positions</h2>
        <?php if (isset($unavailable)): ?>
          <p class="career-empty">Opportunities are temporarily unavailable. Please check back soon.</p>
        <?php elseif ($jobs === []): ?>
          <p class="career-empty">There are no open positions right now. Please check back for future opportunities.</p>
        <?php else: ?>
          <?php foreach ($jobs as $job): ?>
            <article class="career-listing">
              <div>
                <h3><a href="job.php?id=<?= career_escape($job['id']) ?>"><?= career_escape($job['title']) ?></a></h3>
                <p><?= career_escape($job['location']) ?> · <?= career_escape($job['country']) ?> · <?= career_escape($job['employment_label']) ?><?= $job['workplace'] === 'remote' ? ' · Remote' : ($job['workplace'] === 'hybrid' ? ' · Hybrid' : '') ?></p>
                <?php if ($job['closing_date'] !== ''): ?><p class="career-deadline">Applications close <?= career_escape(date('j F Y', strtotime($job['closing_date']))) ?></p><?php endif; ?>
              </div>
              <a class="career-view" href="job.php?id=<?= career_escape($job['id']) ?>">View role <span aria-hidden="true">↗</span></a>
            </article>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>
  </section>
<?php career_page_end(); ?>
