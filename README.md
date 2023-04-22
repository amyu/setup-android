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
  - uses: actions/checkout@v3
  - name: Setup JDK 17
    uses: actions/setup-java@v3
    with:
      java-version: 17
      distribution: temurin
      
  - name: Setup Android SDK
    uses: amyu/setup-android@v2

  - run: ./gradlew build --stacktrace
```

**Additional:**
```yaml
steps:
  - uses: actions/checkout@v3
  - name: Setup JDK 17
    uses: actions/setup-java@v3
    with:
      java-version: 17
      distribution: temurin
      
  - name: Setup Android SDK
    uses: amyu/setup-android@v2
    with:
      # default: false
      # Whether to use the cache     
      cache-disabled: true
      
      # default: '30'
      # sdk version
      # see https://developer.android.com/studio/releases/platforms
      # It will always be installed.
      sdk-version: '30'
      
      # default: '30.0.3'
      # build tools version
      # see https://developer.android.com/studio/releases/build-tools
      # It will always be installed.
      build-tools-version: '30.0.3'
      
      # default: ''
      # cmake version
      # see https://developer.android.com/studio/projects/install-ndk
      # Installed when the version is specified
      cmake-version: '3.10.2.4988404'

      # default: ''
      # cmake version
      # see https://developer.android.com/studio/projects/install-ndk
      # Installed when the version is specified
      ndk-version: '23.1.7779620'

      # default: true
      # Whether to generate or not the job summary     
      generate-job-summary: false

  - run: ./gradlew build --stacktrace
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!
