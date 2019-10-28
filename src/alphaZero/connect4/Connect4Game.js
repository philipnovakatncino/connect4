import numjs from 'numjs';
import Board from './Connect4Logic';

export default class Connect4Game {
  constructor() {
    this.baseBoard = new Board();
  }

  getInitBoardNdArray() {
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

    return { boardNdArray: b.pieces, curPlayer: -player };
  }

  getValidMoves(board, player) {
    const b = new Board().withNpPieces(board);
    const validMoves = new Array(b.width).fill(0);
    const legalMoves = b.getLegalMoves();
    return numjs.array(validMoves.map((element, index) => legalMoves.indexOf(index) >= 0 ? 1 : 0));
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
    const reversePi = [...pi].reverse();

    return [
      { b: board, p: pi },
      { b: reverseBoard, p: reversePi }
    ];
  }

  stringRepresentation(board) {
    return JSON.stringify(board);
  }
}
