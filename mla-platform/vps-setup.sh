#!/bin/bash
# ============================================================
# MLA Platform — Hostinger VPS First-Time Setup Script
# Run this ONCE after getting VPS SSH access
# Usage: bash vps-setup.sh
# ============================================================

set -e  # Error pe ruk jao

echo "================================================"
echo "  🚀 MLA Platform — VPS Setup Starting..."
echo "================================================"

# ── Step 1: System Update ──────────────────────────────────
echo ""
echo "📦 Step 1: System update kar rahe hain..."
sudo apt update && sudo apt upgrade -y

# ── Step 2: Node.js 20 Install ────────────────────────────
echo ""
echo "🟢 Step 2: Node.js 20 install kar rahe hain..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version

# ── Step 3: PM2 Install ───────────────────────────────────
echo ""
echo "⚙️  Step 3: PM2 process manager install kar rahe hain..."
sudo npm install -g pm2

# ── Step 4: Nginx Install ─────────────────────────────────
echo ""
echo "🌐 Step 4: Nginx web server install kar rahe hain..."
sudo apt install -y nginx

# ── Step 5: Certbot (SSL) Install ────────────────────────
echo ""
echo "🔒 Step 5: Certbot (SSL) install kar rahe hain..."
sudo apt install -y certbot python3-certbot-nginx

# ── Step 5b: rsync Install (GitHub Actions deploy ke liye) ──
echo ""
echo "🔄 Step 5b: rsync install kar rahe hain (deploy ke liye zaroori)..."
sudo apt install -y rsync


# ── Step 6: App Folder Create ────────────────────────────
echo ""
echo "📁 Step 6: App folder bana rahe hain..."
sudo mkdir -p /var/www/mla-platform
sudo mkdir -p /var/www/mla-platform/logs
sudo chown -R $USER:$USER /var/www/mla-platform

# ── Step 7: .env.production Create ───────────────────────
echo ""
echo "🔑 Step 7: Environment file bana rahe hain..."
cat > /var/www/mla-platform/.env.production << 'ENV_FILE'
# =============================================
# PRODUCTION ENVIRONMENT — VPS pe configure karo
# =============================================

# PostgreSQL Database URL (Neon ya VPS local)
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/YOUR_DB?sslmode=require"

# Auth Secret (naya generate karo: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
AUTH_SECRET="GENERATE_A_NEW_STRONG_SECRET"

# Tumhara domain
NEXTAUTH_URL="https://pmpconsultancy.com"
NEXT_PUBLIC_APP_URL="https://pmpconsultancy.com"

NODE_ENV="production"
ENV_FILE

echo "⚠️  IMPORTANT: /var/www/mla-platform/.env.production file edit karo!"
echo "   Command: nano /var/www/mla-platform/.env.production"

# ── Step 8: Nginx Config ──────────────────────────────────
echo ""
echo "🌐 Step 8: Nginx config set kar rahe hain..."
sudo tee /etc/nginx/sites-available/mla-platform > /dev/null << 'NGINX_CONF'
server {
    listen 80;
    server_name pmpconsultancy.com www.pmpconsultancy.com;

    # Logs
    access_log /var/log/nginx/mla-platform.access.log;
    error_log /var/log/nginx/mla-platform.error.log;

    # Max upload size
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Static files directly serve karo (faster)
    location /_next/static/ {
        alias /var/www/mla-platform/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /public/ {
        alias /var/www/mla-platform/public/;
        expires 7d;
    }
}
NGINX_CONF

# Nginx enable karo
sudo ln -sf /etc/nginx/sites-available/mla-platform /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
sudo systemctl enable nginx

# ── Step 9: PM2 Startup ───────────────────────────────────
echo ""
echo "⚙️  Step 9: PM2 startup configure kar rahe hain..."
pm2 startup | tail -1 | bash || true
pm2 save

echo ""
echo "================================================"
echo "  ✅ VPS Setup Complete!"
echo "================================================"
echo ""
echo "Ab ye karo:"
echo "1. 📝 .env.production file edit karo:"
echo "   nano /var/www/mla-platform/.env.production"
echo ""
echo "2. 🔑 DATABASE_URL, AUTH_SECRET, domain fill karo"
echo ""
echo "3. 🔒 SSL certificate lagao (domain DNS set hone ke baad):"
echo "   sudo certbot --nginx -d pmpconsultancy.com -d www.pmpconsultancy.com"
echo ""
echo "4. 🚀 GitHub Actions se auto-deploy shuru ho jayega!"
