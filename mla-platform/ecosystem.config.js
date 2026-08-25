// PM2 Ecosystem Config — Hostinger VPS ke liye
// Use: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "mla-platform",          // App ka naam PM2 dashboard mein
      script: "node",
      args: ".next/standalone/server.js",
      cwd: "/var/www/mla-platform",  // VPS pe jo path hoga usse change karo
      instances: 1,                   // 1 instance (VPS resources ke hisaab se badha sakte ho)
      autorestart: true,              // Crash hone pe auto-restart
      watch: false,
      max_memory_restart: "500M",    // 500MB se zyada memory use ho to restart
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
