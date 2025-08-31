# setup-android

This action provides the following functionality for GitHub Actions users:

- Optionally downloading and caching distribution of the requested sdk version or build tools version or ndk,cmake version, and adding it to the PATH
- Runs on Mac, Linux and Windows powered by SelfHostedRunner

# Motivation

This Action is provided for SelfHostedRunner.  
GithubHostedRunner does not need this Action as it already has the SDK set up.

# Usage

See [action.yml](action.yml)

**Basic:**

```yaml
steps:
  - uses: actions/checkout@v5
  - name: Setup JDK 17
    uses: actions/setup-java@v5
    with:
      java-version: 17
      distribution: jetbrains

  - name: Setup Android SDK
    uses: amyu/setup-android@v4

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
  uses: amyu/setup-android@v4
  with:
    sdk-version: ${{ steps.read_version.outputs.sdkVersion }}
```

**More Information:**

```yaml
  - name: Setup Android SDK
    uses: amyu/setup-android@v4
    with:
      # default: false
      # Whether to use the cache
      cache-disabled: true

      # default: `${sdkVersion}-${buildToolsVersion}-${ndkVersion}-${cmakeVersion}-${hashedCacheDirectory}-v4`
      # Custom key for cache. It is invalid when `cache-disabled: true`
      cache-key: 'custom-cache-key'

      # default: 34
      # sdk version
      # see https://developer.android.com/studio/releases/platforms
      # It will always be installed.
      sdk-version: 34
      # or
      sdk-version: |
        33
        34

      # default: 33.0.2
      # build tools version
      # see https://developer.android.com/studio/releases/build-tools
      # It will always be installed.
      build-tools-version: 33.0.2

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

      # default: 13114758
      # see https://developer.android.com/studio#command-tools
      # ex commandlinetools-mac-${command-line-tools-version}_latest.zip
      command-line-tools-version: 13114758

      # default: true
      # Whether to generate or not the job summary
      generate-job-summary: false
```

**Install Beta SDK:**

Set sdk-version to the value written in API Level from SDK Manager  
![](./screenshots/information_for_install_beta_sdk.png)

```yaml
- name: Setup Android SDK
  uses: amyu/setup-android@v4
  with:
    sdk-version: VanillaIceCream
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!
