# 🚀 Hostinger VPS Pe Deploy Karne Ki Complete Guide
## Domain: pmpconsultancy.com | App: MLA Constituency Management Platform

---

## 📋 Overview — Kya Hoga

```
GitHub Push → GitHub Actions → VPS Build → Auto Deploy ✅
```

Har baar jab aap GitHub pe code push karoge, app automatically deploy ho jayega!

---

## PART 1: Hostinger VPS Kharido

### 👉 Step 1: VPS Plan Lo

1. **Jao:** [hostinger.com/vps-hosting](https://www.hostinger.com/vps-hosting)
2. **Plan:** KVM 1 ya KVM 2 lo (₹349-699/month)
3. **OS:** **Ubuntu 22.04 LTS** choose karo ✅
4. **Data Center:** Singapore ya India choose karo (fast hoga)
5. Purchase complete karo

### 👉 Step 2: VPS Activate Hone Ka Wait Karo

- 5-10 minute mein email aayega
- Email mein milega:
  - **VPS IP Address** (e.g., `194.x.x.x`)
  - **Root Password**
  - **SSH Port** (usually 22)

---

## PART 2: Free PostgreSQL Database Setup (Neon.tech)

> VPS ke saath local database bhi chal sakta hai, par **Neon.tech FREE** hai aur zyada safe hai.

### 👉 Step 1: Neon Account Banao

1. Jao: [neon.tech](https://neon.tech) → **Sign Up Free**
2. **New Project** → Name: `mla-platform`
3. **Region:** Asia Pacific (Singapore) select karo
4. Create Project

### 👉 Step 2: Connection String Copy Karo

Dashboard mein:
- **Connection Details** section mein jao
- **"Connection string"** copy karo, kuch aisa dikhega:

```
postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

> ⚠️ Ye string safe jagah save karo — baad mein chahiye hogi

---

## PART 3: GitHub Secrets Setup Karo

GitHub Actions ko VPS pe deploy karne ke liye secrets chahiye.

### 👉 Step 1: GitHub Repo Pe Jao

1. Jao: [github.com/Ashishku1502/mla-constituency-management-platform](https://github.com/Ashishku1502/mla-constituency-management-platform)
2. **Settings** tab → Left sidebar mein **Secrets and variables** → **Actions**
3. **"New repository secret"** button click karo

### 👉 Step 2: Ye 5 Secrets Add Karo (ek-ek karke)

| Secret Name | Value |
|-------------|-------|
| `VPS_HOST` | Aapka VPS IP address (e.g., `194.23.45.67`) |
| `VPS_USER` | `root` (ya jo username mile) |
| `VPS_PASSWORD` | VPS ka root password |
| `DATABASE_URL` | Neon ka connection string |
| `AUTH_SECRET` | Naya random string (neeche se generate karo) |
| `NEXTAUTH_URL` | `https://pmpconsultancy.com` |

### AUTH_SECRET Generate Karne Ka Command:
Apne PC pe PowerShell mein run karo:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## PART 4: VPS First-Time Setup

VPS milne ke baad **sirf ek baar** ye karna hai.

### 👉 Step 1: SSH Se VPS Pe Connect Karo

Windows pe PowerShell open karo:
```powershell
ssh root@YOUR_VPS_IP
# Example:
ssh root@194.23.45.67
```

Password type karo (jo email mein aaya tha).

### 👉 Step 2: Setup Script Run Karo

VPS pe connected hone ke baad:
```bash
# Setup script download karo
curl -o vps-setup.sh https://raw.githubusercontent.com/Ashishku1502/mla-constituency-management-platform/main/mla-platform/vps-setup.sh

# Run karo
bash vps-setup.sh
```

Ye script automatically install karega:
- ✅ Node.js 20
- ✅ PM2 (process manager)
- ✅ Nginx (web server)
- ✅ Certbot (SSL/HTTPS)
- ✅ App folder `/var/www/mla-platform`
- ✅ Nginx config for `pmpconsultancy.com`

### 👉 Step 3: .env.production File Edit Karo

```bash
nano /var/www/mla-platform/.env.production
```

Ye values fill karo:
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="tumhara_generated_secret_yahan"
NEXTAUTH_URL="https://pmpconsultancy.com"
NEXT_PUBLIC_APP_URL="https://pmpconsultancy.com"
NODE_ENV="production"
```

Save karo: `Ctrl+X` → `Y` → `Enter`

---

## PART 5: Domain DNS Setup (Hostinger mein)

### 👉 Step 1: hPanel Pe Jao

1. Login: [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. **pmpconsultancy.com** domain pe click karo
3. **DNS Zone** ya **DNS Records** section mein jao

### 👉 Step 2: A Record Set Karo

Old A records delete karo (agar Vercel wale hain), phir ye add karo:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `YOUR_VPS_IP` | 300 |
| A | `www` | `YOUR_VPS_IP` | 300 |

> ⚠️ DNS propagation mein 5-30 minute lag sakte hain

### 👉 Step 3: DNS Check Karo

```bash
# PC pe run karo (kuch der baad):
nslookup pmpconsultancy.com
# VPS IP dikhna chahiye
```

---

## PART 6: SSL Certificate (HTTPS — Free)

DNS set hone ke baad VPS pe ye run karo:

```bash
sudo certbot --nginx -d pmpconsultancy.com -d www.pmpconsultancy.com
```

- Email daalo
- Terms accept karo (Y)
- Redirect option: **2** (HTTPS pe redirect) choose karo

Done! ✅ `https://pmpconsultancy.com` pe app chal raha hoga!

---

## PART 7: First Deploy — GitHub Se

### 👉 Step 1: Local Code Push Karo

Apne PC pe project folder mein:
```powershell
cd "i:\Project\MLA Constituency Management Platform"
git add .
git commit -m "feat: Hostinger VPS deployment setup"
git push origin main
```

### 👉 Step 2: GitHub Actions Dekho

1. Jao: [github.com/Ashishku1502/mla-constituency-management-platform/actions](https://github.com/Ashishku1502/mla-constituency-management-platform/actions)
2. "Deploy to Hostinger VPS" workflow run hote dekhoge
3. 5-10 minute mein complete ho jayega

### 👉 Step 3: App Live Check Karo

Browser mein open karo: `https://pmpconsultancy.com` 🎉

---

## PART 8: Database Seed Karo (Pehli Baar)

First deploy ke baad VPS pe:
```bash
cd /var/www/mla-platform
export $(grep -v '^#' .env.production | xargs)
npx prisma db push
node prisma/seed.js  # Agar seed file hai
```

---

## ✅ Ab Har Baar Auto-Deploy

```
Aap code change karo → git push karo → App automatically update!
```

---

## 🔧 Useful VPS Commands

```bash
# App status
pm2 status

# App logs dekho
pm2 logs mla-platform

# App restart karo
pm2 restart mla-platform

# Nginx restart
sudo systemctl restart nginx

# SSL renew (auto hota hai, manual bhi kar sakte ho)
sudo certbot renew
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| App nahi khul raha | `pm2 logs mla-platform` se error dekho |
| Database error | `DATABASE_URL` check karo `.env.production` mein |
| Domain nahi khul raha | DNS A record check karo (wait 30 min) |
| SSL error | `sudo nginx -t` run karo, phir `sudo certbot --nginx` |
| GitHub Actions fail | Repository Secrets check karo |
| 502 Bad Gateway | `pm2 status` check karo, app running hai? |

---

## ❌ Vercel Se Hatana (Optional)

Agar pehle Vercel pe tha:
1. [vercel.com](https://vercel.com) → Project select karo
2. **Settings** → **Advanced** → **Delete Project**
3. Done!
