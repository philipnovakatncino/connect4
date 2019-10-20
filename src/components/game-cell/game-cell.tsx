import { Component, h, Prop } from '@stencil/core';
import { GameBoard } from '../game-board/game-board';

@Component({
  tag: 'game-cell',
  styleUrl: 'game-cell.css',
  shadow: false
})
export class GameCell {
  @Prop() player: number;

  private getCircleClass(): string {
    let classes = 'circle';

    if (this.player === GameBoard.PLAYER) {
      classes += ' red';
    } else if (this.player === GameBoard.OPPONENT) {
      classes += ' blue';
    }

    return classes;
  }

  render() {
    return (
      <div class="square">
        <div class={this.getCircleClass()}></div>
      </div>
    );
  }
}
