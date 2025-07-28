import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images :{
  remotePatterns:[
    {
      protocol:"https",
      hostname:"rescuedb.s3.eu-north-1.amazonaws.com",
      pathname:"/**"
    }
  ]
 }
};

export default nextConfig;
