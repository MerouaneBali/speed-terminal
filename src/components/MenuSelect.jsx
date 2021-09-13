import React, { useEffect, useRef } from 'react';

import '../css/components/MenuSelect.css';

function MenuSelect({
  innerRef,
  refIndex,
  menuItemsRef,

  id,
  className,
  label,

  activeMenuItem,

  options,
  //   setOptions,
  selectedOption,
  setSelectedOption,
}) {
  const inputRef = useRef();

  useEffect(() => {
    const input = menuItemsRef.current[refIndex];

    input &&
      activeMenuItem === refIndex &&
      setSelectedOption(() => {
        const currentOptionIndex = options.indexOf(selectedOption);
        const nextOptionIndex =
          currentOptionIndex + 1 >= options.length ? 0 : currentOptionIndex + 1;

        return options[nextOptionIndex];
      });
  }, [activeMenuItem]);

  return (
    <li
      ref={innerRef}
      id={id}
      className={`menu-select${className ? ` ${className}` : ''}`}
    >
      <p>{label}:</p>
      <p ref={inputRef} className="menu-select__selected">
        {selectedOption}{' '}
        <span>
          [{options.indexOf(selectedOption) + 1}/{options.length}]
        </span>
      </p>
    </li>
  );
}

export default MenuSelect;
