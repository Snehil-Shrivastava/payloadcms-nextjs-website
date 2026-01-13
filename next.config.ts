import type { NextConfig } from "next";
import withPlaiceholder from "@plaiceholder/next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,

  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/**/*",
      },
    ],
  },
};

export default withPlaiceholder(withPayload(nextConfig));
