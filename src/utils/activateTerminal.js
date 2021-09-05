export default (terminalsRef, refIndex) => {
  terminalsRef.current[refIndex].setAttribute('active', true);

  terminalsRef.current.map(
    (terminal, index) =>
      terminal && index !== refIndex && terminal.setAttribute('active', false)
  );
};
