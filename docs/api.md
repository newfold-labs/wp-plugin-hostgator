# REST API

The plugin exposes a REST API for the admin app and other consumers. All routes use the **`hostgator/v1`** namespace. Controllers are registered in **`inc/RestApi/rest-api.php`** on the `rest_api_init` action; each controller’s `register_routes()` is called there.

For backend entry points and PHP structure, see [backend.md](backend.md).

---

## Endpoints

| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET, POST/PUT | `/hostgator/v1/settings` | `HostGator\RestApi\SettingsController` | Read or update plugin-managed settings (Coming Soon, auto-updates, comments, revisions, homepage, etc.). |

Full URL example: `{site}/wp-json/hostgator/v1/settings`. The React app calls this via `NewfoldRuntime.createApiUrl('/hostgator/v1/settings')`.

---

## Settings endpoint (`/hostgator/v1/settings`)

- **GET** – Returns the current settings object. Used by the app on load to hydrate the store.
- **POST / PUT** – Accepts a JSON body with one or more setting keys; updates only those keys and returns the full settings object.

**Permission:** `manage_options` (user must be able to manage options).

**Response:** JSON object whose keys match the settings below. All are read and writable unless noted.

| Key | Type | Description |
|-----|------|-------------|
| `comingSoon` | boolean | Whether the Coming Soon page is enabled (module). |
| `autoUpdatesAll` | boolean | Derived: true when major core, plugins, themes are all auto-update. |
| `autoUpdatesMajorCore` | boolean | Major WordPress core auto-updates. |
| `autoUpdatesMinorCore` | boolean | Minor WordPress core auto-updates. |
| `autoUpdatesPlugins` | boolean | Plugin auto-updates. |
| `autoUpdatesThemes` | boolean | Theme auto-updates. |
| `autoUpdatesTranslations` | boolean | Translation auto-updates. |
| `disableCommentsOldPosts` | boolean | Close comments on old posts. |
| `closeCommentsDays` | integer | Days after which to close comments. |
| `commentsPerPage` | integer | Comments per page. |
| `contentRevisions` | integer | Number of post revisions to keep. |
| `emptyTrashDays` | integer | Days before permanently deleting trashed items. |
| `hasSetHomepage` | boolean | Whether a static homepage has been set. |
| `showOnFront` | string | `'page'` or `'posts'`. |
| `pageOnFront` | integer | Page ID used as front page when `showOnFront` is `page`. |

Constants `WP_AUTO_UPDATE_CORE` and `AUTOMATIC_UPDATER_DISABLED` can override core/plugin/theme/translation auto-update values; see `SettingsController::get_current_settings()`.

---

## Adding endpoints

1. Create a new controller class in `inc/RestApi/` extending `\WP_REST_Controller`, with `$namespace = 'hostgator/v1'` and a `register_routes()` method.
2. Add the controller class to the `$controllers` array in **`inc/RestApi/rest-api.php`**.
3. Document the new route in the **Endpoints** table above and add any request/response details so endpoints stay easy to find.
