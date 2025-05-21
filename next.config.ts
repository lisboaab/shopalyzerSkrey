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
  async headers() {
    return [
      {
        source: "/api/shopify-proxy/:path*",
        headers: [
          { 
            key: "Access-Control-Allow-Origin", 
            value: "http://localhost:3000" 
          },
          { 
            key: "Access-Control-Allow-Methods", 
            value: "POST" 
          },
          { 
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, X-Shopify-Access-Token"
          }
        ]
      }
    ];
  }
};

export default withFlowbiteReact(nextConfig);
