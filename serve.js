const open = require('open');
const child_process = require('child_process');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let ai;
let board;
let disconnect;

app.use(express.static(__dirname + '/www/'));

app.get('/', (_, response) => {
  response.sendFile(__dirname + '/www/index.html');
});

io.on('connection', socket => {
  console.log('Connection to page established');
  spawnProcess();

  socket.on('human decision', data => {
    board = data;
    console.log(board);
    requestDecision();
  });

  socket.on('reset', () => {
    board = null;
  });

  socket.on('disconnect', () => {
    console.log('Page disconnected');
  });

  disconnect = () => {
    socket.emit('close server');
    socket.disconnect(true);
    server.close();
  };
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});

open('http://localhost:3000');

const spawnProcess = () => {
  ai = child_process.fork('./user_input.js');

  ai.on('message', output => {
    if (output.message === 'quit') {
      ai.kill();
      disconnect();
    } else if (output.decision != null) {
      io.emit('computer decision', output.decision);
    } else {
      console.log(output.message);
      requestDecision();
    }
  });
};

const requestDecision = () => {
  if (ai) {
    ai.send({
      message: 'request decision',
      board
    });
  } else {
    console.warn('AI process has not been initialized');
  }
};

process.on('SIGINT', () => {
  process.stdin.resume();
  disconnect();
  process.kill(0);
});
