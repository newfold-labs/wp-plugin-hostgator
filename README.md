<a href="https://hostgator.com/" target="_blank">
    <img src="https://www.hostgator.com/static/cs/img/logos/nav-for-light.svg" alt="HostGator Logo" title="HostGator" align="right" height="32" />
</a>

[![Version Number](https://img.shields.io/github/v/release/newfold-labs/wp-plugin-hostgator?color=21a0ed&labelColor=333333)](https://github.com/newfold-labs/wp-plugin-hostgator/releases)
[![Lint PHP](https://github.com/newfold-labs/wp-plugin-hostgator/actions/workflows/lint-php.yml/badge.svg?branch=main)](https://github.com/newfold-labs/wp-plugin-hostgator/actions/workflows/lint-php.yml)
[![Lint YML](https://github.com/newfold-labs/wp-plugin-hostgator/actions/workflows/lint-yml.yml/badge.svg?branch=main)](https://github.com/newfold-labs/wp-plugin-hostgator/actions/workflows/lint-yml.yml)
[![WP Internationalization](https://github.com/newfold-labs/wp-plugin-hostgator/actions/workflows/wp-i18n.yml/badge.svg?branch=main)](https://github.com/newfold-labs/wp-plugin-hostgator/actions/workflows/wp-i18n.yml)
[![Cypress Tests](https://github.com/newfold-labs/wp-plugin-hostgator/actions/workflows/cypress-tests.yml/badge.svg?branch=main)](https://github.com/newfold-labs/wp-plugin-hostgator/actions/workflows/cypress-tests.yml)
[![Build Plugin](https://github.com/newfold-labs/wp-plugin-hostgator/actions/workflows/upload-artifact-on-push.yml/badge.svg?branch=main)](https://github.com/newfold-labs/wp-plugin-hostgator/actions/workflows/upload-artifact-on-push.yml)

# Hostgator WordPress Plugin

WordPress plugin that integrates a WordPress site with the HostGator control panel, including performance, security, and
update features.

# Installation

Find the `wp-plugin-hostgator.zip` asset for your preferred version at: https://github.com/newfold-labs/wp-plugin-hostgator/releases/.

Alternatively, check the updater endpoint for the latest version at: https://hiive.cloud/workers/release-api/plugins/newfold-labs/wp-plugin-hostgator, this also includes a download link to the latest zip file or use this link to access the latest download: https://hiive.cloud/workers/release-api/plugins/newfold-labs/wp-plugin-hostgator/download/.

# Releasing Updates

To prepare a release, run the `Newfold Prepare Release` workflow. Select the release level (patch, minor or major) and the target branch (where the release PR should target, nearly always `main`), and the source branch (typically `develop`, but could be another branch for hotfix releases). The workflow will create a release branch with updated versions, build files and language files and then create a PR for review.

This plugin has version number set in 3 distinct places in 2 files:

- the plugin header info (`wp-plugin-hostgator.php` line 14) - this is used in the plugin php code.
- the constant HOSTGATOR_PLUGIN_VERSION (`wp-plugin-hostgator.php` line 34) - this is used by WordPress.
- in the package.json version value (`package.json` line 5) this is used by the build step to place the release files within a matching version directory for convenient cache busting.

All 3 instances need to be incremented in conjuction with new releases via github tagging.

# Languages & Regions
There are some parts to the hostgator plugin that adapt depending on the region and/or language which is chosen. This not only relies on the language setting (which is set automatically on installs in HostGator Latam Brazil for example), but also on the `mm_brand` value being set to `hostgator-latam` and an additional option `hg_region` being set to `BR` in the case of Brazil. Features should all function in both US and BR setups. See the `region.cy.js` and `region-help.cy.js` cypress integration tests for example.

# Style Guide
For color pallet and typography usage: https://www.figma.com/file/0lEpSwlDnJt6nFNTgv4VqD/WP-Plugin-HostGator?t=LXnkBwfedfM4FvHX-1
