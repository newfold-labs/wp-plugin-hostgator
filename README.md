<a href="https://hostgator.com/" target="_blank">
    <img src="https://www.hostgator.com/static/cs/img/logos/nav-for-light.svg" alt="HostGator Logo" title="HostGator" align="right" height="32" />
</a>

# hostgator-wordpress-plugin
WordPress plugin that integrates a WordPress site with the HostGator control panel, including performance, security, and update features.

$ Installation
Find the `hostgator-wordpress-plugin.zip` asset for your version at: https://github.com/bluehost/hostgator-wordpress-plugin/releases
Alternatively, check the updater endpoint for the latest version at: https://hiive.cloud/workers/release-api/plugins/bluehost/hostgator-wordpress-plugin, this also includes a download link to the latest zip file.

# Releasing Updates
This plugin has version number set in 3 distinct places in 2 files:
- the plugin header info (hostgator-wordpress-plugin/hostgator-wordpress-plugin.php line 14) - this is used in the plugin php code.
- the constant HOSTGATOR_PLUGIN_VERSION (hostgator-wordpress-plugin/hostgator-wordpress-plugin.php line 34) - this is used by WordPress.
- in the package.json version value (hostgator-wordpress-plugin/package.json line 5) this is used by the build step to place the release files within a matching version directory for convenient cache busting.
All 3 instances need to be incremented in conjuction with new releases via github tagging.
(In a perfect world, we have a runner increment and/or validate this)