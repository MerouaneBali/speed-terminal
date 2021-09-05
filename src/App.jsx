import React, { useState, useRef, cloneElement } from 'react';

import Header from './components/Header';
import TestTerminal from './components/TestTerminal';

import './css/style.css';

function App() {
  const [testTerminal, setTestTerminal] = useState(true);
  const [testTerminal2, setTestTerminal2] = useState(true);
  const [testTerminal3, setTestTerminal3] = useState(true);

  const terminalsRef = useRef([]);

  const Terminals = [
    <TestTerminal
      testTerminal={testTerminal}
      setTestTerminal={setTestTerminal}
    />,
    <TestTerminal
      testTerminal={testTerminal2}
      setTestTerminal={setTestTerminal2}
    />,
    <TestTerminal
      testTerminal={testTerminal3}
      setTestTerminal={setTestTerminal3}
    />,
  ];

  return (
    <div className="App">
      <Header />
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
