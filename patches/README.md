# `@actions/cache`

The action uses the cache key and archive size in its job summary. The patch
returns that metadata from both cache service versions and lets the action
handle cache errors. It was adapted from the
[Gradle Actions cache patch](https://github.com/gradle/actions/blob/68b69be9d403985d743325121bd48504e2b708db/sources/patches/%40actions%2Bcache%2B3.2.4.patch).

`pnpm-workspace.yaml` applies `actions-cache.patch` by package name, so the
same patch is tried on each update. Self-hosted Renovate installs the updated
lockfile and rebuilds `dist/` before committing. If an upstream change prevents
the patch from applying, rebase the patch on the new package, run `pnpm install`
to refresh the lockfile, then run `pnpm run all` to verify and rebuild the action.
