import React from 'react';
import './CreditsPopup.css';

const CreditsPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="credits-overlay">
      <div className="credits-content">
        <h2>Credits</h2>
        <div className="credits-text">
          <p>
            Lancer Fight Manager is an open source small project to manage LancerRPG sessions, 
            specifically NPCs, by tracking their stats, weapons, systems and actions. The user 
            can create their own mechs, systems and weapons which will be saved remotely and 
            can be used anytime.
          </p>
          <p>
            Lancer Fight Manager was created by Eduardo Peñaloza as part of his final Project 
            for his class.
          </p>
          <p>
            Lancer Fight Manager is not an official Lancer product; it is a third party work, 
            and is not affiliated with Massif Press. Lancer Fight Manager is published via the 
            Lancer Third Party License.
          </p>
          <p className="copyright">
            Lancer is copyright Massif Press
          </p>
        </div>
        <button className="credits-close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default CreditsPopup; 