import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";
require("dotenv").config();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/ditdnslga/**",
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);
