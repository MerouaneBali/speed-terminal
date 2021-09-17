/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';

import mergeRefs from '../utils/mergeRefs';

import '../css/components/Input.css';

/**
 * @component
 *
 * @description Custom input component containing:
 * - Hidden input holding the value and handling the onChange event
 * - Paragraph element styled as a terminals input holding the value of the component
 *
 * @requires mergeRefs
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the input element
 * @prop {string} props.id Id for div container
 * @prop {string} props.className className for div container
 * @prop {string} props.label Label prior to the input element
 * @prop {string} props.type Type for input element
 * @prop {string} props.placeholder Placeholder text for input element
 * @prop {string} props.value Value state for input element and for paragraph element (representing the terminal input)
 * @prop {function} props.setValue Set value state fucntion for input element onChange event handler
 *
 * @requires useRef
 * @requires useEffect
 */

function Input({
  innerRef,
  id,
  className,
  label,
  type,
  placeholder,
  value,
  setValue,
}) {
  const inputRef = useRef();

  /**
   * @description Keeps input caret at the end when value changes using the value's length
   */
  const keydownHandler = () => {
    inputRef.current &&
      inputRef.current.setSelectionRange(value.length, value.length);
  };

  /**
   * @description Handles input onChange event
   * @param {object} event Event object containing new changes
   * @param {object} event.target Input target object
   */
  const onChangeHandler = ({ target }) => {
    setValue(target.value);
  };

  /**
   * @method useEffect
   * @memberof Input
   * @listens keydown - keydownHandler
   * @description Adds and removes keydown event listener of keydownHanlder to and from the input element reference
   * ### Dependencies: [`value`]
   */
  useEffect(() => {
    inputRef.current &&
      inputRef.current.addEventListener('keydown', keydownHandler);
    return () => {
      inputRef.current &&
        inputRef.current.removeEventListener('keydown', keydownHandler);
    };
  }, [value]);

  return (
    <div id={id} className={`input${className ? ` ${className}` : ''}`}>
      <p>{label}:</p>
      <div>
        <input
          ref={mergeRefs(inputRef, innerRef)}
          type={type}
          name={label}
          placeholder={placeholder}
          value={value}
          onChange={onChangeHandler}
          autoComplete="off"
        />
        <p className="input__value">{value}</p>
        {/* <p className="input__highlight" data-type="error">
          Error: This is an error
        </p> */}
      </div>
    </div>
  );
}

export default Input;
