import React, { useState, useRef, cloneElement } from 'react';
import AboutTerminal from './components/AboutTerminal';

import Header from './components/Header';
import RoadMapTerminal from './components/RoadMapTerminal';
import Test from './components/Test';

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

  return (
    <div className="App">
      <Header
        routes={[
          { title: 'Road-Map', action: () => setRoadMapTerminal(true) },
          { title: 'About', action: () => setAboutTerminal(true) },
          { title: 'Start', action: () => setTestTerminal(true) },
        ]}
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
