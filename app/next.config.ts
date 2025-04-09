import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";
require('dotenv').config();

const nextConfig: NextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

export default withFlowbiteReact(nextConfig);