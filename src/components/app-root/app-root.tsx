import { Component, h, Listen, State } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false
})
export class AppRoot {
  @State() status: string;
  @State() isPlayersTurn = true;

  private gameboard;

  @Listen('playerMove')
  playerMove(event: CustomEvent) {
    console.log('Player:', event.detail);
    this.isPlayersTurn = false;
  }

  @Listen('opponentMove')
  opponentMove(event: CustomEvent) {
    console.log('Opponent:', event.detail);
    this.isPlayersTurn = true;
  }

  private resetGame(): void {
    this.gameboard.reset();
    this.isPlayersTurn = true;
  }

  componentDidLoad() {
    this.gameboard = document.querySelector('game-board');
  }

  render() {
    return (
      <div class="container">
        <h1 class="status">{this.isPlayersTurn ? 'Your turn' : 'Waiting for Opponent'}</h1>
        <game-board isPlayersTurn={this.isPlayersTurn} />
        <button onClick={() => this.resetGame()}>Reset</button>
      </div>
    );
  }
}
