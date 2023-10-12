name: 'setup android sdk for self hosted runner'
description: 'setup-android for self hosted runner'
author: 'amyu'
inputs:
  sdk-version:
    required: false
    description: 'sdk version'
    default: '33'
  build-tools-version:
    required: false
    description: 'build tools version'
    default: '33.0.2'
  ndk-version:
    required: false
    description: 'ndk version'
  cmake-version:
    required: false
    description: 'cmake version'
  cache-disabled:
    required: false
    description: 'disabled cache'
    default: 'false'
  cache-key:
    required: false
    description: 'cache key'
    default: ''
  generate-job-summary:
    required: false
    description: 'display job summary'
    default: 'true'
  job-status:
    description: 'Workaround to pass job status to post job step. This variable is not intended for manual setting'
    default: ${{ job.status }}
runs:
  using: 'node20'
  main: 'dist/setup/index.js'
  post: 'dist/cleanup/index.js'
