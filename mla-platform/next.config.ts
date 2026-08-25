const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Hostinger VPS pe deploy karne ke liye standalone build
  output: "standalone",
};

export default nextConfig;
