import React from 'react';
import './Header.css';

const Header = () => {
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div></div>
        <button className="theme-toggle" onClick={toggleTheme}>
          Toggle Theme
        </button>
      </div>
    </header>
  );
};

export default Header; 