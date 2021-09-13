import React, { useEffect, useRef } from 'react';

import '../css/components/MenuButton.css';

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

  useEffect(() => {
    const input = menuItemsRef.current[refIndex];

    input && activeMenuItem === refIndex && onClickHandler();
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
