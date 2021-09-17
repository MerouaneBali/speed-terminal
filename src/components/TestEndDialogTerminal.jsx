import React, { useLayoutEffect } from 'react';

import Terminal from './Terminal';
import Menu from './Menu';
import MenuButton from './MenuButton';

import '../css/components/TestEndDialogTerminal.css';

/**
 * @component
 *
 * @description Terminal to search and pick test topic from Wikipedia API
 * which is then used by {@link TestTerminal}
 *
 * @prop {object} props React props
 * @prop {object} props.innerRef External reference hook for the terminal
 * @prop {boolean} props.endDialog State of test end dialog terminal visiblity
 * @prop {function} props.setEndDialog Set endDialog state function
 *
 * @requires useLayoutEffect
 * @requires Terminal
 * @requires Menu
 * @requires MenuButton
 */
function TestEndDialogTerminal({ innerRef, endDialog, setEndDialog }) {
  const styles = {
    menuItem: {
      fontWeight: '400',
    },
  };

  const menuItems = [
    // <MenuButton
    //   label="Report"
    //   style={styles.menuItem}
    //   onClickHandler={() => {}}
    // />,
    <MenuButton
      label="Restart"
      style={styles.menuItem}
      onClickHandler={() => {}}
    />,
    <MenuButton
      label="Generate new test"
      style={styles.menuItem}
      onClickHandler={() => {}}
    />,
  ];

  useLayoutEffect(() => {
    innerRef.current && innerRef.current.setAttribute('active', true);
  }, []);

  return (
    <Terminal
      innerRef={innerRef}
      id="end-dialog-terminal"
      title="You're Done!"
      expandable={false}
      visible={endDialog}
      active="true"
      unmountSelf={() => setEndDialog(false)}
      onMouseDown={() => innerRef.current.setAttribute('active', true)}
    >
      <Menu parentTerminalRef={innerRef} menuItems={menuItems} />
    </Terminal>
  );
}

export default TestEndDialogTerminal;
