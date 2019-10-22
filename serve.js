const open = require('open');
const child_process = require('child_process');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let ai;
let board;

app.use(express.static(__dirname + '/www/'));

app.get('/', (_, response) => {
  response.sendFile(__dirname + '/www/index.html');
});

io.on('connection', socket => {
  console.log('Connection to page established');
  spawnProcess();

  socket.on('player decision', input => {
    board = input;
    console.log(board);
    requestDecision();
  });

  socket.on('reset', input => {
    board = input;
    console.log(board);
  });

  socket.on('disconnect', () => {
    console.log('Page disconnected');
  });
});

open('http://localhost:3000');

const spawnProcess = () => {
  ai = child_process.fork('./user_input.js');

  ai.on('message', output => {
    if (output.decision == null) {
      console.log(output.message);
      requestDecision();
    } else {
      io.emit('computer decision', output.decision);
    }
  });
};

const requestDecision = () => {
  if (ai) {
    ai.send({
      message: 'request decision',
      board
    });
  }
};

http.listen(3000, () => {
  console.log(`listening on *:3000`);
});
