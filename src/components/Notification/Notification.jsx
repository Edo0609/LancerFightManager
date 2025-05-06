import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        {message}
      </div>
      <button className="notification-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Notification; 