import { registerHooks } from "node:module";

// Load the TypeScript entry points, replacing only the network-facing cache and installer.
const sources = {
  "@actions/cache": `
    export class ReserveCacheError extends Error {}
    export function restoreCache(_paths, key, _restoreKeys, options) {
      return !options?.lookupOnly && process.env.TEST_CACHE_HIT ? { key } : undefined;
    }
    export function saveCache(_paths, key) {
      console.log("TEST_CACHE_SAVE " + key);
      return { key };
    }
  `,
  "./installer.js": `
    export function installAndroidSdk() {
      if (process.env.TEST_INSTALL_FAILURE) throw new Error("SHA-256 mismatch");
    }
  `,
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL?.startsWith(new URL("../src/", import.meta.url).href)) {
      if (Object.hasOwn(sources, specifier)) {
        return {
          shortCircuit: true,
          url: "data:text/javascript," + encodeURIComponent(sources[specifier]),
        };
      }
      if (specifier.startsWith("./") && specifier.endsWith(".js")) {
        return nextResolve(specifier.slice(0, -3) + ".ts", context);
      }
    }
    return nextResolve(specifier, context);
  },
});
