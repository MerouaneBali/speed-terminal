/* eslint-disable consistent-return */
import React, { cloneElement, useEffect, useRef, useState } from 'react';

import '../css/components/Menu.css';

function Menu({
  parentTerminalRef,
  terminalsRef,
  refIndex,
  menuItems,
  disabled,
}) {
  const menuItemsRef = useRef([]);

  const [activeMenuItem, setActiveMenuItem] = useState();

  const arrowRef = useRef();

  const [arrowIndex, setArrowIndex] = useState(0);

  const keydownHandler = ({ key }) => {
    if ((!parentTerminalRef && !terminalsRef.current[refIndex]) || disabled) {
      return;
    }

    const terminal = parentTerminalRef
      ? parentTerminalRef.current
      : terminalsRef.current[refIndex];

    if (terminal && terminal.getAttribute('active') !== 'true') {
      return null;
    }

    const arrowHeight = parseFloat(
      window.getComputedStyle(arrowRef.current).height.slice(0, -2)
    );

    switch (key) {
      case 'Enter':
        setActiveMenuItem();
        setActiveMenuItem(arrowIndex);
        break;

      case 'ArrowUp':
        return setArrowIndex(
          // eslint-disable-next-line no-confusing-arrow
          (prevState) => {
            setActiveMenuItem();

            if (prevState - 1 >= 0) {
              arrowRef.current.style.marginTop = `calc(${
                (prevState - 1) * arrowHeight
              }px + ${(prevState - 1) * 1.25}em)`;

              return prevState - 1;
            }

            return prevState;
          }
        );

      case 'ArrowDown':
        return setArrowIndex((prevState) => {
          setActiveMenuItem();

          if (prevState + 1 <= menuItems.length - 1) {
            arrowRef.current.style.marginTop = `calc(${
              (prevState + 1) * arrowHeight
            }px + ${(prevState + 1) * 1.25}em)`;

            return prevState + 1;
          }

          return prevState;
        });

      default:
        break;
    }

    return null;
  };

  useEffect(() => {
    menuItems.length && document.addEventListener('keydown', keydownHandler);

    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, [
    parentTerminalRef,
    terminalsRef,
    refIndex,
    disabled,
    arrowIndex,
    menuItems,
  ]);

  return menuItems.length ? (
    <div className="menu">
      <div className="menu__arrow__container">
        <p ref={arrowRef} className="menu__arrow">
          {/* {arrowIndex} → */}→
        </p>
      </div>
      <div className="menu__options">
        <ul>
          {menuItems.map(
            (item, index) =>
              cloneElement(item, {
                key: index,
                innerRef: (el) => {
                  menuItemsRef.current[index] = el;
                },
                refIndex: index,
                menuItemsRef,
                activeMenuItem,
                id: item.props.id,
              })
            // eslint-disable-next-line function-paren-newline
          )}
        </ul>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Menu;
