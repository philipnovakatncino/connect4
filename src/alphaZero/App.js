import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Checkbox, Button } from 'semantic-ui-react';

import play, { downloadPretrained, humanMove } from './pit';
import train from './main-connect4';
// import train from './tictactoe/tensorflow/TicTacToeNNet';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabledAI: false,
      aiIsDownloaded: false,
      aiFirst: true,
      selfTrained: false,
    };
  }

  twoRandowmPlay =() => {
    play();
  }

  startTrain = async () => {
    console.log('start-train');
    await train();
    console.log('end-train');
    this.setState({ selfTrained: true });
  }

  selfTrainVSRandom = () => {
    console.log('selfTrainVSRandom');
    play(1);
  }

  // userVSuser = () => {
  // }

  twoRandowmPlayWithPretrained = async () => {
    play(2);
  }

  downloadPretrained = async () => {
    if (this.state.aiIsDownloaded === false) {
      console.log('ui start to download');
      await downloadPretrained();
      console.log('ui start to download2');
      this.setState({ aiIsDownloaded: true });
    }
  }

  toggleAI = () => {
    this.setState({ enabledAI: !this.state.enabledAI });
  }

  handleClick = action => humanMove(action)

  startNewGame = () => {
    console.log('start new game');
    if (this.state.enabledAI) {
      if (this.state.selfTrained === false && this.state.aiIsDownloaded === false) {
        alert('ai is not download yet');
      }
      let action;
      if (this.state.selfTrained) {
        action = play(4, this.state.aiFirst);
      } else {
        action = play(3, this.state.aiFirst);
      }
      this.setState((prevState, props) => ({ aiFirst: !prevState.aiFirst }));

      if (action >= 0) {
        console.log('ai starts at:', action);
        return action;
      }
    }
    return -1;
  }

  render() {
    return (
      <Button onClick={this.startTrain} disabled={this.state.selfTrained}>
      {'Start self-Train (console result), about 18 mins'}
    </Button>
    );
  }
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
