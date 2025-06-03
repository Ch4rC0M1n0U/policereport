/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Très important pour ce Dockerfile
  // experimental: { // Removed serverComponentsExternalPackages for @neondatabase/serverless
  //   serverComponentsExternalPackages: ["@neondatabase/serverless"],
  // },
  images: {
    domains: ["images.unsplash.com", "api.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.unsplash.com",
      },
    ],
    unoptimized: true, // Peut être utile dans les déploiements Docker
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    // These are primarily for client-side access if needed,
    // server-side should use process.env directly.
    // For Docker, these will be injected into the container.
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // DB connection details are typically not exposed to client-side env
    // They are used server-side by lib/db.ts
  },
}

module.exports = nextConfig
