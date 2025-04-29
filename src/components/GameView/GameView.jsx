import React from 'react';
import Header from '../Header/Header';
import './GameView.css';

const GameView = () => {
  return (
    <div className="game-view">
      <Header />
      <div className="game-content">
        <h1>Game View</h1>
        <p>This is where your game content will go!</p>
      </div>
    </div>
  );
};

export default GameView; 