const numjs = require('numjs');

export default class Board {
  constructor(height = 6, width = 7) {
    this.height = height;
    this.width = width;
    this.pieces = numjs.zeros([this.width, this.height]);
  }

  getLegalMoves() {
    return this.pieces.tolist()
      .map((column, index) => column.indexOf(0) >= 0 ? index : -1 )
      .filter(move => move !== -1);
  }

  hasLegalMoves() {
    for (let col = 0; col < this.width; col++) {
      if (!this.pieces.get(col, -1)) {
        return true;
      }
    }
    return false;
  }

  withNpPieces(board) {
    this.pieces = board.clone();
    return this;
  }

  static checkRowsForWin(color, board) {
    const win = 4;
    let count = 0;

    for (let col = 0; col < board.length; col++) {
      count = 0;
      for (let row = 0; row < board[col].length; row++) {
        if (board[col].length - row + count < 4) {
          count = 0;
          break;
        }

        count = board[col][row] === color ? count + 1 : 0;
        if (count === win) {
          return true;
        }
      }
    }
    return false;
  }

  static getDiagonalsOffBoard(board) {
    const diagonalBoard = [];

    for (let i = 0; i < board[0].length + board.length - 1; i++) {
      diagonalBoard[i] = [];
      for (let j = Math.min(i, board.length - 1); j > Math.max(-1, i - board[0].length); j--) {
        diagonalBoard[i].push(board[j][i - j]);
      }
    }
    return diagonalBoard;
  }

  static getDiagonalBoard(board) {
    return [
      ...this.getDiagonalsOffBoard(board.tolist()),
      ...this.getDiagonalsOffBoard(numjs.rot90(board).tolist()),
    ];
  }

  isWin(color) {
    return (
      Board.checkRowsForWin(color, this.pieces) ||
      Board.checkRowsForWin(color, this.pieces.clone().T) ||
      Board.checkRowsForWin(color, Board.getDiagonalBoard(this.pieces))
    );
  }

  addPiece(color, column) {
    const col = this.pieces.pick(column).tolist();
    const row = col.indexOf(0);
    if (row >= 0 && col[row] === 0) {
      this.pieces.set(column,row,color);
    } else {
      throw new Error('already colored, wrong');
    }
  }
}
