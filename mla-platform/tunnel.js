const { Client } = require('ssh2');
const net = require('net');

const sshConfig = {
  host: '89.116.20.218',
  port: 22,
  username: 'root',
  password: 'Pr5p.&Bc481.kX3g'
};

const server = net.createServer(socket => {
  const conn = new Client();
  conn.on('ready', () => {
    conn.forwardOut(
      socket.remoteAddress,
      socket.remotePort,
      '127.0.0.1',
      5432,
      (err, stream) => {
        if (err) {
          socket.end();
          return conn.end();
        }
        socket.pipe(stream).pipe(socket);
        
        socket.on('close', () => {
          conn.end();
        });
      }
    );
  }).on('error', err => {
    console.error('SSH connection error:', err);
    socket.end();
  }).connect(sshConfig);
});

server.listen(5433, '127.0.0.1', () => {
  console.log('Tunnel listening on localhost:5433, forwarding to 89.116.20.218:5432');
});
