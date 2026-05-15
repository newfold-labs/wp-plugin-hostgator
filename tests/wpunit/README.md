# WPUnit suite (Codeception)

Bootstrap: `_bootstrap.php` defines plugin constants and the module-loader container stub used by some `inc/` files.

## Intentional non-parity with Bluehost

These Bluehost WPUnit files have **no HostGator counterpart** under `inc/` (do not port unless product adds the features):

| Bluehost test | Reason |
|---------------|--------|
| `GoogleSiteKitWpunitTest.php` | No `GoogleSiteKit.php` in HostGator |
| `YoastAIWpunitTest.php` | No Yoast AI bootstrap in HostGator |
| `SimpleUiWpunitTest.php` | No `inc/simple-ui/` in HostGator |

Other suites are ported/adapted under `HostGator\` with `HOSTGATOR_*` constants and `hostgator` admin routes where applicable.
