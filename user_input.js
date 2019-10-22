const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const respond = input => {
  if (input === 'quit') {
    readline.close();
  } else {
    input = parseInt(input);

    const output = {
      decision: null,
      message: ''
    };

    if (isNaN(input)) {
      output.message = "That's not a number silly";
    } else if (input > 6) {
      output.message = 'That number is too big.';
    } else if (input < 0) {
      output.message = 'That number is too small.';
    } else {
      output.decision = input;
    }

    process.send(output);
  }
};

process.on('message', () => readline.question('Enter a column number (0-6): ', respond));
