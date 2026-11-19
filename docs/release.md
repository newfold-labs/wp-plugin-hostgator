# Release process

## Prepare Release workflow (recommended)

The **Newfold Prepare Release** workflow automates version bumping, rebuilding plugin assets, and updating language files. Use it to prepare a release without running those steps locally.

- **Workflow:** **Newfold Prepare Release** (`.github/workflows/newfold-prepare-release.yml`)
- **Trigger:** Manual only – **Actions → Newfold Prepare Release → Run workflow**
- **Inputs:**
  - **level:** `patch` (default), `minor`, or `major` – version bump type
  - **source-branch:** Branch to prepare from (default `develop`)
  - **target-branch:** Branch the release will merge into (default `main`)

The workflow calls the shared **newfold-labs/workflows** reusable `reusable-plugin-prep-release.yml`, which will:

1. Bump the version in all three places (plugin header, `HOSTGATOR_PLUGIN_VERSION`, `package.json`)
2. Rebuild plugin assets (e.g. `npm run build`)
3. Update language files (i18n)

It typically opens a PR (e.g. from a release branch into the target branch) with these changes. After the workflow runs, review the PR, run tests, then follow the rest of the standard release flow (tagging, merge, verify) below.

See [workflows.md](workflows.md) for more workflow details.

## Standard release flow

1. **Branch:** Ensure `develop` is up to date. Create a release branch from it, e.g. `release/X.Y.Z` (or use the branch/PR created by the Prepare Release workflow).
2. **Version:** Either:
   - **Use the Prepare Release workflow** (recommended) – run it from the Actions tab with the desired level and branches; it will bump version, rebuild, and update i18n and open a PR, or
   - **Bump locally:** `npm run set-version-bump` (patch) or `npm run set-version-minor` (minor). This updates the plugin header, `HOSTGATOR_PLUGIN_VERSION`, and `package.json`, then rebuilds and runs i18n.
3. **Pre-release tag:** Tag the release branch, e.g. `X.Y.Z-rc.1`, and push. Use this for testing and QA.
4. **Testing:** Run the full test suite (e2e, unit, lint) and do manual checks on the release build.
5. **Merge:** Merge the release branch into `main` (and back-merge into `develop` as needed).
6. **Final tag:** Tag the release on `main`, e.g. `X.Y.Z`, and push. Do not mark this tag as pre-release.
7. **Verify:** Confirm that your build/release pipeline (e.g. Satis, release API) picks up the new version and that the update endpoint serves it correctly.

## Pre-release versioning

- **Alpha:** `X.Y.Z-alpha.N` – early builds; features and fixes can still land.
- **Beta:** `X.Y.Z-beta.N` – feature freeze; bug fixes only.
- **RC:** `X.Y.Z-rc.N` – release candidates for final validation.

Tag and push these as needed for internal or beta testers; the final GA release uses the `X.Y.Z` tag without a suffix.

## After release

- The custom update endpoint (Hiive release API) should list the new version so existing sites see the update in the Plugins screen.
- If your process uses a packaged zip (e.g. from `npm run create:dist` plus `npm run create:zip`, or CI), ensure the zip is built from the same commit as the tag and uploaded to the place the release API expects.

## Version bump reminder

Never edit the version in only one or two places. To keep all three in sync, either:

- **Use the Prepare Release workflow** (recommended for releases) – it bumps version, rebuilds, and updates i18n in one go, or
- **Run locally:** `npm run set-version-bump` (patch) or `npm run set-version-minor` (minor).

The three locations that must stay in sync are:

1. Plugin header in `wp-plugin-hostgator.php`
2. `HOSTGATOR_PLUGIN_VERSION` in `wp-plugin-hostgator.php`
3. `version` in `package.json`

See [development.md](development.md) for daily version and build commands.
