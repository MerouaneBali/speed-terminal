import React, { useState } from 'react';

import Header from './components/Header';
import Terminal from './components/Terminal';

import './css/style.css';

function App() {
  const [terminal, setTerminal] = useState(true);

  return (
    <div className="App">
      <Header />
      <Terminal
        visible={terminal}
        expandable
        unmountSelf={() => setTerminal(false)}
      >
        <h1>About Lorem</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis
          corrupti eveniet, rem magni vero, at fuga explicabo, incidunt fugit
          pariatur inventore modi consectetur quod obcaecati!
        </p>
      </Terminal>
    </div>
  );
}

export default App;
