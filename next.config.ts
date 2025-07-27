import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cjioglivvvnkomrmbgws.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      // Jika ada hostname Supabase lain atau CDN lain, tambahkan juga
      {
        protocol: "https",
        hostname: "*.supabase.co", // Wildcard untuk semua subdomain supabase
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
