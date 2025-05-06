import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {isLogin ? (
        <Login onToggleForm={toggleForm} />
      ) : (
        <Signup onToggleForm={toggleForm} />
      )}
    </>
  );
};

export default Auth; 