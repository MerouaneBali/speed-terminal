/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef } from 'react';

import '../css/components/MenuSelect.css';

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
 * @prop {array} props.options Array of options to select from
 * @prop {string} props.selectedOption Value of checkbox
 * @prop {function} props.setSelectedOption Set check state function
 *
 * @requires useRef
 * @requires useEffect
 */
function MenuSelect({
  innerRef,
  refIndex,
  menuItemsRef,

  id,
  className,
  label,

  activeMenuItem,

  options,
  selectedOption,
  setSelectedOption,
}) {
  const inputRef = useRef();

  /**
   * @description Toggles between options from `options` state
   * and setting `selectedOption` to the next option on the list
   * @returns {string} Next option on the options array
   */
  const selectionToggleHandler = () =>
    setSelectedOption(() => {
      const currentOptionIndex = options.indexOf(selectedOption);
      const nextOptionIndex =
        currentOptionIndex + 1 >= options.length ? 0 : currentOptionIndex + 1;

      return options[nextOptionIndex];
    });

  /**
   * @method useEffect
   * @memberof MenuSelect
   * @description Toggles between options from `options` state
   * and setting `selectedOption` to the next option on the list
   * if the current active menu item is this component
   *
   * Once one of the dependencies below change:
   * 1. Get menu item from `menuItemsRef` using `refIndex`
   * 1. Check once menu item is fetched,
   *    if `activeMenuItem` value is the same as `refIndex` value of the component,
   *    then get index of current selectedOption
   *    and setting it to the next one on the `options` list
   *
   * ### Dependencies: [`activeMenuItem`]
   */
  useEffect(() => {
    const input = menuItemsRef.current[refIndex];

    input && activeMenuItem === refIndex && selectionToggleHandler();
  }, [activeMenuItem]);

  return (
    <li
      ref={innerRef}
      id={id}
      className={`menu-select${className ? ` ${className}` : ''}`}
    >
      <p>{label}:</p>
      <p
        ref={inputRef}
        className="menu-select__selected"
        onClick={selectionToggleHandler}
      >
        {selectedOption}{' '}
        <span>
          [{options.indexOf(selectedOption) + 1}/{options.length}]
        </span>
      </p>
    </li>
  );
}

export default MenuSelect;
