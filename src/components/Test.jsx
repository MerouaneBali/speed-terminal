/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';

import TestTerminal from './TestTerminal';
import GenerateTestTerminal from './GenerateTestTerminal';

function Test({
  innerRef,
  refIndex,
  terminalsRef,
  testTerminal,
  setTestTerminal,
}) {
  const [state, setState] = useState('ready');
  const [duration, setDuration] = useState('01:00');
  const [generatedTestText, setGeneratedTestText] = useState();

  return state === 'ready' ? (
    <GenerateTestTerminal
      innerRef={innerRef}
      refIndex={refIndex}
      terminalsRef={terminalsRef}
      testTerminal={testTerminal}
      setTestTerminal={setTestTerminal}
      setState={setState}
      setGeneratedTestText={setGeneratedTestText}
      duration={duration}
      setDuration={setDuration}
    />
  ) : (
    <TestTerminal
      innerRef={innerRef}
      refIndex={refIndex}
      terminalsRef={terminalsRef}
      testTerminal={testTerminal}
      setTestTerminal={setTestTerminal}
      state={state}
      setState={setState}
      generatedTestText={generatedTestText}
      duration={duration}
    />
  );
}

export default Test;
