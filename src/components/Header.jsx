import React from 'react';

import logo from '../svg/logo.svg';

import '../css/components/Header.css';

/**
 * @component
 *
 * @description Page navigation header
 */
function Header() {
  return (
    <header>
      <div>
        <img src={logo} alt="LOGO" />
        <p>Speed Terminal</p>
      </div>
      <nav>
        <ul>
          <li>
            <p>Contact</p>
          </li>
          <li>
            <p>About</p>
          </li>
          <li>
            <p>Community</p>
          </li>
          <li>
            <p>Playground</p>
          </li>
          <li>
            <p>Start</p>
          </li>
          <li>
            <p>Account</p>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
