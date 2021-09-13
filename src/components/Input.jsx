import React, { useEffect, useRef } from 'react';

import '../css/components/Input.css';
import mergeRefs from '../utils/mergeRefs';

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

  const keydownHandler = () => {
    inputRef.current.setSelectionRange(value.length, value.length);
  };

  useEffect(() => {
    inputRef.current.addEventListener('keydown', keydownHandler);
    return () => {
      inputRef.current &&
        inputRef.current.removeEventListener('keydown', keydownHandler);
    };
  }, [value]);

  const onChangeHandler = ({ target }) => {
    setValue(target.value);
  };

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
