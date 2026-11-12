/**
 * Regional HostGator link map.
 *
 * The map lives in PHP (`inc/Brand.php::LINKS`) and is published to the JS
 * runtime via `Data::runtime()` so both sides share a single source of truth.
 *
 * Shape (per key): `{ default: string, AR: string, BO: string, BR: string,
 * CL, CO, DO, EC, MX, PE, UY }`. A value of the string `'false'` means the
 * surface should hide that link in that region (see supportsLinkPerRegion).
 */

const region = window?.NewfoldRuntime?.region ?? {};

export default region;
