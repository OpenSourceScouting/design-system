// preinstall guard: require npm >= 11.
//
// npm 10 has an optional-dependency lockfile bug (npm/cli#4828): when
// package-lock.json is regenerated on one platform it records only that
// platform's native bindings (e.g. oxc-resolver's darwin-arm64) and drops the
// others (linux-x64-gnu), so `npm ci` then fails on other platforms — most
// visibly in CI. npm 11 records every platform. This guard stops an older npm
// from silently regenerating a truncated lockfile.
//
// Scoped deliberately to the npm MAJOR version only: unlike `.npmrc`
// engine-strict, it does not turn every transitive dependency's `engines`
// mismatch into a hard error, so it will not block contributors who are on a
// slightly different Node release.
//
// npm exposes its own version to lifecycle scripts via the user-agent env var,
// e.g. "npm/11.18.0 node/v22.14.0 darwin arm64". If it is absent (script run
// outside an npm lifecycle) we cannot tell, so we do not block.
const ua = process.env.npm_config_user_agent ?? "";
const match = ua.match(/\bnpm\/(\d+)\./);

if (match) {
  const npmMajor = Number(match[1]);
  if (npmMajor < 11) {
    const version = ua.match(/\bnpm\/(\S+)/)?.[1] ?? `${npmMajor}.x`;
    console.error(
      `\n[design-system] npm >= 11 is required (you have ${version}).\n` +
        `npm 10 writes platform-incomplete lockfiles (npm/cli#4828), which breaks\n` +
        `\`npm ci\` on other platforms. Upgrade with:  npm install -g npm@11\n`,
    );
    process.exit(1);
  }
}
