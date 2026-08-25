# 🚀 Hostinger VPS Pe Deploy Karne Ki Guide

## Prerequisites (Pehle Ye Karo)

- ✅ Hostinger VPS plan active ho
- ✅ VPS pe SSH access mile (IP, username, password)
- ✅ PostgreSQL database ready ho (Hostinger ka ya Neon.tech ka)

---

## Part 1: Database Setup Karo

### Option A: Neon (Recommended — Free PostgreSQL)
1. [neon.tech](https://neon.tech) pe free account banao
2. Naya project banao → "MLA Platform" naam dो
3. Dashboard se **Connection String** copy karo:
   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Option B: Hostinger ka PostgreSQL (VPS mein)
```bash
# VPS pe SSH karke:
sudo apt update && sudo apt install postgresql -y
sudo -u postgres psql
CREATE USER mla_user WITH PASSWORD 'strongpassword';
CREATE DATABASE mla_db OWNER mla_user;
\q
# Connection string:
# postgresql://mla_user:strongpassword@localhost:5432/mla_db
```

---

## Part 2: Local Build Banao

Apne PC pe ye commands run karo:

```bash
# Project folder mein jao
cd "i:\Project\MLA Constituency Management Platform\mla-platform"

# .env.production file banao (example se copy karke real values daalo)
copy .env.production.example .env.production
# Ab .env.production file open karo aur DATABASE_URL daalo

# Dependencies install karo
npm install

# Database migrate karo (production DB pe tables banao)
npx prisma db push

# Production build banao
npm run build
```

Build successful hone ke baad `.next/standalone` folder banega.

---

## Part 3: VPS Pe Files Upload Karo

### SSH Se Connect Karo
```bash
ssh root@YOUR_VPS_IP
# ya
ssh ubuntu@YOUR_VPS_IP
```

### VPS pe Node.js & PM2 Install Karo (pehli baar)
```bash
# Node.js install
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 install
sudo npm install -g pm2
```

### Project Folder Banao
```bash
sudo mkdir -p /var/www/mla-platform
sudo chown -R $USER:$USER /var/www/mla-platform
```

### Files Upload Karo (PC se VPS pe)
Apne PC pe PowerShell mein:
```powershell
# Build folder upload karo
scp -r ".next/standalone" root@YOUR_VPS_IP:/var/www/mla-platform/
scp -r ".next/static" root@YOUR_VPS_IP:/var/www/mla-platform/.next/
scp -r "public" root@YOUR_VPS_IP:/var/www/mla-platform/
scp "ecosystem.config.js" root@YOUR_VPS_IP:/var/www/mla-platform/
```

---

## Part 4: VPS Pe .env Setup Karo
```bash
# VPS pe
cd /var/www/mla-platform
nano .env.production

# Ye content daalo:
# DATABASE_URL="postgresql://..."
# AUTH_SECRET="..."
# NEXTAUTH_URL="https://yourdomain.com"
# NODE_ENV="production"
```

---

## Part 5: App Start Karo
```bash
cd /var/www/mla-platform

# Logs folder banao
mkdir -p logs

# PM2 se start karo
pm2 start ecosystem.config.js

# Status check karo
pm2 status

# Live logs dekho
pm2 logs mla-platform

# System restart pe auto-start ke liye
pm2 startup
pm2 save
```

App ab **port 3000** pe chal raha hoga! 🎉

---

## Part 6: Domain Connect Karo (Nginx Reverse Proxy)

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/mla-platform
```

Ye config daalo:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable karo
sudo ln -s /etc/nginx/sites-available/mla-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Certificate (HTTPS) — Free
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Useful PM2 Commands

```bash
pm2 status              # App ka status
pm2 restart mla-platform  # Restart karo
pm2 stop mla-platform     # Stop karo
pm2 logs mla-platform     # Live logs
pm2 monit               # CPU/Memory monitor
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| App start nahi ho raha | `pm2 logs mla-platform` se error dekho |
| Database connection fail | `DATABASE_URL` check karo `.env.production` mein |
| Port 3000 already in use | `lsof -i :3000` se process dekho, kill karo |
| Domain nahi khul raha | Hostinger DNS mein A record VPS IP pe set karo |

---

## Vercel Se Completely Hatana

Vercel dashboard pe:
1. Login karo → Project select karo
2. Settings → Advanced → Delete Project
3. Done! ✅
