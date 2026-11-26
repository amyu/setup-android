import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { installedNdkPath, validateNdkVersion } from "../src/ndk.ts";
import { verifyArchive } from "../src/verify-archive.ts";

test("an NDK input is a single package revision", () => {
  for (const version of ["", "28.2.13676358"]) validateNdkVersion(version);
  for (const version of ["ndk/28.2.13676358", "28.2", "28.2.13676358\n29.0.1"]) {
    assert.throws(() => validateNdkVersion(version), /ndk-version/);
  }
});

test("only the selected installed NDK directory can be exported", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "sdk-ndk-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const ndk = path.join(root, "ndk", "28.2.13676358");
  await mkdir(ndk, { recursive: true });
  assert.equal(await installedNdkPath(root, "28.2.13676358"), ndk);
  await symlink(ndk, path.join(root, "ndk", "29.0.14206865"), "junction");
  await assert.rejects(installedNdkPath(root, "29.0.14206865"), /expected SDK directory/);
  await assert.rejects(installedNdkPath(root, "30.0.16248370"), { code: "ENOENT" });
});

test("the archive must match its pinned SHA-256", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "sdk-archive-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const file = path.join(root, "archive.zip");
  const archive = {
    url: "https://example.invalid/archive.zip",
    sha256: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  };
  await writeFile(file, "abc");
  await verifyArchive(file, archive);
  await writeFile(file, "incomplete archive");
  await assert.rejects(verifyArchive(file, archive), /SHA-256 mismatch/);
});
