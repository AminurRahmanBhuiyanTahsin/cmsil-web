import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DATABASE_URL: "mysql://root:@localhost:3306/cmsil_db",
  },
};

export default nextConfig;