export default class Board {
  constructor(height = 6, width = 7) {
    this.height = height;
    this.width = width;

    this.pieces = new Array(width).fill(0).map(() => new Array(height).fill(0));
  }

  getLegalMoves() {
    return this.pieces
      .map((column, index) => (column.indexOf(0) >= 0 ? index : -1))
      .filter(move => move.y !== -1);
  }

  hasLegalMoves() {
    for (let col = 0; col < this.width; col++) {
      if (this.pieces[col].indexOf(0) >= 0) {
        return true;
      }
    }
    return false;
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

  static rotateBoard(board) {
    return Board.transposeBoard(board).map(row => row.reverse());
  }

  static transposeBoard(board) {
    return board[0].map((column, index) => board.map(row => row[index]));
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
      ...this.getDiagonalsOffBoard(board),
      ...this.getDiagonalsOffBoard(this.rotateBoard(board)),
    ];
  }

  isWin(color) {
    return (
      Board.checkRowsForWin(color, this.pieces) ||
      Board.checkRowsForWin(color, Board.transposeBoard(this.pieces)) ||
      Board.checkRowsForWin(color, Board.getDiagonalBoard(this.pieces))
    );
  }

  addPiece(color, column) {
    const row = this.pieces[column].indexOf(0);
    if (row >= 0 && this.pieces[column][row] === 0) {
      this.pieces[column][row] = color;
    } else {
      throw new Error('already colored, wrong');
    }
  }
}
