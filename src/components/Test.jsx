/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';

import TestTerminal from './TestTerminal';
import GenerateTestTerminal from './GenerateTestTerminal';

/**
 * @component
 *
 * @description Wrapper component containing {@link GenerateTestTerminal} and {@link TestTerminal}
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the terminal
 * @prop {number} props.refIndex Index of current terminal in terminalsRef
 * @prop {object} props.terminalsRef Reference hook containing an array of terminals hooks
 * @prop {boolean} props.testTerminal State of test terminal visiblity
 * @prop {function} props.setTestTerminal Set testTerminal state function
 *
 * @requires useState
 * @requires GenerateTestTerminal
 * @requires TestTerminal
 */
function Test({
  innerRef,
  refIndex,
  terminalsRef,
  testTerminal,
  setTestTerminal,
}) {
  const [state, setState] = useState('ready');
  const [duration, setDuration] = useState('01:00');
  const [gameMode, setGameMode] = useState(false);
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
      gameMode={gameMode}
      setGameMode={setGameMode}
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
      gameMode={gameMode}
    />
  );
}

export default Test;
