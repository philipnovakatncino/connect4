import { Component, h, Prop, State, Event, EventEmitter, Method } from '@stencil/core';

@Component({
  tag: 'game-board',
  styleUrl: 'game-board.css',
  shadow: false
})
export class GameBoard {
  @Prop() isPlayersTurn: boolean;
  @State() board: Array<Array<number>> = this.generateEmptyBoard();

  @Event() playerMove: EventEmitter;
  @Event() weHaveAWinner: EventEmitter;

  public static readonly PLAYER = 1;
  public static readonly OPPONENT = 2;

  private static readonly COLUMN_MAX = 6;
  private static readonly ROW_MAX = 7;

  private generateEmptyBoard(): Array<Array<number>> {
    return new Array(GameBoard.ROW_MAX).fill(0).map(() => new Array(GameBoard.COLUMN_MAX).fill(0));
  }

  @Method()
  async reset(): Promise<void> {
    this.board = this.generateEmptyBoard();
  }

  @Method()
  async playOpponent(column: number): Promise<boolean> {
    if (!this.isPlayersTurn && this.isValidMove(column)) {
      return this.play(column, GameBoard.OPPONENT);
    }
  }

  private columnClick(column: number): void {
    if (this.isPlayersTurn && this.isValidMove(column)) {
      if (!this.play(column, GameBoard.PLAYER)) {
        this.playerMove.emit(this.board);
      }
    }
  }

  private isValidMove(column: number): boolean {
    return (
      column >= 0 &&
      column <= GameBoard.COLUMN_MAX &&
      this.board[column][GameBoard.COLUMN_MAX - 1] === 0
    );
  }

  private isValidPosition(column: number, row: number): boolean {
    return column >= 0 && column <= GameBoard.COLUMN_MAX && row >= 0 && row <= GameBoard.ROW_MAX;
  }

  private play(column: number, player: number): boolean {
    const index = this.board[column].indexOf(0);
    this.board[column][index] = player;
    this.board = [...this.board];
    if (this.detectWin(column, index, player)) {
      console.log(`Player ${player} wins!`);
      this.weHaveAWinner.emit(player);
      return true;
    }
    return false;
  }

  private detectWin(lastPlayColumn: number, lastPlayPosition: number, player: number): boolean {
    let win = false;

    // vertical search
    let run = 0;
    this.board[lastPlayColumn].forEach(row => {
      if (row === player) {
        run++;
        if (run === 4) {
          console.log('vertical win!!!', player);
          win = true;
        }
      } else {
        run = 0;
      }
    });

    if (win) {
      return true;
    }

    // horizontal search
    run = 0;
    this.board.forEach(column => {
      if (column[lastPlayPosition] === player) {
        run++;
        if (run === 4) {
          console.log('horizontal win!!!', player);
          win = true;
        }
      } else {
        run = 0;
      }
    });

    if (win) {
      return true;
    }

    // diagonal search
    let searchPositionX;
    let searchPositionY;
    let hasChangedDirection;

    const initializeSearch = () => {
      run = 1;
      hasChangedDirection = false;
      searchPositionX = lastPlayColumn;
      searchPositionY = lastPlayPosition;
    };

    const checkPosition = (column: number, row: number) => this.board[column][row] === player;
    const search = (directionX: number, directionY: number) => {
      searchPositionX += directionX;
      searchPositionY += directionY;

      if (
        this.isValidPosition(searchPositionX, searchPositionY) &&
        checkPosition(searchPositionX, searchPositionY)
      ) {
        run++;
        if (run == 4) {
          win = true;
        } else {
          search(directionX, directionY);
        }
      } else if (!hasChangedDirection) {
        hasChangedDirection = true;
        searchPositionX = lastPlayColumn;
        searchPositionY = lastPlayPosition;
        search(-directionX, -directionY);
      }
    };

    initializeSearch();
    search(1, 1);

    if (win) {
      return true;
    }

    initializeSearch();
    search(-1, 1);

    return win;
  }

  render() {
    return (
      <div class={`grid ${this.isPlayersTurn ? 'clickable' : ''}`}>
        {this.board.map((column, i) => (
          <div class="column" onClick={() => this.columnClick(i)}>
            {column.map(cell => (
              <game-cell player={cell} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
