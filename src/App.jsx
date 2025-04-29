import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu/MainMenu';
import GameView from './components/GameView/GameView';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game" element={<GameView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
