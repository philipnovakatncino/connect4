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

  @Listen('weHaveAWinner')
  weHaveAWinner(event: CustomEvent) {
    const winner = event.detail;
    this.socket.emit(winner);
    this.status =
      winner === 1
        ? 'You have defeated the machine! ✊'
        : 'Computer wins. Know your place, human. 🤖';
    this.isPlayersTurn = false;
  }

  @Listen('playerMove')
  playerMove(event: CustomEvent) {
    this.socket.emit('human decision', event.detail);
    this.status = 'Waiting for Opponent';
    this.isPlayersTurn = false;
  }

  private async computerMove(column: number) {
    if (!(await this.gameboard.playOpponent(column))) {
      this.status = 'Your turn';
      this.isPlayersTurn = true;
    }
  }

  private resetGame(): void {
    this.gameboard.reset();
    this.socket.emit('reset');
    this.status = 'You go first';
    this.isPlayersTurn = true;
  }

  componentDidLoad() {
    this.gameboard = document.querySelector('game-board');
    this.socket.on('computer decision', (column: number) => this.computerMove(column));
    this.socket.on('close server', () => {
      console.warn('Disconnected from server');
    });
    this.resetGame();
  }

  render() {
    return (
      <div class="container">
        <h1 class="status">{this.status}</h1>
        <game-board isPlayersTurn={this.isPlayersTurn} />
        <button onClick={() => this.resetGame()}>Reset</button>
      </div>
    );
  }
}
