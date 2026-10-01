import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';

const dataDir = mkdtempSync(join(tmpdir(), 'gdc-careers-test-'));
const env = {
  ...process.env,
  GDC_CAREERS_DATA_DIR: dataDir,
  GDC_ADMIN_USER: 'validationhr',
  GDC_ADMIN_PASSWORD: 'ValidationOnly123!'
};
let server;

try {
  execFileSync('php', ['scripts/setup-careers-admin.php'], { env, stdio: 'inherit' });
  const port = await new Promise((resolve, reject) => {
    const socket = createServer();
    socket.once('error', reject);
    socket.listen(0, '127.0.0.1', () => {
      const selected = socket.address().port;
      socket.close(() => resolve(selected));
    });
  });
  env.GDC_TEST_ORIGIN = `http://127.0.0.1:${port}`;
  server = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', '.'], { env, stdio: 'ignore' });
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(`${env.GDC_TEST_ORIGIN}/careers/index.php`);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch { /* Server is starting. */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!ready) throw new Error('The isolated PHP test server did not start.');
  execFileSync(process.execPath, ['scripts/test-careers.mjs'], { env, stdio: 'inherit' });
} finally {
  server?.kill();
  const resolved = realpathSync(dataDir);
  if (dirname(resolved) !== realpathSync(tmpdir()) || !basename(resolved).startsWith('gdc-careers-test-')) {
    throw new Error('Refusing to remove an unexpected careers test directory.');
  }
  rmSync(resolved, { recursive: true, force: true });
}
