import React, { useState, useRef, cloneElement, useLayoutEffect } from 'react';
import AboutTerminal from './components/AboutTerminal';

import Header from './components/Header';
import RoadMapTerminal from './components/RoadMapTerminal';
import Test from './components/Test';

import consoleLogDevInfo from './utils/cldi';

import './css/style.css';

function App() {
  const [testTerminal, setTestTerminal] = useState(false);

  const [aboutTerminal, setAboutTerminal] = useState(false);

  const [roadMapTerminal, setRoadMapTerminal] = useState(false);

  const terminalsRef = useRef([]);

  const Terminals = [
    <Test testTerminal={testTerminal} setTestTerminal={setTestTerminal} />,
    <AboutTerminal
      aboutTerminal={aboutTerminal}
      setAboutTerminal={setAboutTerminal}
    />,
    <RoadMapTerminal
      roadMapTerminal={roadMapTerminal}
      setRoadMapTerminal={setRoadMapTerminal}
    />,
  ];

  useLayoutEffect(() => {
    consoleLogDevInfo();
  }, []);

  return (
    <div className="App">
      <Header
        routes={[
          { title: 'Road-Map', action: () => setRoadMapTerminal(true) },
          { title: 'About', action: () => setAboutTerminal(true) },
          { title: 'Start', action: () => setTestTerminal(true) },
        ]}
      />
      {!testTerminal && !aboutTerminal && !roadMapTerminal && (
        <section id="app__welcome">
          <h1>Welcome!</h1>
          <p>This is a typing speed test</p>
          <p>
            <b>Here are some tips for you:</b>
          </p>
          <ul>
            <li>
              Most windows will allow you to <b>move</b> and <b>resize</b> them
            </li>
            <li>
              Multiple windows can be <b>kept opened</b> at the same time
            </li>
            <li>
              Menus support the use of <b>Arrow Keys</b> and <b>Enter</b>
            </li>
          </ul>
        </section>
      )}
      {Terminals.map(
        (terminal, index) =>
          cloneElement(terminal, {
            key: index,
            innerRef: (el) => {
              terminalsRef.current[index] = el;
            },
            refIndex: index,
            terminalsRef,
          })
        // eslint-disable-next-line function-paren-newline
      )}
    </div>
  );
}

export default App;
