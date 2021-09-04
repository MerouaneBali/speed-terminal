import React, { useState } from 'react';

import Header from './components/Header';
import TestTerminal from './components/TestTerminal';

import './css/style.css';

function App() {
  const [testTerminal, setTestTerminal] = useState(true);

  return (
    <div className="App">
      <Header />
      <TestTerminal
        testTerminal={testTerminal}
        setTestTerminal={setTestTerminal}
      />
    </div>
  );
}

export default App;
