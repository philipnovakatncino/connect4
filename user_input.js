const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const respond = input => {
  if (input === 'quit') {
    readline.close();
  } else {
    input = parseInt(input);

    if (isNaN(input)) {
      console.log("That's not a number silly");
    } else if (input > 6) {
      console.log('That number is too big.');
    } else if (input < 0) {
      console.log('That number is too small.');
    } else {
      console.log(`Computer chose: ${input}`);
    }

    prompt();
  }
};

const prompt = () => readline.question('Enter a column number (0-6): ', respond);

console.log("Type 'quit' to quit.");
prompt();
