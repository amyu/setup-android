# Self-hosted Renovate

The Renovate workflow runs every three hours on GitHub-hosted runners. It only
runs on `main` in `amyu/setup-android` when `RENOVATE_ENABLED` is `true`.

For npm updates, post-upgrade tasks install the updated dependencies and run
`pnpm run package`. Node and pnpm are installed by Renovate using the package
constraints. Only generated files under `dist/` are added to the dependency
update commit. The existing CI checks still validate the resulting PR.

## Initial setup and migration

1. Create a dedicated GitHub App and install it only on `amyu/setup-android`.
   Disable webhooks. Follow the repository permissions in the
   [Renovate GitHub App documentation](https://docs.renovatebot.com/modules/platform/github/#running-as-a-github-app),
   including Workflows write access so Renovate can update GitHub Actions.
2. Set repository variable `RENOVATE_APP_ID` to the App ID and repository secret
   `RENOVATE_APP_PRIVATE_KEY` to its generated PEM private key.
3. Merge this configuration while `RENOVATE_ENABLED` is unset.
4. Remove this repository from the Mend Renovate App installation before enabling
   the new workflow. Other repositories can continue using Mend.
5. Set repository variable `RENOVATE_ENABLED` to `true` and manually run the
   Renovate workflow with `dry-run` checked. Inspect the logs for authentication,
   configuration, and dependency lookup errors. Dry runs do not prove that
   post-upgrade builds succeed.
6. Run again with `dry-run` unchecked. Confirm an npm update PR contains the
   expected `dist/` changes and passes Check Transpiled JavaScript and other CI.

The existing `renovate/` branch prefix is retained. Inspect existing Mend PRs
during migration; if the new App cannot reuse one, close the old PR and remove
its obsolete branch before retrying. Never run both bots against this repository
at the same time.

To pause updates, set `RENOVATE_ENABLED` to `false`. To roll back to Mend, pause
this workflow first and remove the `postUpgradeTasks` rule before re-enabling
Mend, since its hosted service does not allow these build commands.

## Configuration

- `renovate.json5`: dependency rules and generated-file tasks.
- `.github/renovate-config.json`: administrator configuration and exact command
  allowlist, limited to this repository.
- `.github/workflows/renovate.yml`: schedule, App authentication, and pinned
  Renovate runtime. Keep the runtime version updated alongside its action.

Use the GitHub App installation token rather than `GITHUB_TOKEN` so CI on
Renovate PRs can run without the approval required for `GITHUB_TOKEN`-created PRs.
