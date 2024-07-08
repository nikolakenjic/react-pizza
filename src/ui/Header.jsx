import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <Link to="/">Fast Pizza Co.</Link>
      <p>The best Italian Pizza</p>
    </header>
  );
};

export default Header;
