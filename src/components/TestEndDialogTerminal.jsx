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
 * @prop {number} props.refIndex Index of current terminal in terminalsRef
 * @prop {object} props.terminalsRef Reference hook containing an array of terminals hooks
 * @prop {boolean} props.endDialog State of test end dialog terminal visiblity
 * @prop {function} props.setEndDialog Set endDialog state function
 * @prop {function} props.restart Restart test states and attributes
 * @prop {function} props.generateNewTest Unmount {@link TestTerminal}
 * and mount {@link GenerateTestTerminal} test
 *
 * @requires useLayoutEffect
 * @requires Terminal
 * @requires Menu
 * @requires MenuButton
 */
function TestEndDialogTerminal({
  innerRef,
  refIndex,
  terminalsRef,
  endDialog,
  setEndDialog,
  restart,
  generateNewTest,
}) {
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
      onClickHandler={async () => restart()}
    />,
    <MenuButton
      label="Generate new test"
      style={styles.menuItem}
      onClickHandler={async () => generateNewTest()}
    />,
  ];

  useLayoutEffect(() => {
    innerRef.current && innerRef.current.setAttribute('active', true);
  }, []);

  return (
    <Terminal
      innerRef={innerRef}
      refIndex={refIndex}
      terminalsRef={terminalsRef}
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
