/** @type {import('next').NextConfig} */
const drupalBaseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
const drupalBaseUrlWithoutTrailingSlash = drupalBaseUrl?.replace(/\/$/, "")

function getHostname(value) {
  if (!value) {
    return undefined
  }

  return new URL(value.startsWith("http") ? value : `https://${value}`).hostname
}

const imageDomains = [
  getHostname(process.env.NEXT_IMAGE_DOMAIN?.replace(/\/$/, "")),
  getHostname(drupalBaseUrlWithoutTrailingSlash),
].filter(Boolean)

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: Array.from(new Set(imageDomains)).map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
  async rewrites() {
    if (!drupalBaseUrlWithoutTrailingSlash) {
      return []
    }

    return [
      {
        source: "/sites/default/files/:path*",
        destination: `${drupalBaseUrlWithoutTrailingSlash}/sites/default/files/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
