import React from 'react';
import './Popup.css';

const Popup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Welcome to Lancer Fight Manager</h2>
        <div className="popup-text">
          <p>Welcome to Lancer Fight Manager!</p>
          <p>This page was made for a friend and as part of my final class project.</p>
          <p>I hope you enjoy, if you'd like to make your own (better) version of this app, feel free to do so!</p>
          <p>Lancer Fight Manager is not an official Lancer product; it is a third party work, and is not affiliated with Massif Press. Lancer Fight Manager is published via the Lancer Third Party License.</p>
          <p>Lancer is copyright Massif Press</p>
        </div>
        <button className="popup-button" onClick={onClose}>
          I Understand
        </button>
      </div>
    </div>
  );
};

export default Popup; 