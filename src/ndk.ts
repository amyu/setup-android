import { realpath, stat } from "node:fs/promises";
import path from "node:path";

export function validateNdkVersion(version: string): void {
  if (version && !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error("ndk-version must be a numeric SDK Manager revision such as 28.2.13676358.");
  }
}

export async function installedNdkPath(sdkRoot: string, version: string): Promise<string> {
  const directory = path.join(sdkRoot, "ndk", version);
  const installed = await realpath(directory);
  if (
    path.relative(await realpath(sdkRoot), installed) !== path.join("ndk", version) ||
    !(await stat(installed)).isDirectory()
  ) {
    throw new Error("The selected NDK must be installed in its expected SDK directory.");
  }
  return directory;
}
