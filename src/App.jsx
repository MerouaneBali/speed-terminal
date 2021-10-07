import React, { useState, useRef, cloneElement } from 'react';
import AboutTerminal from './components/AboutTerminal';

import Header from './components/Header';
import Test from './components/Test';

import './css/style.css';

function App() {
  const [testTerminal, setTestTerminal] = useState(false);

  const [aboutTerminal, setAboutTerminal] = useState(false);

  const terminalsRef = useRef([]);

  const Terminals = [
    <Test testTerminal={testTerminal} setTestTerminal={setTestTerminal} />,
    <AboutTerminal
      aboutTerminal={aboutTerminal}
      setAboutTerminal={setAboutTerminal}
    />,
  ];

  return (
    <div className="App">
      <Header
        home={() => {}}
        contact={() => {}}
        about={() => setAboutTerminal(true)}
        start={() => setTestTerminal(true)}
      />
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
