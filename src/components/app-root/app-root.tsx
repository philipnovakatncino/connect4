import { Component, h, Listen, State } from '@stencil/core';
import io from 'socket.io-client';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false
})
export class AppRoot {
  @State() status: string;
  @State() isPlayersTurn = true;

  private gameboard;
  private socket = io('http://localhost:3000', { reconnection: false });

  @Listen('playerMove')
  playerMove(event: CustomEvent) {
    console.log('Player:', event.detail);
    this.socket.emit('player decision', event.detail);
    this.isPlayersTurn = false;
  }

  private resetGame(): void {
    this.gameboard.reset();
    this.isPlayersTurn = true;
    this.socket.emit('reset');
  }

  componentDidLoad() {
    this.gameboard = document.querySelector('game-board');
    this.socket.on('computer decision', (column: number) => {
      this.gameboard.playOpponent(column);
      this.isPlayersTurn = true;
    });
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
