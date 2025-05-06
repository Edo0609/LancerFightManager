import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Modal from '../Modal/Modal';
import './Auth.css';

const Auth = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLogin ? (
        <Login onToggleForm={toggleForm} onClose={onClose} />
      ) : (
        <Signup onToggleForm={toggleForm} onClose={onClose} />
      )}
    </Modal>
  );
};

export default Auth; 