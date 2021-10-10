import axios from 'axios';

import React, { useState, useRef, useEffect } from 'react';

import '../css/components/SearchTopicTerminal.css';

import Terminal from './Terminal';
import Input from './Input';
import Menu from './Menu';
import MenuButton from './MenuButton';

/**
 * @component
 *
 * @description Terminal to search and pick test topic from Wikipedia API
 * which is then used by {@link TestTerminal}
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the terminal
 * @prop {number} props.refIndex Index of current terminal in terminalsRef
 * @prop {object} props.terminalsRef Reference hook containing an array of terminals hooks
 * @prop {boolean} props.searchTopic State of search topic terminal visiblity
 * @prop {function} props.setSearchTopic Set searchTopic state function
 * @prop {number} props.topic Topic state
 * @prop {function} props.setTopic Set topic state function
 *
 * @requires axios
 * @requires useState
 * @requires useRef
 * @requires useEffect
 * @requires Terminal
 * @requires Input
 * @requires Menu
 * @requires MenuButton
 */
function SearchTopicTerminal({
  innerRef,
  refIndex,
  terminalsRef,
  searchTopic,
  setSearchTopic,
  topic,
  setTopic,
}) {
  const [search, setSearch] = useState('random');

  const [searchResults, setSearchResults] = useState([]);

  const searchRef = useRef();

  const styles = {
    searchResult: {
      fontWeight: '400',
    },
  };

  /** Focus search input (`Input`) on blur */
  const onBlurHandler = () => {
    searchTopic && searchRef.current && searchRef.current.focus();
  };

  /**
   * @method useEffect
   * @memberof SearchTopicTerminal
   * @listens blur - onBlurHandler
   * @description Adds and removes blur event listener of {@link onBlurHandler}
   * to and from the search input (`Input`)
   * ### Dependencies: [`searchTopic`, `searchRef`]
   */
  useEffect(() => {
    searchTopic &&
      searchRef.current &&
      searchRef.current.addEventListener('blur', onBlurHandler);

    searchTopic && searchRef.current && searchRef.current.focus();

    return () => {
      searchTopic &&
        searchRef.current &&
        searchRef.current.removeEventListener('blur', onBlurHandler);
    };
  }, [searchTopic, searchRef]);

  /**
   * @method useEffect
   * @memberof SearchTopicTerminal
   * @description Set search state said topic on `topic` change
   * to and from the search input (`Input`)
   * ### Dependencies: [`topic`]
   */
  useEffect(() => {
    topic && setSearch(topic);
  }, [topic]);

  /**
   * @method useEffect
   * @memberof SearchTopicTerminal
   * @description Populates `searchResults` with matching topic titles
   * from Wikipedia API on `search` change
   * ### Dependencies: [`search`]
   */
  useEffect(() => {
    setSearchResults([]);

    search &&
      axios
        .get('/w/api.php', {
          params: {
            action: 'query',
            format: 'json',
            generator: 'search',
            gsrsearch: search,
            prop: 'info',
            rnlimit: 10,
          },
        })
        .then(({ data }) => {
          if (!data.query) return setSearchResults([]);

          const { pages } = data.query;

          return Object.keys(pages)
            .slice(0, 10)
            .map(
              (id) =>
                setSearchResults((prevState) => [
                  ...prevState,
                  <MenuButton
                    label={pages[id].title}
                    style={styles.searchResult}
                    onClickHandler={() => {
                      setTopic(pages[id].title);
                      setSearchTopic(false);
                    }}
                  />,
                ])
              // eslint-disable-next-line function-paren-newline
            );
        });
  }, [search]);

  return (
    <Terminal
      innerRef={innerRef}
      refIndex={refIndex}
      terminalsRef={terminalsRef}
      id="search-topic-terminal"
      title="Generate Test / Topic"
      expandable
      resizable
      visible={searchTopic}
      unmountSelf={() => setSearchTopic(false)}
      onMouseDown={() => innerRef.current.setAttribute('active', true)}
    >
      <Input
        innerRef={searchRef}
        label="? Search"
        type="text"
        placeholder={search}
        value={search}
        setValue={setSearch}
      />
      <Menu parentTerminalRef={innerRef} menuItems={searchResults} />
    </Terminal>
  );
}

export default SearchTopicTerminal;
