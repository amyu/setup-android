---
name: setup-android
description: Configure amyu/setup-android in an Android project's GitHub Actions workflow. Use when a self-hosted runner needs the Android SDK, or a build needs specific SDK platforms, Build Tools, NDK, or CMake versions in CI.
---

# Set up the Android SDK in GitHub Actions

1. Find the job that runs the Android Gradle build, following reusable
   workflows or composite actions if needed. Check the runner and existing SDK
   provisioning. GitHub-hosted images already include an Android SDK. Add the
   action there only when the build needs a separate or customized SDK.
2. Read the Android modules' `compileSdk` settings. Follow references into
   version catalogs, Gradle properties, or convention plugins. Use the
   platform required by each module built in the job. For example,
   `compileSdk = 36` maps to `sdk-version: "36"`, and API 37 maps to
   `"37.0"`. Preserve an explicitly declared minor version. For a preview,
   use the published package suffix after `platforms;android-`. Pass
   distinct platforms one per line if a single job builds against several.
3. Add `amyu/setup-android` after Java is available and before the first
   step that needs the SDK. Keep the project's runner, JDK, Gradle tasks, and
   unrelated setup. Retain any extra `sdkmanager` packages the job needs,
   such as emulator system images.
4. Choose the requested release or the latest published release. If the
   consuming repository uses a workflow lockfile, use the exact release tag
   and regenerate the lockfile with its usual tooling. Otherwise resolve the
   release tag to its full 40-character commit SHA and use that in `uses`.
   [Published releases](https://github.com/amyu/setup-android/releases)
5. Set `build-tools-version`, `ndk-version`, or `cmake-version` when the
   project requires those packages at specific versions. Otherwise leave
   version selection to the Android Gradle Plugin. The action caches the SDK
   by default. For additional inputs, check `action.yml` at the selected
   release. [Action input reference](https://github.com/amyu/setup-android/blob/main/action.yml)
6. Validate the edited workflow with the project's usual checks. In CI, the
   existing Gradle task should build against the selected SDK. To diagnose a
   missing package, run `sdkmanager --list_installed` after the setup step.
