const open = require('open');
const child_process = require('child_process');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/www/'));

app.get('/', (_, response) => {
  response.sendFile(__dirname + '/www/index.html');
});

io.on('connection', socket => {
  console.log('Connection to page established');
  spawnProcess();

  socket.on('player decision', message => {
    console.log(`Player chose: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('Page disconnected');
  });
});

open('http://localhost:3000');

const spawnProcess = () => {
  const child = child_process.spawn('node', ['user_input.js']);

  // only necessary for user_input.js program
  process.stdin.pipe(child.stdin);

  child.stdout.on('data', buffer => {
    const output = buffer.toString();

    if (output.startsWith('Computer chose:')) {
      const column = parseInt(output.replace(/[^0-9]/g, ''));
      console.log(`emitting: ${column}`);
      io.emit('computer decision', column);
    } else {
      console.log(`stdout: ${output}`);
    }
  });

  child.on('exit', code => {
    console.log(`Child process exited with code ${code}`);
  });
};

http.listen(3000, () => {
  console.log(`listening on *:3000`);
});
