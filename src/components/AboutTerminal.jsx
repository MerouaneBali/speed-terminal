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
      expandable
      resizable
      initSize="expanded"
      visible={aboutTerminal}
      unmountSelf={() => setAboutTerminal(false)}
      onMouseDown={() => activateTerminal(terminalsRef, refIndex)}
    >
      <section>
        <h1>What is this app for:</h1>
        <p>
          We believe that every business with a website needs tools to
          communicate with its customers. LiveChat fills in for phone calls,
          which are time-consuming and for e-mails, which tend to be slow.
        </p>
        <p>
          That’s why we created LiveChat – an application that enables the
          visitors on your site to chat live with your customer support. It’s a
          solution dedicated for e-commerce and customer care.
        </p>
        <p>
          Unique greetings and powerful reporting are just some of our features
          that will aid you in your day-to-day business activities.
        </p>
        <p>
          Over <b>33,000</b> happy customers rely on LiveChat in their everyday
          duties. Some of them shared their thoughts about our product.
        </p>
        <p>
          We encourage you to try our live chat software yourself! Just give us
          a shot and take LiveChat for a <b>free test drive</b>.
        </p>
      </section>

      <section>
        <h1>Who are we:</h1>
        <p>
          We’re a team of 100+ passionate people developing and supporting the
          most efficient and easy-to-use live chat software for business. What
          we enjoy the most is seeing our customer’s business grow with the help
          of our product.
        </p>
      </section>

      <section>
        <h1>What’s our mission:</h1>
        <p>
          We’ve built LiveChat on the idea that helping others is as much
          important as creating a great product. While turning simple live chat
          app into a robust business platform, we’ve gained tons of knowledge
          about growth and customer relations. Our mission is to share our
          knowledge, bring personal touch to online communication and never stop
          loving what we do.
        </p>
      </section>
    </Terminal>
  );
}

export default AboutTerminal;
