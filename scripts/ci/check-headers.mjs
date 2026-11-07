/**
 * Checks the security headers on the deployed site.
 *
 * Reads the production origin from the argument or the default deployment,
 * fetches three representative routes and fails when a required header is
 * missing or weaker than the policy in apps/web/lib/securityHeaders.ts. Run it
 * after a deployment; it makes no changes.
 */
const origin = process.argv[2] ?? 'https://sawdagar-dokanpart.vercel.app';
const routes = ['/', '/catalog', '/login'];

const checks = [
  ['content-security-policy', (value) => value.includes("default-src 'self'")],
  ['content-security-policy', (value) => value.includes("frame-ancestors 'none'")],
  ['content-security-policy', (value) => value.includes("object-src 'none'")],
  [
    'strict-transport-security',
    (value) =>
      /max-age=(\d+)/.test(value) && Number(/max-age=(\d+)/.exec(value)?.[1]) >= 31_536_000,
  ],
  ['x-content-type-options', (value) => value.toLowerCase() === 'nosniff'],
  ['x-frame-options', (value) => value.toUpperCase() === 'DENY'],
  ['referrer-policy', (value) => value === 'strict-origin-when-cross-origin'],
  ['permissions-policy', (value) => value.includes('camera=()') && value.includes('microphone=()')],
];

let failures = 0;
for (const route of routes) {
  const response = await fetch(`${origin}${route}`, { redirect: 'manual' });
  for (const [header, predicate] of checks) {
    const value = response.headers.get(header) ?? '';
    const ok = value.length > 0 && predicate(value);
    process.stdout.write(
      `${ok ? 'PASS' : 'FAIL'} ${route} ${header}${ok ? '' : ` (${value || 'missing'})`}\n`,
    );
    if (!ok) failures += 1;
  }
}

process.stdout.write(
  failures === 0
    ? `\nAll security headers present on ${routes.length} routes.\n`
    : `\n${failures} header check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
