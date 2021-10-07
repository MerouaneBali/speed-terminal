import React from 'react';

import logo from '../svg/logo.svg';

import '../css/components/Header.css';

/**
 * @component
 *
 * @description Page navigation header
 *
 * @prop {boolean} contact Set contact state to `true`
 * @prop {boolean} about Set about state to `true`
 * @prop {boolean} start Set start state to `true`
 */
function Header({ home, start, about, contact }) {
  return (
    <header>
      <div>
        <img src={logo} alt="LOGO" />
        <button type="button" onClick={home}>
          Speed Terminal
        </button>
      </div>
      <nav>
        <ul>
          <li>
            <button type="button" onClick={contact}>
              Contact
            </button>
          </li>
          <li>
            <button type="button" onClick={about}>
              About
            </button>
          </li>
          <li>
            <button type="button" onClick={start}>
              Start
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
