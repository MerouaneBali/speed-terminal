/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';

import '../css/components/MenuCheckbox.css';

/**
 * @component
 *
 * @description Custom checkbox component for {@link Menu} component
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the li element
 * @prop {number} props.refIndex Index of current menu item in menuItemsRef
 * @prop {object} props.menuItemsRef Reference hook containing an array of menu items hooks
 * @prop {string} props.id Id for li container
 * @prop {string} props.className className for li container
 * @prop {string} props.label Label for paragraph element prior to checkbox element
 * @prop {number} props.activeMenuItem Index of current active menu item in Menu component
 * @prop {boolean} props.checked Value of checkbox
 * @prop {function} props.setChecked Set check state function
 *
 * @requires useRef
 * @requires useEffect
 */
function MenuCheckbox({
  innerRef,
  refIndex,
  menuItemsRef,

  id,
  className,
  label,
  placeholder,

  activeMenuItem,

  checked,
  setChecked,
}) {
  const inputRef = useRef();

  /**
   * @method useEffect
   * @memberof MenuCheckbox
   * @description Toggles checked state if the current active menu item is this component
   *
   * Once one of the dependencies below change:
   * 1. Get menu item from `menuItemsRef` using `refIndex`
   * 1. Check once menu item is fetched, if `activeMenuItem` value is the same as `refIndex` value of the component,
   *    then toggles checked state
   *
   * ### Dependencies: [`activeMenuItem`]
   */
  useEffect(() => {
    const input = menuItemsRef.current[refIndex];

    input &&
      activeMenuItem === refIndex &&
      setChecked((prevState) => !prevState);
  }, [activeMenuItem]);

  return (
    <li
      ref={innerRef}
      id={id}
      className={`menu-checkbox${className ? ` ${className}` : ''}`}
    >
      <p>{label}:</p>
      <input
        ref={inputRef}
        type="checkbox"
        name={label}
        placeholder={placeholder}
        value={checked}
        // eslint-disable-next-line no-extra-boolean-cast
        onChange={() => setChecked((prevState) => !prevState)}
      />
      <p className="menu-checkbox__checked">{checked ? 'true' : 'false'}</p>
    </li>
  );
}

export default MenuCheckbox;
