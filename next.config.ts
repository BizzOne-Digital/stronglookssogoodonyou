import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const canonical = (
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.stronglooksgoodonyou.ca"
    ).replace(/\/$/, "");

    return [
      { source: "/favicon.ico", destination: "/favicon.jpg", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "stronglookssogoodonyou.vercel.app" }],
        destination: `${canonical}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "stronglooksgoodonyou.ca" }],
        destination: `${canonical}/:path*`,
        permanent: true,
      },
    ];
  },
  serverExternalPackages: ["mongoose", "mongodb", "bcryptjs"],
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75, 90, 95],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    localPatterns: [
      { pathname: "/api/uploads/**" },
      { pathname: "/images/**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
