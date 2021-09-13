import React, { useEffect, useRef } from 'react';

import '../css/components/MenuInput.css';
import Input from './Input';

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
