// @ts-nocheck
/* eslint-disable max-len */
/* eslint-disable consistent-return */
import React, { cloneElement, useEffect, useRef, useState } from 'react';

import '../css/components/Menu.css';

/**
 * @component
 *
 * @description Menu component width up/down arrow key controls
 *
 * @prop {object} props React props
 * @prop {object} props.parentTerminalRef Parent terminal reference hook
 * @prop {object} props.terminalsRef Reference hook containing an array of terminal hooks
 * @prop {number} props.refIndex Index of current terminal in terminalsRef
 * @prop {Array} props.menuItems Array containing menu items to be rendered
 * @prop {boolean} props.disabled Disables the menu and blockes keydown event listener
 *
 * @requires useState
 * @requires useRef
 * @requires useEffect
 * @requires cloneElement
 */
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

  /**
   * @description Moves `.menu__arrow` up and down based on keydown event
   * @requires setActiveMenuItem
   */
  const keydownHandler = ({ key }) => {
    /**
     * Check if no terminal refrence (parenTerminalRef or terminal reference from terminalsRef using refIndex)
     * NOTE: Sometimes it takes few seconds for reference hooks to take effect, resulting their value being null initally
     */
    if ((!parentTerminalRef && !terminalsRef.current[refIndex]) || disabled) {
      return;
    }

    /**
     * @constant {object} terminal
     * @description Terminal parent of the component
     * @default
     */
    const terminal = parentTerminalRef
      ? parentTerminalRef.current
      : terminalsRef.current[refIndex];

    /**
     * Check once terminal is fetched, if parent terminal's active attribute is NOT true, return and exist method
     * NOTE: We don't want inactive terminals responding to the keydown event handler
     */
    if (terminal && terminal.getAttribute('active') !== 'true') {
      return;
    }

    /**
     * @constant {number} arrowHeight
     * @description The current hight of `.menu__arrow`
     * @default
     */
    const arrowHeight = parseFloat(
      window.getComputedStyle(arrowRef.current).height.slice(0, -2)
    );

    /**
     * @method calcPreviousArrowPosition
     * @memberof Menu
     *
     * @description Calculate and set marginTop of previous `.menu__arrow` using the following equation:
     *
     * ### Equation:
     *
     * Previous arrow spaces available in each menu item, plus the total of marginTops seperating them
     *
     * ### Variables:
     *
     * - currentArrowIndex: Current arrow index
     * - previousMenuItemN: Number of previous menu items - getting this from the value of currentArrowIndex - 1
     * - arrowHeight: The current hight of `.menu__arrow`
     *
     * ### Syntax:
     *
     * marginTop = ((currentArrowIndex - 1) * arrowHeight)px + ((currentArrowIndex - 1) * 1.25)em
     *
     * marginTop = (previousMenuItemN * arrowHeight)px + (previousMenuItemN * 1.25)em
     *
     * ### Example:
     * - currentArrowIndex = 3
     * - previousMenuItemN = 2 (3-1)
     * - arrowHeight: 21
     *
     * marginTop = (2 * 21)px + (2 * 1.25)em
     *
     * marginTop = 42px + 2.5em
     *
     * @param {number} currentArrowIndex Current arrowIndex state value
     */
    const calcPreviousArrowPosition = (currentArrowIndex) =>
      `calc(${(currentArrowIndex - 1) * arrowHeight}px + ${
        (currentArrowIndex - 1) * 1.25
      }em)`;

    /**
     * @method calcNextArrowPosition
     * @memberof Menu
     * @description Calculate and set marginTop of next `.menu__arrow` using the following equation:
     *
     * ### Equation:
     *
     * next arrow space position, plus the total of marginTops seperating each of the previous menu items
     *
     * ### Variables:
     * - currentArrowIndex: Current arrow index
     * - nextMenuItemIndex: Index of next menu item, getting this from the value of currentArrowIndex + 1
     * - arrowHeight: The current hight of `.menu__arrow`
     *
     * ### Syntax:
     *
     * marginTop = ((currentArrowIndex + 1) * arrowHeight)px + ((currentArrowIndex + 1) * 1.25)em
     *
     * marginTop = (nextMenuItemIndex * arrowHeight)px + (nextMenuItemIndex * 1.25)em
     *
     * ### Example:
     * - currentArrowIndex = 3
     * - nextMenuItemIndex = 4 (3+1)
     * - arrowHeight: 21
     *
     * marginTop = (4 * 21)px + (4 * 1.25)em
     *
     * marginTop = 84px + 5em
     *
     * @param {number} currentArrowIndex Current arrowIndex state value
     */
    const calcNextArrowPosition = (currentArrowIndex) =>
      `calc(${(currentArrowIndex + 1) * arrowHeight}px + ${
        (currentArrowIndex + 1) * 1.25
      }em)`;

    /** Switch handling Enter, ArrowUp and ArrowDown keydown events */
    switch (key) {
      case 'Enter':
        /** Rest `activeMenuItem` state,
         * because setting `activeMenuItem` to same `arrowIndex` (in case of clicking the same menu item without changing the arrow's position)
         * will NOT trigget the `activeMenuItem` useEffect handler in the component
         */
        setActiveMenuItem();

        /** Set activeMenuItem state to the current `arrowIndex` */
        setActiveMenuItem(arrowIndex);
        break;

      case 'ArrowUp':
        return setArrowIndex(
          // eslint-disable-next-line no-confusing-arrow
          (prevState) => {
            /** Rest `activeMenuItem` state,
             * because setting `activeMenuItem` to same `arrowIndex` (in case of clicking the same menu item without changing the arrow's position)
             * will NOT trigget the `activeMenuItem` useEffect handler in the component
             */
            setActiveMenuItem();

            /** If previous arrow index is equal to 0 or more, calculate marginTop of `.menu__arrow` and  */
            if (prevState - 1 >= 0) {
              arrowRef.current.style.marginTop =
                calcPreviousArrowPosition(prevState);

              /** Decrement arrowIndex by 1 */
              return prevState - 1;
            }

            /** If arrow is at the first menu component
             * (no previous menu items before it, explicitly: arrowIndex - 1 < 0)
             * return the current arrowIndex wich is 0
             */
            return prevState;
          }
        );

      case 'ArrowDown':
        return setArrowIndex((prevState) => {
          /** Rest `activeMenuItem` state,
           * because setting `activeMenuItem` to same `arrowIndex` (in case of clicking the same menu item without changing the arrow's position)
           * will NOT trigget the `activeMenuItem` useEffect handler in the component
           */
          setActiveMenuItem();

          /** If next arrow index is equal to the index of the last menu item or less,
           * calculate marginTop of `.menu__arrow` and set increment arrowIndex by 1
           */
          if (prevState + 1 <= menuItems.length - 1) {
            arrowRef.current.style.marginTop = calcNextArrowPosition(prevState);

            /** Increment arrowIndex by 1 */
            return prevState + 1;
          }

          /** If arrow is at the last menu component
           * (no next menu items after it, explicitly: arrowIndex + 1 > menuItems.length - 1)
           * return the current arrowIndex wich is menuItems.length - 1
           */
          return prevState;
        });

      default:
        break;
    }

    return null;
  };

  /**
   * @method useEffect
   * @memberof Menu
   * @listens keydown - keydownHandler
   * @description Adds and removes keydown event listener of keydownHanlder to and from the document
   * ### Dependencies: [`parentTerminalRef`, `terminalsRef`, `refIndex`, `disabled`, `arrowIndex`, `menuItems`]
   */
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
