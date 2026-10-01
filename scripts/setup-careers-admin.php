<?php
declare(strict_types=1);
require dirname(__DIR__) . '/careers/lib.php';

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$username = getenv('GDC_ADMIN_USER') ?: '';
$password = getenv('GDC_ADMIN_PASSWORD') ?: '';
if (!preg_match('/^[A-Za-z0-9._-]{3,40}$/', $username) || strlen($password) < 12 || strlen($password) > 256) {
    fwrite(STDERR, "Set GDC_ADMIN_USER (3–40 letters/numbers/._-) and GDC_ADMIN_PASSWORD (12–256 characters), then run this script.\n");
    exit(1);
}

$directory = career_data_dir(true);
$file = $directory . DIRECTORY_SEPARATOR . 'auth.json';
$data = json_encode([
    'username' => $username,
    'password_hash' => password_hash($password, PASSWORD_DEFAULT),
], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR) . "\n";
$temporary = tempnam($directory, 'auth-');
if ($temporary === false || file_put_contents($temporary, $data) === false) {
    fwrite(STDERR, "Could not write credentials.\n");
    exit(1);
}
@chmod($temporary, 0600);
if (!@rename($temporary, $file)) {
    if (file_put_contents($file, $data, LOCK_EX) === false) {
        @unlink($temporary);
        fwrite(STDERR, "Could not save credentials.\n");
        exit(1);
    }
    @unlink($temporary);
}
@chmod($file, 0600);
fwrite(STDOUT, "Careers admin credentials saved outside the website folder. Existing sessions will need the new password.\n");
