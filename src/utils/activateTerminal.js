/**
 * @module activeTerminal
 * @description Activate current terminal and deactivate all the others
 * @param {{current: Array}} terminalsRef Terminal referances array
 * @param {number} refIndex Index of current terminal
 * @example ({ innerRef, terminalsRef, refIndex }) => (
 *   <Terminal
 *     innerRef={innerRef}
 *     onMouseDown={() => activateTerminal(terminalsRef, refIndex)}
 *   />
 * );
 */
export default (terminalsRef, refIndex) => {
  terminalsRef.current[refIndex].setAttribute('active', true);

  terminalsRef.current.map(
    (terminal, index) =>
      terminal && index !== refIndex && terminal.setAttribute('active', false)
  );
};
