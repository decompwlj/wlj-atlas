// Preserve links to the original single-page graph viewer.
if (/^#[a-z0-9-]+$/.test(location.hash)) {
  location.replace(new URL('explore.html' + location.hash, location.href));
}
