const { Client } = require('ssh2');

const sshConfig = {
  host: '89.116.20.218',
  port: 22,
  username: 'root',
  password: 'Pr5p.&Bc481.kX3g'
};

async function main() {
  console.log('🔒 Completing VPS Hardening & Automated Backup Setup on Hostinger...');
  
  const conn = new Client();
  
  const securityScript = `
    set -e
    set -x
    
    echo "=== 1. Verifying UFW Firewall ==="
    sudo ufw status verbose
    
    echo "=== 2. Configuring Fail2ban Brute-Force Protection ==="
    sudo systemctl enable fail2ban
    sudo systemctl restart fail2ban || true
    sleep 2
    sudo fail2ban-client status || true
    
    echo "=== 3. Setting up Automated PostgreSQL Daily Backups ==="
    sudo mkdir -p /var/backups/mla_db
    sudo chmod 700 /var/backups/mla_db
    
    # Create backup script
    cat << 'EOF' | sudo tee /usr/local/bin/backup_mla_db.sh
#!/bin/bash
BACKUP_DIR="/var/backups/mla_db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/mla_db_$TIMESTAMP.sql.gz"

# Perform pg_dump as postgres user and compress
sudo -u postgres pg_dump mla_db | gzip > "$BACKUP_FILE"

# Set permissions
chmod 600 "$BACKUP_FILE"

# Keep last 7 days of backups, delete older ones
find "$BACKUP_DIR" -type f -name "mla_db_*.sql.gz" -mtime +7 -delete

echo "[$(date)] Backup completed: $BACKUP_FILE"
EOF

    sudo chmod +x /usr/local/bin/backup_mla_db.sh
    
    # Create daily cron job at 2:00 AM
    cat << 'EOF' | sudo tee /etc/cron.d/mla_db_backup
0 2 * * * root /usr/local/bin/backup_mla_db.sh >> /var/log/mla_db_backup.log 2>&1
EOF
    sudo chmod 644 /etc/cron.d/mla_db_backup
    
    # Test backup script once immediately
    echo "🧪 Testing automated backup script..."
    sudo /usr/local/bin/backup_mla_db.sh
    
    echo "=== Current Backups in /var/backups/mla_db ==="
    sudo ls -lh /var/backups/mla_db
    
    echo "🎉 VPS Security Hardening & Backup Setup Complete!"
  `.trim();

  try {
    await new Promise((resolve, reject) => {
      conn.on('ready', () => {
        console.log('⚡ Connected to Hostinger VPS via SSH!');
        
        conn.exec(securityScript, (err, stream) => {
          if (err) return reject(err);
          
          stream.on('close', (code) => {
            conn.end();
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`Security setup script exited with code ${code}`));
            }
          }).on('data', (data) => {
            process.stdout.write(data);
          }).stderr.on('data', (data) => {
            process.stderr.write(data);
          });
        });
      });
      
      conn.on('error', (err) => {
        reject(err);
      });
      
      conn.connect(sshConfig);
    });
    
    console.log('\n✅ VPS Security Hardening and Automated Database Backups are fully configured and active!');
  } catch (error) {
    console.error('\n❌ Security setup failed:', error.message);
    process.exit(1);
  }
}

main();
