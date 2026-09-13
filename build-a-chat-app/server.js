import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading index.html');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket, req) => {
  const username = new URL(req.url, 'http://localhost').searchParams.get(
    'username'
  );

  // Avisar a todos que un usuario entró
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(
        JSON.stringify({
          type: 'system',
          text: `${username} joined`
        })
      );
    }
  });

  // Recibir y enviar mensajes de chat
  socket.on('message', (message) => {
    const { username, text } = JSON.parse(message);

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(
          JSON.stringify({
            type: 'chat',
            username,
            text
          })
        );
      }
    });
  });

  // Avisar a todos cuando el usuario se desconecta
  socket.on('close', () => {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(
          JSON.stringify({
            type: 'system',
            text: `${username} left`
          })
        );
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
