import axios from 'axios';

import React, { useState, useRef, useEffect } from 'react';

import '../css/components/SearchTopicTerminal.css';

import Terminal from './Terminal';
import Input from './Input';
import Menu from './Menu';
import MenuButton from './MenuButton';

function SearchTopicTerminal({
  innerRef,
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

  const onBlurHandler = () => {
    searchTopic && searchRef.current && searchRef.current.focus();
  };

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

  useEffect(() => {
    topic && setSearch(topic);
  }, [topic]);

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
      id="search-topic-terminal"
      title="Generate Test / Topic"
      expandable
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
