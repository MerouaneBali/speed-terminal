import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import activateTerminal from '../utils/activateTerminal';
import getRandomTopic from '../utils/getRandomTopic';

import Terminal from './Terminal';
import Menu from './Menu';
import MenuInput from './MenuInput';
import MenuCheckbox from './MenuCheckbox';
import MenuSelect from './MenuSelect';
import MenuButton from './MenuButton';
import SearchTopicTerminal from './SearchTopicTerminal';

import '../css/components/GenerateTestTerminal.css';

function GenerateTestTerminal({
  innerRef,
  refIndex,
  terminalsRef,
  testTerminal,
  setTestTerminal,
  setState,
  setGeneratedTestText,
  duration,
  setDuration,
}) {
  const [topic, setTopic] = useState('random');

  const searchTopicRef = useRef();
  const [searchTopic, setSearchTopic] = useState(false);

  const [backspace, setBackspace] = useState(true);

  const [casings, setCasings] = useState(['title-case', 'lower-case']);
  const [selectedCasing, setSelectedCasing] = useState(casings[0]);

  const fetchTextContent = async () => {
    if (topic === 'random') {
      return axios
        .get('/w/api.php', {
          params: {
            action: 'query',
            format: 'json',
            prop: 'extracts',
            exintro: 1,
            explaintext: 1,
            exchars: 1000,
            titles: getRandomTopic(),
          },
        })
        .then(({ data }) => {
          const { pages } = data.query;

          const pagesIds = Object.keys(pages);

          const firstPage = pages[pagesIds[0]].extract;

          return firstPage;
        });
    }

    return axios
      .get('/w/api.php', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'extracts',
          exintro: 1,
          explaintext: 1,
          exchars: 1000,
          titles: topic,
        },
      })
      .then(({ data }) => {
        const { pages } = data.query;

        const pagesIds = Object.keys(pages);

        const firstPage = pages[pagesIds[0]].extract;

        return firstPage;
      });
  };

  // eslint-disable-next-line no-unused-vars
  const cleanTextContent = (text) => {
    // eslint-disable-next-line no-param-reassign
    text = text
      .split(' ')
      .map((word) => {
        if (word.includes('\n')) {
          return (
            word
              .split('\n')
              .filter((innerWord) => innerWord)
              // eslint-disable-next-line no-confusing-arrow
              .map(
                // eslint-disable-next-line no-confusing-arrow
                (innerWord, index) =>
                  !index
                    ? [...innerWord, backspace ? '↵' : ''].join('')
                    : innerWord
                // eslint-disable-next-line function-paren-newline
              )
          );
        }

        return word;
      })
      .flat()
      .join(' ');

    // eslint-disable-next-line no-param-reassign
    text = selectedCasing === 'lower-case' ? text.toLowerCase() : text;

    return text;
  };

  const generateTest = async () => {
    const fetchedTextContent = await fetchTextContent();

    const cleanedTextContent = await cleanTextContent(fetchedTextContent);

    await setGeneratedTestText(cleanedTextContent);

    await setDuration((prevState) => {
      const durationString = prevState.split(':');

      const minutes = parseInt(durationString[0], 10);
      const seconds = parseInt(durationString[1], 10);

      return minutes * 60 + seconds;
    });

    await setState('steady');
  };

  useEffect(() => {
    searchTopic && searchTopicRef.current.setAttribute('active', true);
  }, [searchTopic]);

  const menuItems = [
    <MenuInput
      id="Time"
      label="Time"
      type="text"
      placeholder={duration}
      value={duration}
      setValue={setDuration}
    />,
    <MenuButton
      id="Topic"
      label={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <p className="topic">
          Topic: <span>{topic}</span>
        </p>
      }
      onClickHandler={() => setSearchTopic(true)}
    />,
    <MenuSelect
      id="Casing"
      label="Casing"
      options={casings}
      setOptions={setCasings}
      selectedOption={selectedCasing}
      setSelectedOption={setSelectedCasing}
    />,
    // <MenuCheckbox label="Digits" checked={digits} setChecked={setDigits} />,
    <MenuCheckbox
      id="Backspace"
      label="Backspace"
      checked={backspace}
      setChecked={setBackspace}
    />,
    // <MenuSelect
    //   label="Accuracy mode"
    //   options={accuracyModes}
    //   setOptions={setAccuracyModes}
    //   selectedOption={selectAccuracyMode}
    //   setSelectedOption={setSelectAccuracyMode}
    // />,
    <MenuButton
      id="Start test"
      label="Start test"
      // eslint-disable-next-line no-return-await
      onClickHandler={async () => await generateTest()}
    />,
  ];

  return (
    <>
      <Terminal
        innerRef={innerRef}
        id="generate-test-terminal"
        title="Generate Test"
        expandable={false}
        visible={testTerminal}
        disabled={searchTopic}
        unmountSelf={() => setTestTerminal(false)}
        // eslint-disable-next-line no-confusing-arrow
        onMouseDown={
          () => (searchTopic ? {} : activateTerminal(terminalsRef, refIndex))
          // eslint-disable-next-line react/jsx-curly-newline
        }
      >
        <Menu
          terminalsRef={terminalsRef}
          refIndex={refIndex}
          parentTerminalRef={terminalsRef.current[refIndex]}
          menuItems={menuItems}
          disabled={searchTopic}
        />
      </Terminal>

      <SearchTopicTerminal
        innerRef={searchTopicRef}
        refIndex={refIndex}
        terminalsRef={terminalsRef}
        searchTopic={searchTopic}
        setSearchTopic={setSearchTopic}
        topic={topic}
        setTopic={setTopic}
      />
    </>
  );
}

export default GenerateTestTerminal;
