<?php
declare(strict_types=1);
require dirname(__DIR__) . '/careers/lib.php';

$https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
$localRequest = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true);
if (!$https && !$localRequest) {
    http_response_code(403);
    exit('Careers admin requires HTTPS.');
}

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'self'; style-src 'self'; img-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");

ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_name('GDC_HR');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/admin',
    'secure' => $https,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));

function admin_credentials(): ?array
{
    $path = career_data_dir() . DIRECTORY_SEPARATOR . 'auth.json';
    if (!is_file($path)) {
        return null;
    }
    $data = json_decode((string) file_get_contents($path), true);
    return is_array($data) && isset($data['username'], $data['password_hash']) ? $data : null;
}

function admin_is_signed_in(?array $credentials): bool
{
    if ($credentials === null || empty($_SESSION['admin_user']) || empty($_SESSION['admin_hash'])) {
        return false;
    }
    if ($_SESSION['admin_user'] !== $credentials['username']
        || !hash_equals($_SESSION['admin_hash'], hash('sha256', $credentials['password_hash']))
        || time() - (int) ($_SESSION['last_active'] ?? 0) > 1800) {
        unset($_SESSION['admin_user'], $_SESSION['admin_hash'], $_SESSION['last_active']);
        return false;
    }
    $_SESSION['last_active'] = time();
    return true;
}

function admin_rate_limit(string $action): bool
{
    $directory = career_data_dir(true);
    $path = $directory . DIRECTORY_SEPARATOR . 'login-attempts.json';
    $handle = fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        throw new RuntimeException('Could not check login attempts.');
    }
    try {
        $contents = stream_get_contents($handle);
        $records = json_decode($contents ?: '{}', true);
        if (!is_array($records)) {
            $records = [];
        }
        $key = hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        $now = time();
        foreach ($records as $ip => $record) {
            if (!is_array($record) || ($record['until'] ?? 0) <= $now) {
                unset($records[$ip]);
            }
        }
        $record = $records[$key] ?? ['count' => 0, 'until' => $now + 900];
        $blocked = $record['count'] >= 10;
        if ($action === 'failure' && !$blocked) {
            ++$record['count'];
            $records[$key] = $record;
        } elseif ($action === 'success') {
            unset($records[$key]);
        }
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($records, JSON_THROW_ON_ERROR));
        fflush($handle);
        @chmod($path, 0600);
        return $blocked;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function admin_field(string $name): string
{
    return is_string($_POST[$name] ?? null) ? trim($_POST[$name]) : '';
}

function admin_lines(string $text, string $label): array
{
    $lines = array_values(array_filter(array_map('trim', preg_split('/\R/u', $text) ?: []), static fn(string $line): bool => $line !== ''));
    if (count($lines) > 20 || array_filter($lines, static fn(string $line): bool => mb_strlen($line) > 300)) {
        throw new InvalidArgumentException($label . ' must have at most 20 lines of 300 characters each.');
    }
    return $lines;
}

function admin_job_from_post(?array $existing): array
{
    $typeLabels = [
        'FULL_TIME' => 'Full time', 'PART_TIME' => 'Part time',
        'CONTRACTOR' => 'Contract', 'TEMPORARY' => 'Temporary',
        'INTERN' => 'Internship', 'VOLUNTEER' => 'Volunteer',
    ];
    $title = admin_field('title');
    $location = admin_field('location');
    $country = admin_field('country');
    $countryCode = strtoupper(admin_field('country_code'));
    $type = admin_field('employment_type');
    $workplace = admin_field('workplace');
    $description = admin_field('description');
    $applicationType = admin_field('application_type');
    $applicationTo = admin_field('application_to');
    $closingDate = admin_field('closing_date');
    $status = admin_field('status');
    if ($title === '' || mb_strlen($title) > 120) {
        throw new InvalidArgumentException('Enter a job title of up to 120 characters.');
    }
    if (mb_strlen($location) > 100 || mb_strlen($country) > 100) {
        throw new InvalidArgumentException('Location and country must each be 100 characters or fewer.');
    }
    if ($countryCode !== '' && !preg_match('/^[A-Z]{2}$/', $countryCode)) {
        throw new InvalidArgumentException('Country code must be two letters, such as KE.');
    }
    if (mb_strlen($description) > 10000) {
        throw new InvalidArgumentException('Role description must be 10,000 characters or fewer.');
    }
    if (!isset($typeLabels[$type]) || !in_array($workplace, ['onsite', 'hybrid', 'remote'], true)
        || !in_array($applicationType, ['email', 'url'], true)
        || !in_array($status, ['draft', 'published', 'closed'], true)) {
        throw new InvalidArgumentException('Choose valid job options and try again.');
    }
    if ($status === 'published') {
        if (mb_strlen($title) < 3) {
            throw new InvalidArgumentException('A published job title needs at least three characters.');
        }
        if (mb_strlen($location) < 2) {
            throw new InvalidArgumentException('Enter a location or city with at least two characters before publishing.');
        }
        if (mb_strlen($country) < 2) {
            throw new InvalidArgumentException('Enter a country with at least two characters before publishing.');
        }
        if ($countryCode === '') {
            throw new InvalidArgumentException('Enter a two-letter country code before publishing, such as KE.');
        }
        if (mb_strlen($description) < 30) {
            throw new InvalidArgumentException('Add a role description of at least 30 characters before publishing.');
        }
    }
    if ($applicationTo !== '') {
        if (($applicationType === 'email' && !filter_var($applicationTo, FILTER_VALIDATE_EMAIL))
            || ($applicationType === 'url' && (!filter_var($applicationTo, FILTER_VALIDATE_URL) || !preg_match('~^https://~i', $applicationTo)))) {
            throw new InvalidArgumentException('Enter a valid application email or HTTPS web address.');
        }
    }
    if (mb_strlen($applicationTo) > 500) {
        throw new InvalidArgumentException('The application email or link is too long.');
    }
    if ($status === 'published' && $applicationTo === '') {
        throw new InvalidArgumentException('A published role needs an application email or web address.');
    }
    $responsibilities = admin_lines(admin_field('responsibilities'), 'Responsibilities');
    $qualifications = admin_lines(admin_field('qualifications'), 'Qualifications');
    if ($status === 'published' && ($responsibilities === [] || $qualifications === [])) {
        throw new InvalidArgumentException('Add at least one responsibility and one qualification before publishing.');
    }
    if ($closingDate !== '') {
        $parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $closingDate);
        if ($parsed === false || $parsed->format('Y-m-d') !== $closingDate) {
            throw new InvalidArgumentException('Enter a valid closing date.');
        }
        if ($status === 'published' && $closingDate < date('Y-m-d')) {
            throw new InvalidArgumentException('A published role cannot have a past closing date.');
        }
    }
    $now = date('c');
    return [
        'id' => $existing['id'] ?? bin2hex(random_bytes(8)),
        'title' => $title,
        'location' => $location,
        'country' => $country,
        'country_code' => $countryCode,
        'employment_type' => $type,
        'employment_label' => $typeLabels[$type],
        'workplace' => $workplace,
        'description' => $description,
        'responsibilities' => $responsibilities,
        'qualifications' => $qualifications,
        'application_type' => $applicationType,
        'application_to' => $applicationTo,
        'closing_date' => $closingDate,
        'status' => $status,
        'created_at' => $existing['created_at'] ?? $now,
        'published_at' => ($existing['published_at'] ?? '') ?: ($status === 'published' ? $now : ''),
        'updated_at' => $now,
    ];
}

$credentials = admin_credentials();
$signedIn = admin_is_signed_in($credentials);
$error = '';
$notice = isset($_GET['saved']) ? 'The position was saved.' : '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = admin_field('csrf');
    if ($token === '' || !hash_equals($_SESSION['csrf'], $token)) {
        http_response_code(403);
        $error = 'Your session expired. Reload the page and try again.';
    } else {
        $action = admin_field('action');
        try {
            if ($action === 'login' && !$signedIn) {
                if ($credentials === null) {
                    $error = 'Admin access has not been set up yet.';
                } elseif (admin_rate_limit('check')) {
                    $error = 'Too many attempts. Try again in 15 minutes.';
                } elseif (hash_equals($credentials['username'], admin_field('username'))
                    && password_verify(admin_field('password'), $credentials['password_hash'])) {
                    admin_rate_limit('success');
                    session_regenerate_id(true);
                    $_SESSION['admin_user'] = $credentials['username'];
                    $_SESSION['admin_hash'] = hash('sha256', $credentials['password_hash']);
                    $_SESSION['last_active'] = time();
                    $_SESSION['csrf'] = bin2hex(random_bytes(32));
                    header('Location: index.php', true, 303);
                    exit;
                } else {
                    admin_rate_limit('failure');
                    $error = 'The username or password is incorrect.';
                }
            } elseif ($action === 'logout' && $signedIn) {
                $_SESSION = [];
                session_regenerate_id(true);
                header('Location: index.php', true, 303);
                exit;
            } elseif ($action === 'save' && $signedIn) {
                $id = admin_field('id');
                $savedId = '';
                career_change_jobs(static function (array $jobs) use ($id, &$savedId): array {
                    $index = null;
                    foreach ($jobs as $position => $job) {
                        if (($job['id'] ?? '') === $id) {
                            $index = $position;
                            break;
                        }
                    }
                    if ($id !== '' && $index === null) {
                        throw new InvalidArgumentException('This position no longer exists. Reload the page.');
                    }
                    $updated = admin_job_from_post($index === null ? null : $jobs[$index]);
                    $savedId = $updated['id'];
                    if ($index === null) {
                        $jobs[] = $updated;
                    } else {
                        $jobs[$index] = $updated;
                    }
                    return $jobs;
                });
                header('Location: index.php?saved=1&edit=' . rawurlencode($savedId), true, 303);
                exit;
            }
        } catch (InvalidArgumentException $exception) {
            $error = $exception->getMessage();
        } catch (Throwable $exception) {
            error_log('Careers admin error: ' . $exception->getMessage());
            $error = 'The change could not be saved. Please try again.';
        }
    }
}

$jobs = [];
if ($signedIn) {
    try {
        $jobs = career_jobs();
        usort($jobs, static fn(array $a, array $b): int => strcmp($b['updated_at'] ?? '', $a['updated_at'] ?? ''));
    } catch (Throwable $exception) {
        error_log('Careers admin listing error: ' . $exception->getMessage());
        $error = 'Positions could not be loaded. Please try again.';
    }
}
$editId = is_string($_GET['edit'] ?? null) ? $_GET['edit'] : '';
$editing = null;
foreach ($jobs as $job) {
    if ($job['id'] === $editId) {
        $editing = $job;
        break;
    }
}
$form = $editing ?? [
    'id' => '', 'title' => '', 'location' => 'Nairobi', 'country' => 'Kenya',
    'country_code' => 'KE', 'employment_type' => 'FULL_TIME', 'workplace' => 'onsite',
    'description' => '', 'responsibilities' => [], 'qualifications' => [],
    'application_type' => 'email', 'application_to' => '', 'closing_date' => '', 'status' => 'draft',
];
if ($error !== '' && $signedIn && admin_field('action') === 'save') {
    foreach (['id', 'title', 'location', 'country', 'country_code', 'employment_type', 'workplace', 'description', 'application_type', 'application_to', 'closing_date', 'status'] as $field) {
        $form[$field] = admin_field($field);
    }
    $form['responsibilities'] = preg_split('/\R/u', admin_field('responsibilities')) ?: [];
    $form['qualifications'] = preg_split('/\R/u', admin_field('qualifications')) ?: [];
}
$saveError = $error !== '' && $signedIn && admin_field('action') === 'save';
$showEditor = $signedIn && ($saveError || isset($_GET['new']) || ($editing !== null && !isset($_GET['saved'])));
?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Careers admin | Global Digital Centre</title>
  <link rel="stylesheet" href="admin.css?v=2">
  <script src="admin.js" defer></script>
</head>
<body>
  <header class="admin-header"><div class="admin-wrap"><a href="../index.html" class="admin-brand">GLOBAL DIGITAL CENTRE</a><span>Careers admin</span></div></header>
  <main class="admin-wrap">
    <?php if (!$signedIn): ?>
      <section class="login-panel">
        <p class="admin-eyebrow">HR ACCESS</p><h1>Sign in to manage careers</h1>
        <p>Use the username and password set by the site administrator.</p>
        <?php if ($error !== ''): ?><p class="admin-error" role="alert"><?= career_escape($error) ?></p><?php endif; ?>
        <?php if ($credentials === null): ?><p class="admin-error">The one-time admin setup has not been completed.</p><?php endif; ?>
        <form method="post" action="index.php" autocomplete="on">
          <input type="hidden" name="csrf" value="<?= career_escape($_SESSION['csrf']) ?>">
          <input type="hidden" name="action" value="login">
          <label>Username<input name="username" autocomplete="username" required autofocus></label>
          <label>Password<input type="password" name="password" autocomplete="current-password" required></label>
          <button type="submit">Sign in</button>
        </form>
      </section>
    <?php else: ?>
      <div class="admin-topline"><div><p class="admin-eyebrow">HR WORKSPACE</p><h1>Career positions</h1><p>Create a draft, review it, then publish it for visitors.</p></div><form method="post" action="index.php"><input type="hidden" name="csrf" value="<?= career_escape($_SESSION['csrf']) ?>"><input type="hidden" name="action" value="logout"><button type="submit" class="admin-text-button">Sign out</button></form></div>
      <?php if ($error !== '' && !$saveError): ?><p class="admin-error" role="alert"><?= career_escape($error) ?></p><?php endif; ?>
      <?php if ($notice !== ''): ?><p class="admin-success" role="status"><?= career_escape($notice) ?></p><?php endif; ?>
      <section class="admin-panel admin-positions">
          <div class="admin-panel-head"><div><p class="admin-eyebrow">POSITIONS</p><h2>Manage openings <span class="admin-count"><?= count($jobs) ?></span></h2></div><a href="index.php?new=1" class="admin-new">+ New position</a></div>
          <?php if ($jobs === []): ?><p class="admin-empty">No positions have been created yet.</p><?php else: ?>
            <ul class="admin-jobs">
              <?php foreach ($jobs as $job): ?>
                <?php $state = $job['status'] === 'published' && !career_is_open($job) ? 'expired' : $job['status']; ?>
                <li><a href="index.php?edit=<?= career_escape($job['id']) ?>"<?= $editId === $job['id'] ? ' aria-current="true"' : '' ?>><span class="admin-job-main"><strong><?= career_escape($job['title']) ?></strong><small><?= career_escape($job['location'] !== '' ? $job['location'] : 'Location pending') ?> · Updated <?= career_escape(date('j M Y', strtotime($job['updated_at']))) ?></small></span><span class="admin-status admin-status-<?= career_escape($state) ?>"><?= career_escape(ucfirst($state)) ?></span><span class="admin-edit-label">Edit <span aria-hidden="true">↗</span></span></a></li>
              <?php endforeach; ?>
            </ul>
          <?php endif; ?>
          <a class="admin-public-link" href="../careers/index.php" target="_blank" rel="noopener noreferrer">View public Careers page ↗</a>
      </section>
      <dialog class="admin-modal" id="position-editor" aria-labelledby="editor-heading"<?= $showEditor ? ' open' : '' ?>>
        <div class="admin-modal-shell">
          <div class="admin-modal-head"><div><p class="admin-eyebrow">CAREER POSITION</p><h2 id="editor-heading"><?= $editing ? 'Edit position' : 'New position' ?></h2></div><a href="index.php" class="admin-modal-close" data-close-modal aria-label="Close editor">×</a></div>
          <form method="post" action="index.php<?= $editId !== '' ? '?edit=' . rawurlencode($editId) : '' ?>">
            <input type="hidden" name="csrf" value="<?= career_escape($_SESSION['csrf']) ?>">
            <input type="hidden" name="action" value="save">
            <input type="hidden" name="id" value="<?= career_escape($form['id']) ?>">
            <div class="admin-modal-body">
            <?php if ($saveError): ?><p class="admin-error" role="alert"><?= career_escape($error) ?></p><?php endif; ?>
            <p class="admin-help">A title is enough to save a draft. Complete the role and application details before publishing.</p>
            <h3 class="admin-form-section">The role</h3>
            <label>Job title<input name="title" maxlength="120" value="<?= career_escape($form['title']) ?>" required autofocus placeholder="Event Production Coordinator"></label>
            <div class="admin-row">
              <label>Location / city<input name="location" maxlength="100" value="<?= career_escape($form['location']) ?>"></label>
              <label>Workplace<select name="workplace"><option value="onsite"<?= $form['workplace'] === 'onsite' ? ' selected' : '' ?>>On site</option><option value="hybrid"<?= $form['workplace'] === 'hybrid' ? ' selected' : '' ?>>Hybrid</option><option value="remote"<?= $form['workplace'] === 'remote' ? ' selected' : '' ?>>Remote</option></select></label>
            </div>
            <div class="admin-row">
              <label>Country<input name="country" maxlength="100" value="<?= career_escape($form['country']) ?>"></label>
              <label>Country code<input name="country_code" maxlength="2" value="<?= career_escape($form['country_code']) ?>" aria-describedby="country-help"><small id="country-help">Two letters, such as KE.</small></label>
            </div>
            <div class="admin-row">
              <label>Employment type<select name="employment_type"><?php foreach (['FULL_TIME' => 'Full time', 'PART_TIME' => 'Part time', 'CONTRACTOR' => 'Contract', 'TEMPORARY' => 'Temporary', 'INTERN' => 'Internship', 'VOLUNTEER' => 'Volunteer'] as $value => $label): ?><option value="<?= $value ?>"<?= $form['employment_type'] === $value ? ' selected' : '' ?>><?= $label ?></option><?php endforeach; ?></select></label>
              <label>Closing date <small>(optional)</small><input type="date" name="closing_date" value="<?= career_escape($form['closing_date']) ?>"></label>
            </div>
            <h3 class="admin-form-section">What the job involves</h3>
            <label>Role description<textarea name="description" rows="5" maxlength="10000" placeholder="Describe the role, team and working arrangements."><?= career_escape($form['description']) ?></textarea></label>
            <div class="admin-row admin-row-notes">
              <label>Responsibilities <small>(one per line)</small><textarea name="responsibilities" rows="4" placeholder="Plan and coordinate event logistics"><?= career_escape(implode("\n", $form['responsibilities'])) ?></textarea></label>
              <label>Qualifications <small>(one per line)</small><textarea name="qualifications" rows="4" placeholder="Experience in event production"><?= career_escape(implode("\n", $form['qualifications'])) ?></textarea></label>
            </div>
            <h3 class="admin-form-section">Applications & visibility</h3>
            <div class="admin-row">
              <label>Apply through<select name="application_type"><option value="email"<?= $form['application_type'] === 'email' ? ' selected' : '' ?>>Email</option><option value="url"<?= $form['application_type'] === 'url' ? ' selected' : '' ?>>Web link</option></select></label>
              <label>Application email or link<input name="application_to" maxlength="500" value="<?= career_escape($form['application_to']) ?>" placeholder="careers@example.com" aria-describedby="application-help"><small id="application-help">Required to publish. Include https:// for a web link.</small></label>
            </div>
            <label>Status<select name="status"><option value="draft"<?= $form['status'] === 'draft' ? ' selected' : '' ?>>Draft — visible only here</option><option value="published"<?= $form['status'] === 'published' ? ' selected' : '' ?>>Published — visible on Careers</option><option value="closed"<?= $form['status'] === 'closed' ? ' selected' : '' ?>>Closed — hidden from Careers</option></select></label>
            </div>
            <div class="admin-modal-actions"><a href="index.php" class="admin-cancel" data-close-modal>Cancel</a><button type="submit" class="admin-save">Save position</button></div>
          </form>
        </div>
      </dialog>
    <?php endif; ?>
  </main>
</body>
</html>
