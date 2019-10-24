const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const respond = input => {
  const output = {
    decision: null,
    message: ''
  };

  if (input === 'quit') {
    readline.close();
    output.message = 'quit';
  } else {
    input = parseInt(input);

    if (isNaN(input)) {
      output.message = "That's not a number silly";
    } else if (input > 6) {
      output.message = 'That number is too big.';
    } else if (input < 0) {
      output.message = 'That number is too small.';
    } else {
      output.decision = input;
    }
  }

  process.send(output);
};

process.on('message', input => {
  if (input.message === 'request decision') {
    readline.question('Enter a column number (0-6): ', respond);
  }
});
