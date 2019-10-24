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
  async playOpponent(column: number): Promise<void> {
    if (!this.isPlayersTurn && this.isValidMove(column)) {
      this.play(column, GameBoard.OPPONENT);
    }
  }

  private columnClick(column: number): void {
    if (this.isPlayersTurn && this.isValidMove(column)) {
      this.play(column, GameBoard.PLAYER);
      this.playerMove.emit(this.board);
    }
  }

  private isValidMove(column: number): boolean {
    return (
      column >= 0 &&
      column <= GameBoard.COLUMN_MAX &&
      this.board[column][GameBoard.COLUMN_MAX - 1] === 0
    );
  }

  private play(column: number, player: number): void {
    const index = this.board[column].indexOf(0);
    this.board[column][index] = player;
  }

  render() {
    return (
      <div class="grid">
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
