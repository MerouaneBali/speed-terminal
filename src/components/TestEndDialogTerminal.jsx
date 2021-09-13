import React, { useLayoutEffect } from 'react';

import Terminal from './Terminal';
import Menu from './Menu';
import MenuButton from './MenuButton';

import '../css/components/TestEndDialogTerminal.css';

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
