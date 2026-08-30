const { Client } = require('ssh2');

const conn = new Client();
const cmd = process.argv[2] || 'ls -la';

conn.on('ready', () => {
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).connect({
  host: '89.116.20.218',
  port: 22,
  username: 'root',
  password: 'Pr5p.&Bc481.kX3g'
});
