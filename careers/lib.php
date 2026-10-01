<?php
declare(strict_types=1);

date_default_timezone_set('Africa/Nairobi');

const CAREERS_SITE_URL = 'https://gdc-ltd.org';

function career_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function career_data_dir(bool $create = false): string
{
    $configured = getenv('GDC_CAREERS_DATA_DIR');
    $directory = $configured !== false && $configured !== ''
        ? rtrim($configured, "/\\")
        : dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'gdc-careers-data';
    $resolved = realpath($directory);
    if ($resolved === false) {
        $parent = realpath(dirname($directory));
        $resolved = $parent === false ? $directory : $parent . DIRECTORY_SEPARATOR . basename($directory);
    }
    $projectRoot = realpath(dirname(__DIR__));
    $documentRoot = !empty($_SERVER['DOCUMENT_ROOT']) ? realpath((string) $_SERVER['DOCUMENT_ROOT']) : false;
    foreach ([$projectRoot, $documentRoot] as $publicRoot) {
        if ($publicRoot === false) {
            continue;
        }
        $candidate = strtolower(rtrim(str_replace('\\', '/', $resolved), '/'));
        $root = strtolower(rtrim(str_replace('\\', '/', $publicRoot), '/'));
        if ($candidate === $root || str_starts_with($candidate, $root . '/')) {
            throw new RuntimeException('Careers data must be outside the public website folder.');
        }
    }
    if ($create && !is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Careers data directory is not writable.');
    }
    return $directory;
}

function career_jobs_path(): string
{
    return career_data_dir() . DIRECTORY_SEPARATOR . 'jobs.json';
}

function career_read_jobs_unlocked(): array
{
    $path = career_jobs_path();
    if (!is_file($path)) {
        return [];
    }
    $decoded = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($decoded) || !array_is_list($decoded)) {
        throw new RuntimeException('Careers data has an invalid format.');
    }
    return $decoded;
}

function career_jobs(): array
{
    $directory = career_data_dir();
    if (!is_dir($directory)) {
        return [];
    }
    $lock = fopen($directory . DIRECTORY_SEPARATOR . 'jobs.lock', 'c+');
    if ($lock === false || !flock($lock, LOCK_SH)) {
        throw new RuntimeException('Could not read careers data.');
    }
    try {
        return career_read_jobs_unlocked();
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function career_change_jobs(callable $change): void
{
    $directory = career_data_dir(true);
    $lock = fopen($directory . DIRECTORY_SEPARATOR . 'jobs.lock', 'c+');
    if ($lock === false || !flock($lock, LOCK_EX)) {
        throw new RuntimeException('Could not lock careers data.');
    }
    try {
        $jobs = $change(career_read_jobs_unlocked());
        $encoded = json_encode($jobs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR) . "\n";
        $temporary = tempnam($directory, 'jobs-');
        if ($temporary === false || file_put_contents($temporary, $encoded) === false) {
            throw new RuntimeException('Could not save careers data.');
        }
        @chmod($temporary, 0600);
        if (!@rename($temporary, career_jobs_path())) {
            // Windows cannot always replace an existing file with rename().
            if (file_put_contents(career_jobs_path(), $encoded, LOCK_EX) === false) {
                @unlink($temporary);
                throw new RuntimeException('Could not save careers data.');
            }
            @unlink($temporary);
        }
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function career_is_open(array $job): bool
{
    return ($job['status'] ?? '') === 'published'
        && (($job['closing_date'] ?? '') === '' || $job['closing_date'] >= date('Y-m-d'));
}

function career_open_jobs(): array
{
    $jobs = array_values(array_filter(career_jobs(), 'career_is_open'));
    usort($jobs, static fn(array $a, array $b): int => strcmp($b['published_at'] ?? '', $a['published_at'] ?? ''));
    return $jobs;
}

function career_open_job(string $id): ?array
{
    if (!preg_match('/^[a-f0-9]{16}$/', $id)) {
        return null;
    }
    foreach (career_open_jobs() as $job) {
        if (($job['id'] ?? '') === $id) {
            return $job;
        }
    }
    return null;
}

function career_paragraphs(string $text): string
{
    $parts = preg_split('/\R\s*\R/u', trim($text)) ?: [];
    return implode('', array_map(
        static fn(string $part): string => '<p>' . nl2br(career_escape(trim($part)), false) . '</p>',
        array_filter($parts, static fn(string $part): bool => trim($part) !== '')
    ));
}

function career_list(array $items): string
{
    return '<ul>' . implode('', array_map(
        static fn(string $item): string => '<li>' . career_escape($item) . '</li>',
        $items
    )) . '</ul>';
}

function career_apply_href(array $job): string
{
    return $job['application_type'] === 'email'
        ? 'mailto:' . $job['application_to'] . '?subject=' . rawurlencode('Application: ' . $job['title'])
        : $job['application_to'];
}

function career_job_schema(array $job): array
{
    $description = career_paragraphs($job['description']);
    if ($job['responsibilities'] !== []) {
        $description .= '<p>Responsibilities</p>' . career_list($job['responsibilities']);
    }
    if ($job['qualifications'] !== []) {
        $description .= '<p>Qualifications</p>' . career_list($job['qualifications']);
    }
    $description .= '<p>How to apply: ' . career_escape($job['application_to']) . '</p>';
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'JobPosting',
        'title' => $job['title'],
        'description' => $description,
        'datePosted' => substr($job['published_at'], 0, 10),
        'employmentType' => $job['employment_type'],
        'hiringOrganization' => [
            '@type' => 'Organization',
            'name' => 'Global Digital Centre',
            'sameAs' => CAREERS_SITE_URL . '/',
            'logo' => CAREERS_SITE_URL . '/assets/media/branding/gdc-logo-main.png',
        ],
    ];
    if ($job['workplace'] === 'remote') {
        $schema['jobLocationType'] = 'TELECOMMUTE';
        $schema['applicantLocationRequirements'] = ['@type' => 'Country', 'name' => $job['country']];
    } else {
        $schema['jobLocation'] = [
            '@type' => 'Place',
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => $job['location'],
                'addressCountry' => $job['country_code'],
            ],
        ];
    }
    if ($job['closing_date'] !== '') {
        $schema['validThrough'] = $job['closing_date'] . 'T23:59:59+03:00';
    }
    return $schema;
}

function career_page_start(string $title, string $description, string $path, string $bodyClass = 'careers-page', ?array $schema = null): void
{
    $canonical = CAREERS_SITE_URL . $path;
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-cache, must-revalidate');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    $site = json_decode((string) file_get_contents(__DIR__ . '/../content/site.json'), true, 512, JSON_THROW_ON_ERROR);
    $social = $site['social'];
    $contact = $site['contact'];
    $schemaHtml = $schema === null ? '' : '<script type="application/ld+json">'
        . str_replace('<', '\\u003c', json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR))
        . '</script>';
    ?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f8f7f5">
  <title><?= career_escape($title) ?></title>
  <meta name="description" content="<?= career_escape($description) ?>">
  <link rel="canonical" href="<?= career_escape($canonical) ?>">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Global Digital Centre">
  <meta property="og:title" content="<?= career_escape($title) ?>">
  <meta property="og:description" content="<?= career_escape($description) ?>">
  <meta property="og:url" content="<?= career_escape($canonical) ?>">
  <meta property="og:image" content="<?= CAREERS_SITE_URL ?>/assets/media/hero/nssf.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <?= $schemaHtml ?>
  <link rel="icon" href="../favicon.ico" sizes="16x16 32x32 48x48" type="image/x-icon">
  <link rel="icon" href="../assets/media/branding/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="../assets/media/branding/apple-touch-icon.png" sizes="180x180">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet"></noscript>
  <link rel="stylesheet" href="../styles.css">
  <script src="../script.js" defer></script>
</head>
<body class="<?= career_escape($bodyClass) ?>">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" id="top">
    <div class="header-inner container">
      <a class="brand" href="../index.html" aria-label="Global Digital Centre home"><span class="brand-mark"><img src="../assets/media/branding/gdc-logo-alt.png" alt="" width="83" height="43"></span><span class="brand-name">GLOBAL DIGITAL CENTRE</span></a>
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav"><span></span><span></span></button>
      <nav class="main-nav" id="main-nav" aria-label="Main navigation">
        <a href="../index.html">Home</a><a href="../index.html#about">About</a><a href="../index.html#services">Services</a><a href="../index.html#work">Our Work</a><a href="index.php" aria-current="page">Careers</a><a href="../index.html#contact">Contact</a>
        <a class="nav-cta" href="../index.html#contact">Let's talk <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
  </header>
  <main id="main"><?php
    $GLOBALS['career_footer_site'] = ['contact' => $contact, 'social' => $social];
}

function career_page_end(): void
{
    $contact = $GLOBALS['career_footer_site']['contact'];
    $social = $GLOBALS['career_footer_site']['social'];
    ?></main>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div><p class="footer-kicker">GLOBAL DIGITAL CENTRE</p><p class="footer-statement">Ideas made real.<br>Impact made visible.</p></div>
      <div class="footer-links"><span>Explore</span><a href="../index.html#about">About</a><a href="../index.html#services">Services</a><a href="../index.html#work">Our Work</a></div>
      <div class="footer-links"><span>Connect</span><a href="mailto:<?= career_escape($contact['email']) ?>"><?= career_escape($contact['email']) ?></a>
        <?php foreach ($contact['phones'] as $phone): ?><a href="tel:<?= career_escape(preg_replace('/[^\d+]/', '', $phone)) ?>"><?= career_escape($phone) ?></a><?php endforeach; ?>
        <div class="social-links"><a href="<?= career_escape($social['instagram']) ?>" target="_blank" rel="noopener noreferrer">Instagram</a><a href="<?= career_escape($social['linkedin']) ?>" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
      </div>
    </div>
    <div class="container footer-bottom"><span>© <?= date('Y') ?> Global Digital Centre</span><span>Nairobi, Kenya · Across Africa</span></div>
  </footer>
</body>
</html><?php
}
