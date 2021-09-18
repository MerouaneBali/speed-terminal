import React, { useState, useRef, cloneElement } from 'react';

import Header from './components/Header';
import Test from './components/Test';

import './css/style.css';

function App() {
  const [testTerminal, setTestTerminal] = useState(true);

  const terminalsRef = useRef([]);

  const Terminals = [
    <Test testTerminal={testTerminal} setTestTerminal={setTestTerminal} />,
  ];

  return (
    <div className="App">
      <Header
        home={() => {}}
        contact={() => {}}
        about={() => {}}
        community={() => {}}
        playground={() => {}}
        start={() => {}}
        account={() => {}}
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
