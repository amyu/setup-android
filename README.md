# setup-android — Android SDK setup for GitHub Actions

`amyu/setup-android` installs and caches the Android SDK on self-hosted Linux,
macOS, and Windows runners. Install the SDK platforms your Gradle build needs,
or pin the Android NDK and CMake versions used by a native build.
[View the action on GitHub Marketplace](https://github.com/marketplace/actions/setup-android-sdk-for-self-hosted-runners).

## When to use this action

GitHub-hosted runners already include the Android SDK. This action is primarily
intended for self-hosted runners or jobs that require a clean, customized SDK
installation.

## Usage

See [action.yml](action.yml) for the complete input reference.

The examples below use release tags. Use them with a
[workflow lockfile](https://docs.github.com/en/actions/how-tos/secure-your-work/lock-workflow-dependencies)
in your own repository. For workflows without a lockfile, pin each action in
`uses:` to the full 40-character commit SHA for that release.

### Basic usage

```yaml
steps:
  - uses: actions/checkout@v7.0.1
  - name: Setup JDK 17
    uses: actions/setup-java@v5.6.0
    with:
      java-version: 17
      distribution: jetbrains

  - name: Setup Android SDK
    uses: amyu/setup-android@v6.0

  - run: ./gradlew build --stacktrace
```

### Install the agent skill

Run the following command from your Android project to install the skill for
your coding agent.

```sh
npx skills add amyu/setup-android --skill setup-android
```

Try asking “Set up the Android SDK for our self-hosted runner using the versions
from our Gradle build.” [Read the setup-android skill](https://github.com/amyu/setup-android/blob/main/skills/setup-android/SKILL.md).

### Read the SDK version from a version catalog

If your build reads `compileSdk` from a Gradle version catalog, CI can read the
same value. This example uses Python 3.11 or later and a catalog entry named
`compileSdkVersion`. Use the key your build references.

```yaml
- name: Read compileSdk from the version catalog
  id: read_version
  shell: python
  run: |
    import os
    import tomllib

    with open("gradle/libs.versions.toml", "rb") as catalog:
        sdk = tomllib.load(catalog)["versions"]["compileSdkVersion"]
    with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as output:
        print(f"sdkVersion={sdk}", file=output)

- name: Setup Android SDK
  uses: amyu/setup-android@v6.0
  with:
    sdk-version: ${{ steps.read_version.outputs.sdkVersion }}
```

### Configuration examples

#### Install multiple Android SDK platforms and Build Tools

Pass one version per line when a job builds modules with different
`compileSdk` values. For a single platform, use a scalar such as
`sdk-version: "36"`. API level 37 and later use minor versions such as
`"37.0"`. Add Build Tools versions when the build requires them.

```yaml
- uses: amyu/setup-android@v6.0
  with:
    sdk-version: |
      36
      37.0
    build-tools-version: |
      35.0.0
      36.0.0
```

#### Set up the Android NDK and CMake

For a native Android build, use the NDK and CMake versions declared in Gradle.

```yaml
- uses: amyu/setup-android@v6.0
  with:
    ndk-version: "28.2.13676358"
    cmake-version: "3.31.6"
```

#### Configure SDK caching and command-line tools

SDK caching is enabled by default. The generated cache key includes the requested
component versions. Set `cache-disabled: true` to skip restoring and saving the
SDK, or supply a `cache-key` that changes when your SDK requirements change.

```yaml
- uses: amyu/setup-android@v6.0
  with:
    cache-disabled: true
    command-line-tools-version: 15859902
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

## Environment for subsequent steps

The action sets `ANDROID_HOME` and `ANDROID_SDK_ROOT` and adds
`platform-tools` and `cmdline-tools/latest/bin` under the SDK root to `PATH`.
Later steps can run `adb` and `sdkmanager` directly.

When `ndk-version` is set, the action exports `ANDROID_NDK_ROOT`,
`ANDROID_NDK_HOME`, and `ANDROID_NDK`, and adds the selected NDK directory
to `PATH`. When `cmake-version` is set, it exports `CMAKE_VERSION`.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

## Contributing

Contributions are welcome!
