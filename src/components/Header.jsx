import React from 'react';

import logo from '../svg/logo.svg';

import '../css/components/Header.css';

/**
 * @component
 *
 * @description Page navigation header
 *
 * @prop {Array.<{name: String, action: Object}>} routes Routes to be presented in the header
 */
function Header({ routes }) {
  return (
    <header>
      <div>
        <img src={logo} alt="LOGO" />
        <button type="button" onClick={() => {}}>
          Speed Terminal
        </button>
      </div>
      <nav>
        <ul>
          {routes &&
            routes.map((route) => (
              <li key={route.title}>
                <button type="button" onClick={route.action}>
                  {route.title}
                </button>
              </li>
            ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
