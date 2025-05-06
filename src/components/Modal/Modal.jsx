import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseDownTarget, setMouseDownTarget] = useState(null);

  if (!isOpen) return null;

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setMouseDownTarget(e.target);
  };

  const handleMouseUp = (e) => {
    if (isMouseDown && mouseDownTarget === e.target) {
      onClose();
    }
    setIsMouseDown(false);
    setMouseDownTarget(null);
  };

  return (
    <div 
      className="modal-overlay" 
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="modal-content" 
        onMouseDown={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 