import { PRODUCTS } from "../src/data/products-node.js";

/**
 * Link-preview HTML for chat apps and search crawlers.
 *
 * The site is a single-page app, so every URL serves the same index.html and
 * the page title/image are set by JavaScript after load. WhatsApp and the
 * other unfurlers do not run JavaScript, which is why a shared product link
 * previewed as a bare domain with no picture.
 *
 * Vercel routes only crawler user-agents here (see vercel.json), so real
 * visitors still get the app. This response is static HTML carrying the
 * product's own Open Graph tags, and it redirects a human who somehow lands
 * on it to the real page.
 */
const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default function handler(req, res) {
  const slug = String(req.query.slug || "").toLowerCase();
  const product = PRODUCTS.find((p) => p.slug === slug);

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const origin = `${proto}://${host}`;

  if (!product) {
    res.setHeader("Location", `${origin}/products`);
    res.status(302).end();
    return;
  }

  const url = `${origin}/products/${product.slug}`;
  // A flattened JPEG, not the site's transparent WebP: WhatsApp's support for
  // WebP previews is unreliable, and a cut-out with no background renders
  // unpredictably on the light card the preview draws.
  const image = `${origin}/og/${product.slug}.jpg`;

  const title = `${product.name} — ${product.summary} | Qubix & LORD`;
  const specs = product.specs
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
  const description = [product.tagline, specs].filter(Boolean).join(" — ");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">

<meta property="og:type" content="product">
<meta property="og:site_name" content="Qubix &amp; LORD">
<meta property="og:title" content="${esc(product.name)} — ${esc(product.summary)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:secure_url" content="${esc(image)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="900">
<meta property="og:image:alt" content="${esc(product.name)}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(product.name)} — ${esc(product.summary)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">

<link rel="canonical" href="${esc(url)}">
<meta http-equiv="refresh" content="0; url=${esc(url)}">
</head>
<body>
<h1>${esc(product.name)}</h1>
<p>${esc(product.summary)}</p>
<img src="${esc(image)}" alt="${esc(product.name)}" width="600">
<p><a href="${esc(url)}">View ${esc(product.name)} on lordqubix.in</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=600, s-maxage=86400");
  res.status(200).send(html);
}
