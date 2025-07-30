import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images :{
  remotePatterns:[
    {
      protocol:"https",
      hostname:"rescuedb.s3.eu-north-1.amazonaws.com",
      pathname:"/**"
    },
    {
      protocol:"https",
      hostname:"rescue.sfo3.digitaloceanspaces.com",
      pathname:"/**"
    },
    {
      protocol:"https",
      hostname:"example.com",
      pathname:"/**"
    }
  ]
 }
};

export default nextConfig;
