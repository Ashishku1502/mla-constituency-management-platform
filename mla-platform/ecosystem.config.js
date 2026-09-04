// PM2 Ecosystem Config — Hostinger VPS ke liye
// Use: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "mla-platform",          // App ka naam PM2 dashboard mein
      script: "server.js",           // Next.js standalone server
      cwd: "/var/www/mla-platform",  // VPS pe deploy path
      instances: 1,                  // 1 instance (KVM 1 plan ke liye theek hai)
      autorestart: true,             // Crash hone pe auto-restart
      watch: false,
      max_memory_restart: "400M",    // 400MB se zyada memory pe restart
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
    },
  ],
};
