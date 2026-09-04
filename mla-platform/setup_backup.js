const { Client } = require('ssh2');

const conn = new Client();
const scriptContent = `#!/bin/bash
# Backup script for mla_db PostgreSQL database

BACKUP_DIR="/var/www/mla-platform/backups"
DB_NAME="mla_db"
DB_USER="postgres"
DB_PASS="Pr5p.&Bc481.kX3g"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/\${DB_NAME}_backup_\${DATE}.sql.gz"

mkdir -p "$BACKUP_DIR"

export PGPASSWORD="$DB_PASS"
pg_dump -U "$DB_USER" -h localhost "$DB_NAME" | gzip > "$BACKUP_FILE"
unset PGPASSWORD

find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -exec rm {} \\;

echo "Backup completed: $BACKUP_FILE"
`;

conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const writeStream = sftp.createWriteStream('/var/www/mla-platform/backup.sh');
    writeStream.on('close', () => {
      console.log('File uploaded successfully.');
      const cmds = [
        'chmod +x /var/www/mla-platform/backup.sh',
        '(crontab -l 2>/dev/null | grep -v "/var/www/mla-platform/backup.sh"; echo "0 2 * * * /var/www/mla-platform/backup.sh >> /var/www/mla-platform/backups/cron.log 2>&1") | crontab -',
        '/var/www/mla-platform/backup.sh'
      ].join(' && ');
      
      conn.exec(cmds, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
          conn.end();
        }).on('data', (data) => {
          process.stdout.write(data);
        }).stderr.on('data', (data) => {
          process.stderr.write(data);
        });
      });
    });
    writeStream.write(scriptContent);
    writeStream.end();
  });
}).connect({
  host: '89.116.20.218',
  port: 22,
  username: 'root',
  password: 'Pr5p.&Bc481.kX3g'
});
