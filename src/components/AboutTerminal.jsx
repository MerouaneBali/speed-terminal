import React from 'react';

import activateTerminal from '../utils/activateTerminal';

import Terminal from './Terminal';

import '../css/components/AboutTerminal.css';

/**
 * @component
 *
 * @description About us terminal
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the terminal
 * @prop {number} props.refIndex Index of current terminal in terminalsRef
 * @prop {object} props.terminalsRef Reference hook containing an array of terminals hooks
 * @prop {boolean} props.aboutTerminal State of test terminal visiblity
 * @prop {function} props.setAboutTerminal Set aboutTerminal state function
 *
 * @requires Terminal
 * @requires activateTerminal
 */
function AboutTerminal({
  innerRef,
  refIndex,
  terminalsRef,
  aboutTerminal,
  setAboutTerminal,
}) {
  return (
    <Terminal
      innerRef={innerRef}
      refIndex={refIndex}
      terminalsRef={terminalsRef}
      id="about-terminal"
      title="About Us"
      resizable
      visible={aboutTerminal}
      unmountSelf={() => setAboutTerminal(false)}
      onMouseDown={() => activateTerminal(terminalsRef, refIndex)}
    >
      <section>
        <h1>Speed Terminal v0.1 [BETA]</h1>
        <p>
          Developed with{' '}
          <span style={{ fontFamily: 'sans-serif' }}>&#10084;&#65039;</span>
          {/* by Merouane Bali */}
        </p>
        <p>
          <b>By:</b> Merouane Bali
        </p>
        <p>
          <b>Contact:</b> <a
          href="mailto:merouane.bali.inbox@gmail.com"
        >  merouane.bali.inbox@gmail.com</a>
        </p>
        <p>
          <b>Website:</b> <a
          href="https://merouane-bali.netlify.app"
          target="_blank"
          rel="noreferrer"
        >  merouane-bali.netlify.app</a>
        </p>
        <p>
          <b>GitHub:</b> <a
          href="https://github.com/MerouaneBali/speed-terminal"
          target="_blank"
          rel="noreferrer"
        > Main Repository</a>
        </p>
      </section>
      <section>
        <h1>What is this app for:</h1>
        <p>
          Speed Terminal is a web app project aimed to teach computer users to
          type fast on their keyboards. By offering an easy-to-use interface,
          and an fun interactive experiance where users won&apos;t feel
          intemidated by the end goal of learning to tyoe fast.
        </p>
      </section>
    </Terminal>
  );
}

export default AboutTerminal;
