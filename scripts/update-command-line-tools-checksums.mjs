import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

// Renovate updates action.yml first. Keep the reviewed digests for earlier builds.
const metadata = await readFile("action.yml", "utf8");
const revision = metadata.match(
  /^  command-line-tools-version:\n(?:    [^\n]*\n)*?    default: "(\d+)"$/m,
)?.[1];
assert.ok(revision, "Missing default command-line tools revision");

const manifest = "src/command-line-tools-checksums.json";
const pins = JSON.parse(await readFile(manifest, "utf8"));
const response = await fetch("https://developer.android.com/studio?hl=en");
assert.ok(response.ok, `Android download page returned HTTP ${response.status}`);
const rows = [...(await response.text()).matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
for (const platform of ["linux", "win", "mac_x86_64", "mac_arm64"]) {
  const filename = `commandlinetools-${platform}-${revision}_latest.zip`;
  const row = rows.find(([, cells]) => cells.includes(`>${filename}<`));
  const checksum = row?.[1].match(/<td>\s*([a-f0-9]{64})\s*<\/td>/i)?.[1].toLowerCase();
  assert.ok(checksum, `Missing official SHA-256 for ${filename}`);
  assert.ok(
    !pins[filename] || pins[filename] === checksum,
    `Published checksum changed for ${filename}`,
  );
  pins[filename] = checksum;
}
await writeFile(manifest, JSON.stringify(pins, Object.keys(pins).toSorted(), 2) + "\n");
