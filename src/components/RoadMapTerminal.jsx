import React from 'react';

import activateTerminal from '../utils/activateTerminal';

import Terminal from './Terminal';

import '../css/components/RoadMapTerminal.css';

/**
 * @component
 *
 * @description About us terminal
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the terminal
 * @prop {number} props.refIndex Index of current terminal in terminalsRef
 * @prop {object} props.terminalsRef Reference hook containing an array of terminals hooks
 * @prop {boolean} props.roadMapTerminal State of test terminal visiblity
 * @prop {function} props.setRoadMapTerminal Set roadMapTerminal state function
 *
 * @requires Terminal
 * @requires activateTerminal
 */
function RoadMapTerminal({
  innerRef,
  refIndex,
  terminalsRef,
  roadMapTerminal,
  setRoadMapTerminal,
}) {
  return (
    <Terminal
      innerRef={innerRef}
      refIndex={refIndex}
      terminalsRef={terminalsRef}
      id="road-map-terminal"
      title="Road Map"
      resizable
      visible={roadMapTerminal}
      unmountSelf={() => setRoadMapTerminal(false)}
      onMouseDown={() => activateTerminal(terminalsRef, refIndex)}
    >
      <section>
        <h1>Future Plans Overview:</h1>
        <p>Hi! Developer man here,</p>
        <p>
          For the next couple of months, I&apos;ll be working on the next major
          releases of this app, where in each release I&apos;ll include a
          detailed change log, the regular patchs and bug fixes, plus new
          awesome features that should spice thing up, so stay tuned.
        </p>
      </section>
      <section>
        <h1>Upcoming Features:</h1>
        <p>
          - <b>Settings:</b> Themes, fonts, sound effects...etc
        </p>
        <p>
          - <b>Accounts:</b> Saving and syncing your data
        </p>
        <p>
          - <b>Playground:</b> More typing oriented games to come
        </p>
        <p>
          - <b>Classroom:</b> Learn the correct techniques to type faster
        </p>
        <p>
          - <b>Community:</b> Resources from other users
        </p>
        <p>
          - <b>Mobile App:</b> To support mobile users
        </p>
      </section>
      <section>
        <h1>Known Issues:</h1>
        <ul>
          <li>
            Terminals open in the same location, thus ending up on top of each
            other
          </li>
        </ul>
      </section>
      <section>
        <h1>[META DATA]:</h1>
        <p>
          Posted: <b>11/10/2021</b>
        </p>
        <p>
          Edited: <b>11/10/2021</b>
        </p>
        <p>
          Change log: <b>N/A</b>
        </p>
      </section>
    </Terminal>
  );
}

export default RoadMapTerminal;
