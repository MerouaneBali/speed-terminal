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
 * @prop {boolean} community Set community state to `true`
 * @prop {boolean} playground Set playground state to `true`
 * @prop {boolean} classroom Set classroom state to `true`
 * @prop {boolean} start Set start state to `true`
 * @prop {boolean} account Set account state to `true`
 */
function Header({
  home,
  account,
  start,
  classroom,
  playground,
  community,
  about,
  contact,
}) {
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
            <button type="button" onClick={community}>
              Community
            </button>
          </li>
          <li>
            <button type="button" onClick={playground}>
              Playground
            </button>
          </li>
          <li>
            <button type="button" onClick={classroom}>
              Classroom
            </button>
          </li>
          <li>
            <button type="button" onClick={start}>
              Start
            </button>
          </li>
          <li>
            <button type="button" onClick={account}>
              Account
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
