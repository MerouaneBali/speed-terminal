import React, { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';

import mergeRefs from '../utils/mergeRefs';
import convertEmToPixels from '../utils/convertEmToPixels';

import Expand from '../svg/expand.svg';
import Minimize from '../svg/minimize.svg';
import Close from '../svg/close.svg';

import activateTerminal from '../utils/activateTerminal';

import '../css/components/Terminal.css';
import getTransformValue from '../utils/getTransformValue';

/**
 * @component
 *
 * @description Terminal component
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the terminal
 * @prop {number} props.refIndex Index of current terminal in terminalsRef
 * @prop {object} props.terminalsRef Reference hook containing an array of terminals hooks
 * @prop {string} props.id Id for div container
 * @prop {string} props.className className for div container
 * @prop {boolean} props.visible Visible state of terminal
 * @prop {boolean} props.active Active state of terminal
 * @prop {boolean} props.disabled Disabled state of terminal
 * @prop {string} props.title Title of terminal
 * @prop {boolean} props.expandable Expand button visibility state
 * @prop {boolean} props.resizable Resize condition used by `resizeMoveListener()`,
 * defaults to `true`
 * @prop {string|object} props.initSize Initial size of terminal
 * @prop {function} props.unmountSelf Unmount function of terminal, setting terminal state to false
 * @prop {function} props.onMouseDown On mouse down function of terminal
 * setting its `active` attribute of terminal to `true`
 * @prop {object} props.children Children of terminal to render in '.terminal__body'
 */
function Terminal({
  innerRef,
  refIndex,
  terminalsRef,
  id,
  className,
  visible,
  active,
  disabled,
  title,
  expandable,
  resizable,
  initSize,
  unmountSelf,
  children,
  onMouseDown,
}) {
  const terminalRef = useRef();

  const [expanded, setExpanded] = useState(initSize === 'expanded');

  /** Expand terminal and set prev-height, prev-width and prev-transform attributes
   *  to be used to minimize it back to it's previous size */
  const expand = () => {
    const terminal = terminalRef.current;

    terminal.setAttribute(
      'prev-height',
      window.getComputedStyle(terminal).height
    );
    terminal.setAttribute(
      'prev-width',
      window.getComputedStyle(terminal).width
    );
    terminal.setAttribute(
      'prev-transform',
      window.getComputedStyle(terminal).transform
    );

    // TODO: add transition animation using JS

    // NOTE: CSS calculated
    // terminal.style.top = '50%';
    // terminal.style.left = '50%';
    // terminal.style.height = 'calc(100vh - 2 * 2.5em)';
    // terminal.style.width = 'calc(100vw - 2 * 2.5em)';
    // terminal.style.transform = 'translate(-50%, -50%)';

    // NOTE: JS calculated
    terminal.style.top = `${document.body.offsetHeight / 2}px`;
    terminal.style.left = `${document.body.offsetWidth / 2}px`;
    terminal.style.height = `${
      document.body.offsetHeight - convertEmToPixels(2 * 2.5)
    }px`;
    terminal.style.width = `${
      document.body.offsetWidth - convertEmToPixels(2 * 2.5)
    }px`;
    terminal.style.transform = `translate(-${terminal.offsetWidth / 2}px, -${
      terminal.offsetHeight / 2
    }px)`;
  };

  /** Minimize terminal to it's previous size */
  const minimize = () => {
    const terminal = terminalRef.current;

    const prevHeight = terminal.getAttribute('prev-height');
    const prevWidth = terminal.getAttribute('prev-width');
    const prevTransform = terminal.getAttribute('prev-transform');

    // TODO: add transition animation using JS
    terminal.style.top = '';
    terminal.style.left = '';
    terminal.style.height = prevHeight;
    terminal.style.width = prevWidth;
    terminal.style.transform = prevTransform;
  };

  /**
   * @method useEffect
   * @memberof Terminal
   * @description Set terminal's `active` attribute to `true` once visible
   * ### Dependencies: [`visible`, `terminalsRef`, `refIndex`]
   */
  useEffect(() => {
    visible && activateTerminal(terminalsRef, refIndex);
  }, [visible, terminalsRef, refIndex]);

  /**
   * @method useEffect
   * @memberof Terminal
   * @description Load initial size of terminal once visible,
   * and set prev-height, prev-width and prev-transform attributes
   * ### Dependencies: [`terminalRef`, `visible`]
   */
  useEffect(() => {
    const terminal = terminalRef.current;

    if (visible) {
      if (initSize) {
        if (initSize === 'expanded') {
          expand();
        } else {
          terminal.height = initSize.height;
          terminal.width = initSize.width;
        }
      }

      if (terminal) {
        if (initSize === 'expanded') {
          terminal.setAttribute('prev-height', '50%');
          terminal.setAttribute('prev-width', '50%');
        } else {
          terminal.setAttribute(
            'prev-height',
            window.getComputedStyle(terminal).height
          );
          terminal.setAttribute(
            'prev-width',
            window.getComputedStyle(terminal).width
          );

          terminal.setAttribute('data-x', getTransformValue(terminal, 'm41'));
          terminal.setAttribute('data-y', getTransformValue(terminal, 'm42'));
          terminal.setAttribute(
            'prev-transform',
            window.getComputedStyle(terminal).transform
          );
        }
      }
    }
  }, [terminalRef, visible]);

  /**
   * @method useEffect
   * @memberof SearchTopicTerminal
   * @listens dragMoveListener
   * @listens doubletap
   * @description Adds dragMoveListener and doubletap event listeners
   * to and from the search input (`Input`)
   * ### Dependencies: [`visible`, `disabled`]
   */
  useEffect(() => {
    function dragMoveListener(event) {
      if (!disabled) {
        const { target } = event;

        // keep the dragged position in the data-x/data-y attributes
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.transform = `translate(${x}px, ${y}px)`;

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    }

    function resizeMoveListener(event) {
      if (!disabled && resizable) {
        const { target } = event;

        let x = parseFloat(target.getAttribute('data-x')) || 0;
        let y = parseFloat(target.getAttribute('data-y')) || 0;

        // update the element's style
        target.style.width = `${event.rect.width}px`;
        target.style.height = `${event.rect.height}px`;

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.transform = `translate(${x}px, ${y}px)`;

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    }

    visible &&
      interact(terminalRef.current)
        .draggable({
          // enable inertial throwing
          inertia: true,

          // keep the element within the area of it's parent
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: 'parent',
              endOnly: true,
            }),
          ],

          // enable autoScroll
          autoScroll: true,

          listeners: {
            // call this function on every dragmove event
            move: dragMoveListener,

            // eslint-disable-next-line max-len
            // TODO: Add "end" listener to put back the target to the viewport if it was let go outside it.
          },
        })
        .resizable({
          inertia: false,

          modifiers: [
            // keep the edges inside the parent
            interact.modifiers.restrictEdges({
              outer: 'parent',
            }),

            // minimum and maximum size
            interact.modifiers.restrictSize({
              min: { width: 100, height: 50 },
              max: {
                height: window.innerHeight - convertEmToPixels(2.5) * 2,
                width: window.innerWidth - convertEmToPixels(2.5) * 2,
              },
            }),
          ],

          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },

          listeners: {
            move: resizeMoveListener,
          },
        })
        .on('doubletap', (event) => {
          // TODO: Toggle expand() and minimize()
          event.preventDefault();
        });

    window.dragMoveListener = dragMoveListener;
  }, [visible, disabled]);

  /**
   * @method useEffect
   * @memberof Terminal
   * @description Set active attribute of terminal to false if `disabled`
   * ### Dependencies: [`disabled`]
   */
  useEffect(() => {
    const terminal = terminalRef.current;

    if (terminal) {
      if (disabled) {
        terminal.setAttribute('active', false);
      } else {
        terminal.setAttribute('active', true);
      }
    }
  }, [disabled]);

  return visible ? (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      id={id}
      className={`terminal${className ? ` ${className}` : ''}`}
      ref={mergeRefs(terminalRef, innerRef)}
      onMouseDown={onMouseDown}
      active={active || 'false'}
    >
      <div className="terminal__header">
        <p>{title || 'Terminal'}</p>
        {expandable && (
          <button
            type="button"
            onClick={() => {
              expanded ? minimize() : expand();
              setExpanded((prevState) => !prevState);
            }}
          >
            <img
              src={expanded ? Minimize : Expand}
              alt=""
              height="32px"
              width="32px"
            />
          </button>
        )}
        <button type="button" onClick={() => unmountSelf()}>
          <img src={Close} alt="" height="32px" width="32px" />
        </button>
      </div>
      <div className="terminal__body">{children}</div>
      <div className="terminal__overlay" />
    </div>
  ) : (
    <></>
  );
}

export default Terminal;
