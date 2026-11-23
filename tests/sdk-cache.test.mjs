import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { generateCacheKey } from "../src/cache-state.ts";

const versions = {
  sdkVersion: ["23"],
  buildToolsVersion: [],
  ndkVersion: "",
  cmakeVersion: "",
  commandLineToolsVersion: "15859902",
  commandLineToolsArchive: { sha256: "a".repeat(64) },
};

function key(selection, customKey = "", root = "/sdk") {
  return generateCacheKey(selection, customKey, root);
}

test("cache keys preserve component boundaries, custom overrides and bootstrap identity", () => {
  const otherSdk = { ...versions, sdkVersion: ["2", "3"] };
  assert.notEqual(key(versions), key(otherSdk));
  const long = "a".repeat(450);
  assert.match(key(versions, long), /^setup-android-v8-[0-9a-f]{64}$/);
  assert.equal(key(versions, long), key(otherSdk, long.toUpperCase()));
  assert.notEqual(key(versions, long), key(versions, long + "b"));
  assert.notEqual(key(versions, long), key(versions, long, "/other"));
  assert.notEqual(
    key(versions, long),
    key({ ...versions, commandLineToolsArchive: { sha256: "b".repeat(64) } }, long),
  );
});

function readCommands(file, prefix) {
  const commands = {};
  for (const match of readFileSync(file, "utf8").matchAll(
    /^([^\r\n<]+)<<([^\r\n]+)\r?\n([\s\S]*?)\r?\n\2\r?$/gm,
  )) {
    commands[prefix + match[1]] = match[3];
  }
  return commands;
}

function actionJob(t) {
  const dir = mkdtempSync(path.join(tmpdir(), "setup-android-cache-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const jobEnv = {
    HOME: dir,
    USERPROFILE: dir,
    PATH: process.env.PATH,
    SystemRoot: process.env.SystemRoot,
    "INPUT_SDK-VERSION": "23",
    "INPUT_COMMAND-LINE-TOOLS-VERSION": "15859902",
    "INPUT_CACHE-DISABLED": "false",
    "INPUT_GENERATE-JOB-SUMMARY": "false",
    "INPUT_JOB-STATUS": "success",
  };

  function step(entry, inputs) {
    const files = {};
    for (const name of ["GITHUB_ENV", "GITHUB_PATH", "GITHUB_STATE"]) {
      files[name] = path.join(dir, name);
      writeFileSync(files[name], "");
    }
    const result = spawnSync(
      process.execPath,
      [
        "--import",
        new URL("./cache-hooks.mjs", import.meta.url).href,
        fileURLToPath(new URL("../src/" + entry + ".ts", import.meta.url)),
      ],
      { env: { ...jobEnv, ...files, ...inputs }, encoding: "utf8" },
    );
    assert.ifError(result.error);
    Object.assign(jobEnv, readCommands(files.GITHUB_ENV, ""));
    return { ...result, state: readCommands(files.GITHUB_STATE, "STATE_") };
  }
  return {
    setup(inputs = {}, expectedStatus = 0) {
      const result = step("setup-android", inputs);
      assert.equal(result.status, expectedStatus, result.stdout + result.stderr);
      return result.state;
    },
    cleanup(state, inputs = {}) {
      const result = step("cleanup-android", { ...state, ...inputs });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      return [...result.stdout.matchAll(/^TEST_CACHE_SAVE (.+)$/gm)].map((match) =>
        match[1].trim(),
      );
    },
    root: path.join(dir, ".android", "sdk"),
  };
}

test("a continued setup failure cannot save the SDK, even after an earlier success", (t) => {
  const job = actionJob(t);
  const first = job.setup();
  const failed = job.setup({ TEST_INSTALL_FAILURE: "1" }, 1);
  assert.deepEqual(job.cleanup(failed), []);
  assert.deepEqual(job.cleanup(first), []);
});

test("failed NDK path validation prevents caching an otherwise completed install", (t) => {
  const job = actionJob(t);
  const failed = job.setup({ "INPUT_NDK-VERSION": "28.2.13676358" }, 1);
  assert.deepEqual(job.cleanup(failed), []);
});

test("only the latest successful installation saves under its own key", (t) => {
  const job = actionJob(t);
  const first = job.setup();
  const second = job.setup({ "INPUT_SDK-VERSION": "35" });
  const pinnedVersions = JSON.parse(second.STATE_completedSetup).versions;
  assert.deepEqual(pinnedVersions.sdkVersion, ["35"]);
  assert.deepEqual(job.cleanup(second), [generateCacheKey(pinnedVersions, "", job.root)]);
  assert.deepEqual(job.cleanup(first), []);
  assert.deepEqual(job.cleanup(second, { "INPUT_JOB-STATUS": "failure" }), []);
});

for (const { mode, inputs } of [
  { mode: "cache hit", inputs: { TEST_CACHE_HIT: "1" } },
  { mode: "cache-disabled install", inputs: { "INPUT_CACHE-DISABLED": "true" } },
]) {
  test(`a later ${mode} supersedes the previous installation`, (t) => {
    const job = actionJob(t);
    const first = job.setup();
    const second = job.setup(inputs);
    assert.deepEqual(job.cleanup(second), []);
    assert.deepEqual(job.cleanup(first), []);
  });
}
