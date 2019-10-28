import numjs from 'numjs';
import Board from './Connect4Logic';

export default class Connect4Game {
  constructor() {
    this.baseBoard = new Board();
  }

  getInitBoard() {
    return this.baseBoard.pieces;
  }

  getBoardSize() {
    return { a: this.baseBoard.height, b: this.baseBoard.width };
  }

  getActionSize() {
    return this.baseBoard.width;
  }

  getNextState(board, player, action) {
    const b = new Board().withNpPieces(board);
    b.addPiece(player, action);

    return { boardNdArray: numjs.array(b.pieces), curPlayer: -player };
  }

  getValidMoves(board, player) {
    const b = new Board().withNpPieces(board);
    return numjs.array(b.getLegalMoves());
  }

  getGameEnded(board, player) {
    const b = new Board().withNpPieces(board);
    if (b.isWin(player)) {
      return 1;
    }
    if (b.isWin(-player)) {
      return -1;
    }
    if (b.hasLegalMoves()) {
      return 0;
    }

    return 1e-4;
  }

  getCanonicalForm(board, player) {
    return numjs.multiply(board, player);
  }

  getSymmetries(board, pi) {
    const reverseBoard = board.slice(null, [null, null, -1]); // reverse each array
    const reversePi = pi.step(-1);

    return [
      { b: board, p: pi },
      { b: reverseBoard, p: reversePi }
    ];
  }

  stringRepresentation(board) {
    return JSON.stringify(board);
  }
}
