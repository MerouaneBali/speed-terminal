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

/**
 * @component
 *
 * @description Terminal menu to generate a typing speed test,
 * which is then used by {@link TestTerminal}
 *
 * - Select time
 * - Select topic
 * - Select casing
 * - Toggle backspace support
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the terminal
 * @prop {number} props.refIndex Index of current terminal in terminalsRef
 * @prop {object} props.terminalsRef Reference hook containing an array of terminals hooks
 * @prop {boolean} props.testTerminal State of test terminal visiblity
 * @prop {function} props.setTestTerminal Set testTerminal state function
 * @prop {function} props.setState Set state function
 * @prop {number} props.duration Duration state
 * @prop {function} props.setDuration Set duration state function
 * @prop {function} props.setGeneratedTestText Set generatedTestText state function
 *
 * @requires axios
 * @requires useState
 * @requires useRef
 * @requires useEffect
 * @requires activateTerminal
 * @requires getRandomTopic
 * @requires Terminal
 * @requires Menu
 * @requires MenuInput
 * @requires MenuCheckbox
 * @requires MenuSelect
 * @requires MenuButton
 * @requires SearchTopicTerminal
 */
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

  /**
   * @description Fetch summery of a topic based on `topic` state from Wikipedia's API
   *
   * **NOTE**: If `topic` is random, then pick a random topic using {@link getRandomTopic}
   *
   * @requires getRandomTopic
   *
   * @returns {Promise<string>} First page summery of said topic from Wikipedia
   */
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

  /**
   * @description Clean text (coming from Wikiedia API) from unwanted characters, and set to be
   * based on the `backspace` and `casing` configurations
   *
   * @param {string} text Text to be cleaned
   *
   * @returns Cleaned version of text coming from Wikipedia API
   */
  const cleanTextContent = (text) => {
    // eslint-disable-next-line no-param-reassign
    text = text
      /**
       * Split text by space to get an array of all words
       *
       * NOTE: Words that containt '\n' at the end will also be attached to the next word
       *
       * @example
       * const text = 'this is the line's end.\nNew line starts here'
       * text.split(' ') // ["this", "is", "the", "line's", "end\nNew", "line", "starts", "here"]
       */
      .split(' ')
      /** Map through the array of words */
      .map((word) => {
        /** if word includes `\n` */
        if (word.includes('\n')) {
          return (
            word
              /**
               * Split word by `\n` to get an array of real words,
               * since words that containt '\n' at the end will also be attached to the next word
               *
               * NOTE: Words with more multiple '\n' characters
               * will have empty strings replacing '\n' once splited
               *
               * @exmaple
               * const word = "end\nNew"
               * word.split('\n') // ["end", "New"]
               *
               * @exmaple
               * const word = "end\n\nNew\n"
               * word.split('\n') // ["end", "", "New", ""]
               */
              .split('\n')
              /** Removes any empty strings replacing '\n' characters from the array,
               * leaving only real words
               */
              .filter((innerWord) => innerWord)
              /** Map through inner words of word */
              .map(
                // eslint-disable-next-line no-confusing-arrow
                (innerWord, index) =>
                  /** If first inner word then return it
                   * with '↵' at the end if `backspace` is `true`
                   * or just as it is if `backspace` is `false`
                   *
                   * else if NOT the first inner word in the array just return it as it is
                   * */
                  !index ? `${innerWord}${backspace ? '↵' : ''}` : innerWord
              )
          );
        }

        /** if word does NOT include `\n` */
        return word;
      })
      /**
       *  Flatening array of words with all its sub-arrays of words that got splited because of '\n'
       *
       * @example
       * const text = ["this", "is", "the", "line's", ["end", "New"], "line", "starts", "here"]
       * text.flat() // ["this", "is", "the", "line's", "end", "New", "line", "starts", "here"]
       */
      .flat()
      /** Joining all words with space into a string of text */
      .join(' ');

    /** Convert text to lower case if `selectedCasing` value is 'lower-case' */
    // eslint-disable-next-line no-param-reassign
    text = selectedCasing === 'lower-case' ? text.toLowerCase() : text;

    return text;
  };

  /**
   * @description Geneterate test text and set its duration
   * - Fetch test text and pass it to `setTextContent`
   * - Convert duration text to seconds
   * - Set state to 'steady',
   *   unmounting {@link GenerateTestTerminal } and mountring {@link TestTerminal} in {@link Test}
   */
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

  /**
   * @method useEffect
   *
   * @memberof GenerateTestTerminal
   *
   * @description Set {@link SearchTopicTerminal} active attribute to `true`
   *
   * Dependencies: [`searchTopic`]
   */
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
