/* eslint-disable no-param-reassign */
// @ts-nocheck
/* eslint-disable react/no-array-index-key */

import React, { useEffect, useRef, useState } from 'react';

import activateTerminal from '../utils/activateTerminal';

import Terminal from './Terminal';
import TestEndDialogTerminal from './TestEndDialogTerminal';

import '../css/components/TestTerminal.css';

/**
 * @component
 *
 * @description Terminal containing the test,
 * including the test text, duration, WPM and accuracy stats
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the terminal
 * @prop {number} props.refIndex Index of current terminal in terminalsRef
 * @prop {object} props.terminalsRef Reference hook containing an array of terminals hooks
 * @prop {boolean} props.testTerminal State of test terminal visiblity
 * @prop {function} props.setTestTerminal Set testTerminal state function
 * @prop {function} props.state State of the test
 * @prop {function} props.setState Set state function
 * @prop {number} props.duration Duration state
 * @prop {function} props.generatedTestText generatedTestText state
 *
 * @requires useState
 * @requires useRef
 * @requires useEffect
 * @requires Terminal
 * @requires TestEndDialogTerminal
 */
function TestTerminal({
  innerRef,
  refIndex,
  terminalsRef,
  testTerminal,
  setTestTerminal,
  state,
  setState,
  generatedTestText,
  duration,
}) {
  const [endDialog, setEndDialog] = useState(false);
  const endDialogRef = useRef();

  const [clock, setClock] = useState(duration);
  const [textContent, setTextContent] = useState([]);

  const textRef = useRef();
  const wordsRef = useRef([]);
  const charsRef = useRef([]);

  const timeRef = useRef();
  const wpmNetRef = useRef();
  const accuracyNetRef = useRef();

  /**
   * @description Get global index of character in text from its index in word parent
   * @param {number} wordIndex Word index in text
   * @param {number} charIndex Character index in word
   * @param {string} testText Text to work with
   * @returns {number} Index of character in text
   */
  const getCharGlobalIndex = (wordIndex, charIndex, testText) =>
    testText
      /** Create an array containing each word in the text */
      .split(' ')
      /**
       * Add a space at the end of each word
       * unless it's the last word in the text
       * or if the last character of the word is '↵' preventing adding a space after a linebreak
       */
      .map(
        (wordText, index) =>
          wordText.length +
          (index < testText.split(' ').length - 1 && wordText.slice(-1) !== '↵'
            ? 1
            : 0)
      )
      /**
       * create a new array from the previous one
       * starting from the first word in text untill
       * the word containing the target character
       */

      .slice(0, wordIndex)
      /**
       * Accumelate all word lengths starting from 0
       * then add `charIndex`, which is its index in the parent word
       * which then gives its global index in the text
       */
      .reduce((c, p) => c + p, 0) + charIndex;

  /**
   * @description Get an array of children characters global indexes of a word in text
   * @param {string} word Word target
   * @param {number} wordIndex Word index in text
   * @param {string} testText Text containing word
   * @returns {Array} Array of children characters global indexes of word
   */
  const getWordChildrenIndex = (word, wordIndex, testText) => {
    const wordChildrenIndex = word.split('').map((char, charIndex) => {
      const charGlobalIndex = getCharGlobalIndex(
        wordIndex,
        charIndex,
        testText
      );

      return charGlobalIndex;
    });

    return wordChildrenIndex;
  };

  /**
   * Create word and character elements to render on terminal
   * @param {string} testText Text to load and use as test
   */
  const loadTextContent = (testText) => {
    const textContentComponents = testText
      /** Create an array containing each word in the text */
      .split(' ')
      /** Loop through words array to create word elements */
      .map((word, wordIndex) => {
        /**
         * if the last character in the first word is NOT '↵'
         * and the next word after the current one is NOY the last word in text
         * then add a space to the end of word
         * otherwise leave the word as it is
         */
        word =
          word[0].slice(-1) !== '↵' &&
          wordIndex + 1 !== testText.split(' ').length
            ? `${word} `
            : word;

        const wordChild = (
          <span
            key={wordIndex}
            ref={(el) => {
              wordsRef.current[wordIndex] = el;
            }}
            className="word"
            data-word-index={wordIndex}
            data-children-index={getWordChildrenIndex(
              word,
              wordIndex,
              testText
            )}
            data-last-word={wordIndex + 1 === testText.split(' ').length}
          >
            {word
              /** Create an array of characters in word */
              .split('')
              /** Loop through words array to create character children elements */
              .map((char, charIndex) => {
                const charGlobalIndex = getCharGlobalIndex(
                  wordIndex,
                  charIndex,
                  testText
                );

                return (
                  <span
                    key={charIndex}
                    ref={(el) => {
                      charsRef.current[charGlobalIndex] = el;
                    }}
                    className={`char${
                      !charGlobalIndex ? ' char--current' : ''
                    }${char === '↵' ? ' br' : ''}`}
                    data-char-local-index={charIndex}
                    data-char-global-index={charGlobalIndex}
                    data-last-char={charIndex + 1 === word.split('').length}
                    data-parent-word-index={wordIndex}
                  >
                    {char}
                  </span>
                );
              })}
          </span>
        );

        return wordChild;
      });

    /** Set text content state to the text content componenets created, to be then rendered */
    setTextContent(textContentComponents);
  };

  /** Calculate gross and net words typed per minute
   * and update WPM paragraph element accordingly
   */
  const calcWPM = () => {
    const minutes = (duration - clock) / 60;

    const wordsIncorrect = parseInt(
      textRef.current.getAttribute('data-incorrect-words'),
      10
    );

    const wordsTyped = parseInt(
      textRef.current.getAttribute('data-typed-words'),
      10
    );

    const wpmGross = wordsTyped / minutes;

    const wpmNet = wpmGross - wordsIncorrect / minutes;

    // wpmGrossRef.current.innerText = `${Math.round(wpmGross)}`;
    wpmNetRef.current.innerText = `${Math.round(wpmNet)}`;
  };

  /**
   * Calculate gross and net accuracy of words typed
   * and update accuracy paragraph element accordingly
   */
  const calcAccuracy = () => {
    const wordsCorrect = parseInt(
      textRef.current.getAttribute('data-correct-words'),
      10
    );

    const wordsTyped = parseInt(
      textRef.current.getAttribute('data-typed-words'),
      10
    );

    const charsCorrect = parseInt(
      textRef.current.getAttribute('data-correct-chars'),
      10
    );

    const charsTyped = parseInt(
      textRef.current.getAttribute('data-typed-chars'),
      10
    );

    // eslint-disable-next-line no-unused-vars
    const accuracyGross = (wordsCorrect / wordsTyped) * 100;

    const accuracyNet = (charsCorrect / charsTyped) * 100;

    // accuracyGrossRef.current.innerText = `${Math.round(accuracyGross)}%`;
    accuracyNetRef.current.innerText = `${Math.round(accuracyNet)}%`;
  };

  /**
   * Reset all states and attributes of the test
   */
  const restart = async () => {
    /** Set state of test to restart,
     * overriding 'finish' and 'stop' states
     * allowing this method to change states that are used in other lifecycles methods
     * without them firing any events
     */
    await setState('restart');

    const text = textRef.current;

    text.setAttribute('data-caret-position', -1);
    text.setAttribute('data-typed-chars', 0);
    text.setAttribute('data-correct-chars', 0);
    text.setAttribute('data-incorrect-chars', 0);
    text.setAttribute('data-typed-words', 0);
    text.setAttribute('data-correct-words', 0);
    text.setAttribute('data-incorrect-words', 0);

    await wordsRef.current.map(async (word) => {
      word.classList.remove(
        'word--current',
        'word--typed',
        'word--correct',
        'word--incorrect'
      );

      word
        .getAttribute('data-children-index')
        .split(',')
        .map((charIndex) => charsRef.current[parseInt(charIndex, 10)])
        .map(
          (character) =>
            character.classList.remove(
              'char--current',
              'char--typed',
              'char--correct',
              'char--incorrect'
            )
          // eslint-disable-next-line function-paren-newline
        );

      return null;
    });

    charsRef.current[0].classList.add('char--current');

    await setClock(duration);

    timeRef.current.style.color = 'white';
    wpmNetRef.current.innerText = '0';
    accuracyNetRef.current.innerText = '0%';

    await setState('steady');

    await setEndDialog(false);
  };

  /**
   * Set state of test to 'ready',
   * unmounting this component and mountring {@link GenerateTestTerminal}
   */
  const generateNewTest = () => setState('ready');

  /**
   * setState to 'ready' reseting the test to "generate test" phane,
   * and setting testTerminal state to false unmounting the component
   */
  const unmountSelf = () => {
    setState('ready');
    setTestTerminal(false);
  };

  /**
   * @description Handle printable keydown events, the backspace and enter are an exception
   * - Calculate WPM and accuracy on each typed character and word
   * - Change the style of the typed characters and words
   * - Handle "delete" actions
   *
   * @param {object} event Event object
   * @param {string} event.key Key name representing the the key pressed down
   */
  const keydownHandler = ({ key }) => {
    const terminal = terminalsRef.current[refIndex];

    /** If terminal active attribute is not set to `true` return and exit method */
    if (terminal && terminal.getAttribute('active') !== 'true') {
      return null;
    }

    // TODO:Figure out why `key` doesn't match keyboard input

    // TODO: use regexu to support old browsers that don't understand unicode ReGex
    if (key.match(/^[^\p{Cc}\p{Cn}\p{Cs}\p{Cf}]$|^\bEnter\b$/gu)) {
      const prevCaretPosition = parseInt(
        textRef.current.getAttribute('data-caret-position'),
        10
      );

      const caretPosition = prevCaretPosition + 1;

      const char = charsRef.current[caretPosition];

      char.classList.remove('char--current', 'char--incorrect');

      char.classList.add('char--typed');

      const typedChars = parseInt(
        textRef.current.getAttribute('data-typed-chars'),
        10
      );

      textRef.current.setAttribute('data-typed-chars', typedChars + 1);

      if (
        key === char.innerText ||
        (key === 'Enter' && char.innerText === '↵')
      ) {
        char.classList.add('char--correct');

        state === 'steady' && setState('start');

        const correctChars = parseInt(
          textRef.current.getAttribute('data-correct-chars'),
          10
        );

        textRef.current.setAttribute('data-correct-chars', correctChars + 1);
      } else {
        char.classList.add('char--incorrect');

        const incorrectChars = parseInt(
          textRef.current.getAttribute('data-incorrect-chars'),
          10
        );

        textRef.current.setAttribute(
          'data-incorrect-chars',
          incorrectChars + 1
        );
      }

      textRef.current.setAttribute('data-caret-position', caretPosition);

      const nextChar = charsRef.current[caretPosition + 1];

      nextChar && nextChar.classList.add('char--current');

      const parentWord =
        wordsRef.current[
          parseInt(char.getAttribute('data-parent-word-index'), 10)
        ];

      if (char.getAttribute('data-last-char') === 'true') {
        if (parentWord.getAttribute('data-last-word') === 'true') {
          setState('finish');
        } else {
          parentWord.classList.add('word--typed');

          const typedWords = parseInt(
            textRef.current.getAttribute('data-typed-words'),
            10
          );

          textRef.current.setAttribute('data-typed-words', typedWords + 1);

          calcWPM();

          calcAccuracy();

          const childrenIndex = parentWord
            .getAttribute('data-children-index')
            .split(',');

          const incorrectCharChildren = childrenIndex.filter((charIndex) => {
            const childChar = charsRef.current[parseInt(charIndex, 10)];
            return childChar.classList.contains('char--incorrect') && childChar;
          });

          if (incorrectCharChildren.length) {
            parentWord.classList.add('word--incorrect');

            const incorrectWords = parseInt(
              textRef.current.getAttribute('data-incorrect-words'),
              10
            );

            textRef.current.setAttribute(
              'data-incorrect-words',
              incorrectWords + 1
            );
          } else {
            parentWord.classList.add('word--correct');

            const correctWords = parseInt(
              textRef.current.getAttribute('data-correct-words'),
              10
            );

            textRef.current.setAttribute(
              'data-correct-words',
              correctWords + 1
            );
          }
        }
      }
    } else if (key.match(/^\bBackspace\b$/)) {
      const prevCaretPosition = parseInt(
        textRef.current.getAttribute('data-caret-position'),
        10
      );

      const caretPosition = prevCaretPosition + 1;

      const char = charsRef.current[caretPosition];
      const prevChar = charsRef.current[prevCaretPosition];

      if (prevChar) {
        const prevWord =
          wordsRef.current[
            parseInt(char.getAttribute('data-parent-word-index'), 10) - 1
          ];

        const charLocalIndex = parseInt(
          char.getAttribute('data-char-local-index'),
          10
        );

        if (!charLocalIndex && prevWord.classList.contains('word--correct')) {
          prevWord.classList.remove('word--correct');

          const correctWords = parseInt(
            textRef.current.getAttribute('data-correct-words'),
            10
          );

          textRef.current.setAttribute('data-correct-words', correctWords - 1);
        } else if (
          !charLocalIndex &&
          prevWord.classList.contains('word--incorrect')
        ) {
          prevWord.classList.remove('word--incorrect');

          const incorrectWords = parseInt(
            textRef.current.getAttribute('data-incorrect-words'),
            10
          );

          textRef.current.setAttribute(
            'data-incorrect-words',
            incorrectWords - 1
          );
        }

        if (prevChar.classList.contains('char--correct')) {
          const correctChars = parseInt(
            textRef.current.getAttribute('data-correct-chars'),
            10
          );

          textRef.current.setAttribute('data-correct-chars', correctChars - 1);
        } else if (prevChar.classList.contains('char--incorrect')) {
          const incorrectChars = parseInt(
            textRef.current.getAttribute('data-incorrect-chars'),
            10
          );

          textRef.current.setAttribute(
            'data-incorrect-chars',
            incorrectChars - 1
          );
        }

        char.classList.remove('char--current');

        prevChar.classList.remove(
          'char--typed',
          'char--correct',
          'char--incorrect'
        );

        prevChar.classList.add('char--current');

        textRef.current.setAttribute(
          'data-caret-position',
          prevCaretPosition - 1
        );

        const typedChars = parseInt(
          textRef.current.getAttribute('data-typed-chars'),
          10
        );

        textRef.current.setAttribute('data-typed-chars', typedChars - 1);

        if (!charLocalIndex && prevWord) {
          const typedWords = parseInt(
            textRef.current.getAttribute('data-typed-words'),
            10
          );

          textRef.current.setAttribute('data-typed-words', typedWords - 1);
        }
      }
    }
    return null;
  };

  /**
   * @method useEffect
   * @memberof TestTerminal
   * @description Loads test text once `genereatedTestText` is available
   * Dependencies: [`generatedTestText`]
   */
  useEffect(() => {
    generatedTestText &&
      generatedTestText !== undefined &&
      generatedTestText !== '' &&
      loadTextContent(generatedTestText);
  }, [generatedTestText]);

  /**
   * @method useEffect
   * @memberof TestTerminal
   * @description Keep track of time and update time paragraph element accordingly
   * ### Dependencies: [`state`, `clock`]
   */
  useEffect(() => {
    let intervalId;

    if (state === 'start') {
      intervalId = setInterval(() => {
        if (state !== 'pause') {
          setClock((prevState) => prevState - 1);

          const remaning = new Date(clock * 1000).toISOString().substr(14, 5);

          if (remaning === '00:00') {
            setState('stop');
          } else {
            timeRef.current.innerText = remaning;
          }
        }
      }, 1000);
    } else if (state === 'finish') {
      clearInterval(intervalId);
      timeRef.current.style.color = 'green';
    } else if (state === 'stop') {
      clearInterval(intervalId);
      timeRef.current.innerText = '00:00'; // "TIME IS OVER.";
      timeRef.current.style.color = 'red';
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [state, clock]);

  /**
   * @method useEffect
   * @memberof TestTerminal
   * @listens keydown - keydownHandler
   * @description Adds and removes keydown event listener of keydownHanlder to and from the document
   * ### Dependencies: [`state`, `clock`]
   */
  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);

    /**
     * Once test is finished or stoped:
     * - remove keydown event listener
     * - calculate WPM and accuracy
     * - Make end dialog visible by setting `endDialog` state to `true`
     */
    if (state === 'finish' || state === 'stop') {
      document.removeEventListener('keydown', keydownHandler);
      calcWPM();
      calcAccuracy();
      setEndDialog(true);
    }

    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, [state, clock]);

  return (
    <>
      <Terminal
        innerRef={innerRef}
        refIndex={refIndex}
        terminalsRef={terminalsRef}
        id="test-terminal"
        title="Test"
        expandable
        initSize="expanded"
        visible={testTerminal}
        unmountSelf={unmountSelf}
        onMouseDown={() => activateTerminal(terminalsRef, refIndex)}
      >
        <div id="test-terminal__text_container">
          <p
            ref={textRef}
            data-caret-position="-1"
            data-typed-chars="0"
            data-correct-chars="0"
            data-incorrect-chars="0"
            data-typed-words="0"
            data-correct-words="0"
            data-incorrect-words="0"
          >
            {[...textContent]}
          </p>
        </div>

        <div id="test-terminal__results_panel">
          <div>
            <h2 ref={timeRef}>00:00</h2>
            <p>Time</p>
          </div>
          <div>
            <h2 ref={wpmNetRef}>0</h2>
            <p>Words/Minute</p>
          </div>
          <div>
            <h2 ref={accuracyNetRef}>0</h2>
            <p>Acurracy</p>
          </div>
        </div>
      </Terminal>

      <TestEndDialogTerminal
        innerRef={endDialogRef}
        refIndex={refIndex}
        terminalsRef={terminalsRef}
        endDialog={endDialog}
        setEndDialog={setEndDialog}
        restart={restart}
        generateNewTest={generateNewTest}
      />
    </>
  );
}

export default TestTerminal;
