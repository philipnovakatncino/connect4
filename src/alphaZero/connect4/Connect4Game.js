import numjs from 'numjs';
import Game from '../Game';
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
    const b = new Board();
    b.addPiece(player, action);

    return { board: numjs.array(b.pieces), curPlayer: -player };
  }

  getValidMoves(board, player) {
    return this.baseBoard.getLegalMoves();
  }

  getGameEnded(board, player) {
    const b = this.baseBoard.withNpPieces(board);
    const winState = b.getWinState();
    if (winState.isEnded) {
      switch (winState.winner) {
        case null: return 1e-4; // draw has very little value
        case player: return 1;
        case -player: return -1;
        default: console.error('Unexpected winstate found: ', winState);
          return null;
      }
    } else {
      return 0; // unfinished game
    }
  }

  getCanonicalForm(board, player) {
    return nj.multiply(board, player);
  }

  getSymmetries(board, pi) {
    const reverseBoard = board.map(col => col.reverse());
    const reversePi = pi.reverse();

    return [
      { b: board, p: pi },
      { b: reverseBoard, p: reversePi }
    ];
  }

  stringRepresentation(board) {
    return this.baseBoard.withNpPieces(board);
  }
}
