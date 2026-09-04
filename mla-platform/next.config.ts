const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  // Hostinger VPS pe deploy karne ke liye standalone build
  output: "standalone",
};

export default nextConfig;
