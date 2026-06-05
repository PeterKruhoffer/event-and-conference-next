/** @type {import('next').NextConfig} */
const drupalBaseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
const drupalBaseUrlWithoutTrailingSlash = drupalBaseUrl?.replace(/\/$/, "")
const imageDomain = process.env.NEXT_IMAGE_DOMAIN
  ? new URL(`https://${process.env.NEXT_IMAGE_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "")}`).hostname
  : undefined

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: imageDomain
      ? [
          {
            protocol: "https",
            hostname: imageDomain,
            pathname: "/sites/default/files/**",
          },
        ]
      : [],
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
