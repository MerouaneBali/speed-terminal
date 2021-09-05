import React, { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';

import mergeRefs from '../utils/mergeRefs';
import convertEmToPixels from '../utils/convertEmToPixels';

import Expand from '../svg/expand.svg';
import Minimize from '../svg/minimize.svg';
import Close from '../svg/close.svg';

import '../css/components/Terminal.css';

function Terminal({
  innerRef,
  id,
  className,
  visible,
  title,
  expandable,
  unmountSelf,
  children,
  onMouseDown,
}) {
  const terminalRef = useRef();

  const [expanded, setExpanded] = useState(false);

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

  useEffect(() => {
    const terminal = terminalRef.current;

    if (terminal) {
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
    }
  }, [terminalRef]);

  useEffect(() => {
    function dragMoveListener(event) {
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

    function resizeMoveListener(event) {
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
  }, []);

  return visible ? (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      id={id}
      className={`terminal${className ? ` ${className}` : ''}`}
      ref={mergeRefs(terminalRef, innerRef)}
      onMouseDown={onMouseDown}
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
