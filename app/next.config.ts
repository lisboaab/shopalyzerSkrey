import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";
require("dotenv").config();

const nextConfig: NextConfig = {
  // some config here
};

export default withFlowbiteReact(nextConfig);
