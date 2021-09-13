import React, { useEffect, useRef } from 'react';

import '../css/components/MenuCheckbox.css';

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
