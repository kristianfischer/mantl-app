/**
 * PSA slab photos — URL patterns vary; we try several common CDN paths.
 * Override with NEXT_PUBLIC_PSA_CERT_IMAGE_URL_TEMPLATE (single URL, "{cert}" placeholder).
 *
 * Not every cert has a hosted image (older slabs, no imaging service).
 */

function applyTemplate(template: string, cert: string): string {
  return template.split("{cert}").join(cert.trim());
}

/** Ordered list — first loadable URL wins in the UI. */
export function getPsaCertImageCandidates(cert: string): string[] {
  const c = cert.trim();
  const custom = process.env.NEXT_PUBLIC_PSA_CERT_IMAGE_URL_TEMPLATE?.trim();
  if (custom) {
    return [applyTemplate(custom, c)];
  }
  // Raw cert in path (no encoding) — PSA certs are typically numeric.
  // Multiple patterns seen in the wild; try in order.
  return [
    `https://images.psacard.com/s3/cu-psa/cert/${c}/large.jpg`,
    `https://images.psacard.com/s3/slab-images/large/${c}.jpg`,
    `https://images.psacard.com/s3/slab-images/medium/${c}.jpg`,
  ];
}
