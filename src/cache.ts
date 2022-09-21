export function generateRestoreKey(
  sdkVersion: string,
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string
): string {
  return `${sdkVersion}-${buildToolsVersion}-${ndkVersion}-${cmakeVersion}-0`
}
