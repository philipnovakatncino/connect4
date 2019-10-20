import { Component, h, Listen, State } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false
})
export class AppRoot {
  @State() status: string;
  @State() playerTurn: boolean = true;

  @Listen('playerMove')
  playerMove(event: CustomEvent) {
    this.playerTurn = !this.playerTurn;
    console.log('Player:', event.detail);
  }

  @Listen('opponentMove')
  opponentMove(event: CustomEvent) {
    this.playerTurn = !this.playerTurn;
    console.log('Opponent:', event.detail);
  }

  render() {
    return (
      <div class="container">
        <h1 class="status">{this.playerTurn ? 'Your turn' : 'Waiting for Opponent'}</h1>
        <game-board playerTurn={this.playerTurn} />
      </div>
    );
  }
}
