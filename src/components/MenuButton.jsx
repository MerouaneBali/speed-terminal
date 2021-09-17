/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';

import '../css/components/MenuButton.css';

/**
 * @component
 *
 * @description Custom call to action button component for {@link Menu} component
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the li element
 * @prop {number} props.refIndex Index of current menu item in menuItemsRef
 * @prop {object} props.menuItemsRef Reference hook containing an array of menu items hooks
 * @prop {string} props.id Id for li container
 * @prop {string} props.className className for li container
 * @prop {object} props.style Inline styling for button element
 * @prop {string} props.label Label for button element
 * @prop {number} props.activeMenuItem Index of current active menu item in Menu component
 * @prop {function} props.onClickHandler Handler function for button onClick event
 *
 * @requires useState
 * @requires useEffect
 */
function MenuButton({
  innerRef,
  refIndex,
  menuItemsRef,

  id,
  className,
  style,

  label,

  activeMenuItem,

  onClickHandler,
}) {
  const inputRef = useRef();

  /**
   * @method useEffect
   * @memberof MenuButton
   * @description Executes `onClickHandler()` if the current active menu item is this component
   *
   * Once one of the dependencies below change:
   * 1. Get menu item from `menuItemsRef` using `refIndex`
   * 1. Check once menu item is fetched, if `activeMenuItem` value is the same as `refIndex` value of the component,
   *    then execute `onClickHandler()`
   *
   * ### Dependencies: [`activeMenuItem`]
   */
  useEffect(() => {
    const button = menuItemsRef.current[refIndex];

    button && activeMenuItem === refIndex && onClickHandler();
  }, [activeMenuItem]);

  return (
    <li
      ref={innerRef}
      id={id}
      className={`menu-button${className ? ` ${className}` : ''}`}
    >
      <button ref={inputRef} type="button" style={style}>
        {label}
      </button>
    </li>
  );
}

export default MenuButton;
