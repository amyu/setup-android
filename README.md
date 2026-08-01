# setup-android

`setup-android` installs Android SDK components on self-hosted GitHub Actions runners.

- Downloads the Android command-line tools for Linux, macOS, and Windows.
- Installs requested Android SDK platforms and optional Build Tools, NDK, and CMake versions.
- Optionally caches the installed Android SDK.
- Exports the following environment variables:
  + `ANDROID_SDK_ROOT`
  + `ANDROID_HOME`
  + `ANDROID_NDK_ROOT` (when `ndk-version` is specified)
  + `ANDROID_NDK_HOME` (when `ndk-version` is specified)
  + `ANDROID_NDK` (when `ndk-version` is specified)
  + `CMAKE_VERSION` (when `cmake-version` is specified)
- Adds the following directories to `PATH`:
  + `$ANDROID_SDK_ROOT/platform-tools`
  + `$ANDROID_SDK_ROOT/cmdline-tools/latest/bin`
  + `$ANDROID_SDK_ROOT/ndk/<version>` (when `ndk-version` is specified)

## When to use this action

GitHub-hosted runners already include the Android SDK. This action is primarily
intended for self-hosted runners or jobs that require a clean, customized SDK
installation.

## Usage

See [action.yml](action.yml) for the complete input reference.

### Basic usage

```yaml
steps:
  - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
  - name: Setup JDK 17
    uses: actions/setup-java@03ad4de0992f5dab5e18fcb136590ce7c4a0ac95 # v5.6.0
    with:
      java-version: 17
      distribution: jetbrains

  - name: Setup Android SDK
    uses: amyu/setup-android@3fe49086b1abd7c9ef865120d5d4d486fe55ba98 # v5.7

  - run: ./gradlew build --stacktrace
```

### Read the SDK version from a version catalog

If your project uses a Gradle version catalog, the SDK version can be passed to
the action dynamically:

```yaml
- name: "Get sdkVersion from versions.toml"
  id: read_version
  shell: bash
  run: |
    version=$(perl -nlE 'say if s/compileSdkVersion \= \"(.*)\"/$1/g' gradle/libs.versions.toml)
    echo "sdkVersion=$version" >> "$GITHUB_OUTPUT"

- name: Setup Android SDK
  uses: amyu/setup-android@3fe49086b1abd7c9ef865120d5d4d486fe55ba98 # v5.7
  with:
    sdk-version: ${{ steps.read_version.outputs.sdkVersion }}
```

### Configuration examples

```yaml
  - name: Setup Android SDK
    uses: amyu/setup-android@3fe49086b1abd7c9ef865120d5d4d486fe55ba98 # v5.7
    with:
      # default: false
      # Disable Android SDK caching.
      cache-disabled: false

      # default: `${sdkVersion}-${buildToolsVersion}-${ndkVersion}-${cmakeVersion}-${commandLineToolsVersion}-${hashedCacheDirectory}-v6`
      # Custom cache key. Ignored when `cache-disabled` is true.
      cache-key: 'custom-cache-key'

      # default: 37.0
      # Android SDK platform suffix. Supports major, major.minor, and published
      # codename-based values.
      # See https://developer.android.com/studio/releases/platforms
      # API level 37 and later use minor versions in SDK Manager. A bare major
      # version such as 37 is installed as 37.0 with a warning.
      sdk-version: "37.0"
      # Install multiple SDK platforms.
      sdk-version: |
        36
        37.0

      # default: ''
      # Android SDK Build Tools version. If omitted, Build Tools are not
      # preinstalled. Prefer letting AGP select the required version unless a
      # specific version must be available in CI.
      # See https://developer.android.com/studio/releases/build-tools
      build-tools-version: 36.0.0
      # Install multiple Build Tools versions.
      build-tools-version: |
        35.0.0
        36.0.0

      # default: ''
      # CMake version to install.
      # See https://developer.android.com/studio/projects/install-ndk
      cmake-version: 3.31.6

      # default: ''
      # Android NDK version to install.
      # See https://developer.android.com/ndk/downloads
      ndk-version: 28.2.13676358

      # default: 15859902
      # Android command-line tools package revision.
      # See https://developer.android.com/studio#command-line-tools-only
      command-line-tools-version: 15859902

      # default: true
      # Generate a job summary.
      generate-job-summary: false
```

### Codename-based preview platforms

Codename-based SDK platforms are supported when they are published in Google's
SDK repository. Pass the exact suffix shown after `platforms;android-` by
[`sdkmanager --list`](https://developer.android.com/tools/sdkmanager#list_installed_and_available_packages).
For example, a package named
`platforms;android-<codename>` is selected with `sdk-version: <codename>`.
Availability depends on the current SDK repository; when no codename package is
listed, use an available numeric platform suffix instead.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

## Contributing

Contributions are welcome!
