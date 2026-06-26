# setup-android

This action provides the following functionality for GitHub Actions users:

- Optionally downloading and caching distribution of the requested sdk version or build tools version or ndk,cmake version.
- Runs on Mac, Linux and Windows powered by SelfHostedRunner.
- Exporting environment variables:
  + `ANDROID_SDK_ROOT`
  + `ANDROID_HOME`
  + `ANDROID_NDK_ROOT` (when `ndk-version` is specified)
  + `ANDROID_NDK_HOME` (when `ndk-version` is specified)
  + `ANDROID_NDK` (when `ndk-version` is specified)
  + `CMAKE_VERSION` (when `cmake-version` is specified)
- Adding to PATH:
  + `$ANDROID_SDK_ROOT/platform-tools`
  + `$ANDROID_SDK_ROOT/ndk-bundle`
  + `$ANDROID_SDK_ROOT/cmdline-tools/latest/bin`

# Motivation

This Action is provided for SelfHostedRunner.  
GithubHostedRunner does not need this Action as it already has the SDK set up.

# Usage

See [action.yml](action.yml)

**Basic:**

```yaml
steps:
  - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
  - name: Setup JDK 17
    uses: actions/setup-java@1bcf9fb12cf4aa7d266a90ae39939e61372fe520 # v5.4.0
    with:
      java-version: 17
      distribution: jetbrains

  - name: Setup Android SDK
    uses: amyu/setup-android@dd20604d00311747ada5db85ecdf4d7577fab4f9 # v5.6

  - run: ./gradlew build --stacktrace
```

**Recommend:**

If your project uses VersionCatalog, the following settings are recommended

```yaml
- name: "Get sdkVersion from versions.toml"
  id: read_version
  shell: bash
  run: |
    version=`perl -nlE 'say if s/compileSdkVersion \= \"(.*)\"/$1/g' gradle/libs.versions.toml`
    echo "sdkVersion=$version" >> $GITHUB_OUTPUT

- name: Setup Android SDK
  uses: amyu/setup-android@dd20604d00311747ada5db85ecdf4d7577fab4f9 # v5.6
  with:
    sdk-version: ${{ steps.read_version.outputs.sdkVersion }}
```

**More Information:**

```yaml
  - name: Setup Android SDK
    uses: amyu/setup-android@dd20604d00311747ada5db85ecdf4d7577fab4f9 # v5.6
    with:
      # default: false
      # Whether to use the cache
      cache-disabled: true

      # default: `${sdkVersion}-${buildToolsVersion}-${ndkVersion}-${cmakeVersion}-${commandLineToolsVersion}-${hashedCacheDirectory}-v5`
      # Custom key for cache. It is invalid when `cache-disabled: true`
      cache-key: 'custom-cache-key'

      # default: 36
      # sdk version. Supports major and major.minor API levels.
      # see https://developer.android.com/studio/releases/platforms
      # API level 37 and later use minor versions in SDK Manager. A bare major
      # version such as 37 is installed as 37.0 with a warning.
      # It will always be installed.
      sdk-version: 36
      # or
      sdk-version: 37.0
      # or
      sdk-version: |
        35
        36
      # or set sdk-version to a codename-based platform package from SDK Manager
      sdk-version: CinnamonBun

      # default: ''
      # build tools version
      # see https://developer.android.com/studio/releases/build-tools
      # Optional. If omitted, this action does not preinstall build-tools.
      # In typical Android/Gradle projects, prefer letting AGP manage the required version.
      # Set this only when you need to preinstall a specific version in CI.
      build-tools-version: 36.0.0
      # or
      build-tools-version: |
        30.0.3
        31.0.0
        36.0.0

      # default: ''
      # cmake version
      # see https://developer.android.com/studio/projects/install-ndk
      # Installed when the version is specified
      cmake-version: 3.10.2.4988404

      # default: ''
      # cmake version
      # see https://developer.android.com/studio/projects/install-ndk
      # Installed when the version is specified
      ndk-version: 23.1.7779620

      # default: 14742923
      # see https://developer.android.com/studio#command-tools
      # ex commandlinetools-mac-${command-line-tools-version}_latest.zip
      command-line-tools-version: 14742923

      # default: true
      # Whether to generate or not the job summary
      generate-job-summary: false
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!
