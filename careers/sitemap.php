<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

try {
    $jobs = career_open_jobs();
} catch (Throwable $error) {
    error_log('Careers sitemap error: ' . $error->getMessage());
    http_response_code(503);
    exit;
}
header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc><?= CAREERS_SITE_URL ?>/careers/index.php</loc></url>
<?php foreach ($jobs as $job): ?>
  <url><loc><?= CAREERS_SITE_URL ?>/careers/job.php?id=<?= career_escape($job['id']) ?></loc><lastmod><?= career_escape(substr($job['updated_at'], 0, 10)) ?></lastmod></url>
<?php endforeach; ?>
</urlset>
