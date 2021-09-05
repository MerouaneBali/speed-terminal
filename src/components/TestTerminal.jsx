/* eslint-disable react/no-array-index-key */

import React, { useEffect, useRef, useState } from 'react';

import Terminal from './Terminal';

import '../css/components/TestTerminal.css';

function TestTerminal({
  innerRef,
  refIndex,
  terminalsRef,
  testTerminal,
  setTestTerminal,
}) {
  const [state, setState] = useState('ready');
  // eslint-disable-next-line no-unused-vars
  const [duration, setDuration] = useState(60);
  const [clock, setClock] = useState(duration);
  const [textContent, setTextContent] = useState([]);

  const textRef = useRef();
  const wordsRef = useRef([]);
  const charsRef = useRef([]);

  const timeRef = useRef();
  const wpmGrossRef = useRef();
  const wpmNetRef = useRef();
  const accuracyGrossRef = useRef();
  const accuracyNetRef = useRef();

  const getCharGlobalIndex = (wordIndex, charIndex, testText) =>
    // create an array containing the length of each word
    // ... while adding 1 for the space after the word unless its the last word in the text
    testText
      // creating an array containing each word in the text
      .split(' ')
      // returning the length of each word + 1 for the space at the end
      // ...unless it's the last word in the array,
      // ...or unless the last character in the word is ↵
      // ...preventing adding a space after a linebreak.
      .map(
        (wordText, index) =>
          wordText.length +
          (index < testText.split(' ').length - 1 && wordText.slice(-1) !== '↵'
            ? 1
            : 0)
      )
      // creating a new array from the previous one
      // ...starting from the first word in text untill the current word in the loop
      .slice(0, wordIndex)
      // Accumelating all word lengths starting from 0
      // ...then adding the current charIndex to get the current global char index
      .reduce((c, p) => c + p, 0) + charIndex;

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

  const loadTextContent = (testText) => {
    testText.split(' ').map((word, wordIndex) => {
      // eslint-disable-next-line no-param-reassign
      word = word.split(' ');

      word[0].slice(-1) !== '↵' &&
        wordIndex + 1 !== testText.split(' ').length &&
        word.push(' ');

      // eslint-disable-next-line no-param-reassign
      word = word.join('');

      const wordChild = (
        <span
          key={wordIndex}
          ref={(el) => {
            wordsRef.current[wordIndex] = el;
          }}
          className="word"
          data-word-index={wordIndex}
          data-children-index={getWordChildrenIndex(word, wordIndex, testText)}
          data-last-word={wordIndex + 1 === testText.split(' ').length}
        >
          {word.split('').map((char, charIndex) => {
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
                className={`char${!charGlobalIndex ? ' char--current' : ''}${
                  char === '↵' ? ' br' : ''
                }`}
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

      setTextContent((prevState) => [...prevState, wordChild]);

      return null;
    });
  };

  useEffect(() => {
    const testText =
      'Abdelkader ibn Muhieddine,↵ known as the Emir Abdelkader or Abdelkader El Hassani El Djazairi, was an Algerian religious and military leader who led a struggle against the French colonial invasion in the mid-19th century.';

    loadTextContent(testText);
  }, []);

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

    wpmGrossRef.current.innerText = `${Math.round(wpmGross)}`;
    wpmNetRef.current.innerText = `${Math.round(wpmNet)}`;
  };

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

    const accuracyGross = (wordsCorrect / wordsTyped) * 100;

    const accuracyNet = (charsCorrect / charsTyped) * 100;

    accuracyGrossRef.current.innerText = `${Math.round(accuracyGross)}%`;
    accuracyNetRef.current.innerText = `${Math.round(accuracyNet)}%`;
  };

  const keydownHandler = ({ key }) => {
    if (terminalsRef.current[refIndex].getAttribute('active') !== 'true') {
      return null;
    }

    // TODO:Figure out why key doesn't match keyboard input

    // TODO: use regexu to support old browsers that doesn't understand unicode ReGex
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

        state === 'ready' && setState('start');

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
        // TODO: Use the commented code block below in the future
        // ...to prevent going back to incorrect words in strict mode

        // const prevWord =
        //   wordsRef.current[
        //     parseInt(char.getAttribute('data-parent-word-index'), 10) - 1
        //   ];

        // const charLocalIndex = parseInt(
        //   char.getAttribute('data-char-local-index'),
        //   10
        // );

        // if (
        //   !charLocalIndex &&
        //   prevWord.classList.contains('word--incorrect')
        // ) {
        //   return null;
        // }

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

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);

    if (state === 'finish' || state === 'stop') {
      document.removeEventListener('keydown', keydownHandler);
    }

    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, [state, clock]);

  const activateTerminal = () => {
    terminalsRef.current[refIndex].setAttribute('active', true);

    terminalsRef.current.map(
      (terminal, index) =>
        terminal && index !== refIndex && terminal.setAttribute('active', false)
    );
  };

  return (
    <Terminal
      innerRef={innerRef}
      id="test-terminal"
      title="Test"
      expandable
      visible={testTerminal}
      unmountSelf={() => setTestTerminal(false)}
      onMouseDown={() => activateTerminal()}
    >
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

      <div id="test-terminal__results_panel">
        <div>
          <h2 ref={timeRef}>00:00</h2>
          <p>Time</p>
        </div>
        <div>
          <h2>
            <span ref={wpmGrossRef}>0</span>
            <span> | </span>
            <span ref={wpmNetRef}>0</span>
          </h2>
          <p>Words/Minute</p>
        </div>
        <div>
          <h2>
            <span ref={accuracyGrossRef}>0%</span>
            <span> | </span>
            <span ref={accuracyNetRef}>0%</span>
          </h2>
          <p>Acurracy</p>
        </div>
      </div>
    </Terminal>
  );
}

export default TestTerminal;
