/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';

import '../css/components/MenuInput.css';
import Input from './Input';

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
 * @prop {string} props.label Label for paragraph element prior to input element
 * @prop {number} props.activeMenuItem Index of current active menu item in Menu component
 * @prop {string} props.value Value of input
 * @prop {function} props.setValue Set value state function
 *
 * @requires useRef
 * @requires useEffect
 */
function MenuInput({
  innerRef,
  refIndex,
  menuItemsRef,
  id,
  className,
  label,
  type,
  placeholder,
  activeMenuItem,
  value,
  setValue,
}) {
  const inputRef = useRef();

  /**
   * @method useEffect
   * @memberof MenuCheckbox
   * @description Focus's and blurs the input element if the current active menu item is this component
   *
   * Once one of the dependencies below change:
   * 1. Get menu item from `menuItemsRef` using `refIndex`
   * 1. Check once menu item is fetched, if `activeMenuItem` value is the same as `refIndex` value of the component,
   * then focus input, else blut it, and set value state to placeholder if no value.
   *
   * ### Dependencies: [`activeMenuItem`]
   */
  useEffect(() => {
    const input = menuItemsRef.current[refIndex];

    input && activeMenuItem === refIndex
      ? inputRef.current.focus()
      : inputRef.current.blur();

    input && activeMenuItem !== refIndex && !value && setValue(placeholder);
  }, [activeMenuItem]);

  return (
    <li
      ref={innerRef}
      id={id}
      className={`menu-input${className ? ` ${className}` : ''}`}
    >
      <Input
        innerRef={inputRef}
        type={type}
        label={label}
        placeholder={placeholder}
        value={value}
        setValue={setValue}
      />
      {/* <p>{label}:</p>
      <div>
        <input
          ref={inputRef}
          type={type}
          name={label}
          placeholder={placeholder}
          value={value}
          onChange={onChangeHandler}
          autoComplete="off"
        />
        <p>
          {value} <span ref={caretRef} />
        </p>
      </div> */}
    </li>
  );
}

export default MenuInput;
