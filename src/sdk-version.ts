const FIRST_ANDROID_MINOR_API_LEVEL = 37
const MAJOR_ONLY_API_LEVEL = /^\d+$/

type NormalizeSdkVersionOptions = {
  warn?: (message: string) => void
}

export function normalizeSdkVersion(
  version: string,
  options: NormalizeSdkVersionOptions = {}
): string {
  const trimmedVersion = version.trim()
  if (!MAJOR_ONLY_API_LEVEL.test(trimmedVersion)) {
    return trimmedVersion
  }

  const apiLevel = Number.parseInt(trimmedVersion, 10)
  if (apiLevel < FIRST_ANDROID_MINOR_API_LEVEL) {
    return trimmedVersion
  }

  const normalizedVersion = `${apiLevel}.0`
  options.warn?.(
    `Android SDK API level ${trimmedVersion} uses minor version package ` +
      `names. Installing sdk-version: ${normalizedVersion}. Specify ` +
      `${normalizedVersion} explicitly to remove this warning.`
  )

  return normalizedVersion
}

export function normalizeSdkVersions(
  versions: string[],
  options: NormalizeSdkVersionOptions = {}
): string[] {
  return versions.map(version => normalizeSdkVersion(version, options))
}
