export class RandomPlayer {
  constructor(game) {
    console.log('RandomPlayer constructer');
    this.game = game;
  }

  play = (board) => {
    // Python:
    // a = np.random.randint(self.game.getActionSize()) [0, low)
    let a = Math.floor(Math.random() * this.game.getActionSize());
    let valids = this.game.getValidMoves(board, 1);
    valids = valids.tolist();

    while (valids[a] !== 1) {
      a = Math.floor(Math.random() * this.game.getActionSize());
    }
    return a;
  }
}

export class HumanConnect4Player {
  constructor(game) {
    console.log('HumanConnect4Player constructer');
    this.game = game;
    this.isHuman = true;
  }
}
