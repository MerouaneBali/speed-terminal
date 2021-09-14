/**
 * @module mergeRefs
 * @description Merge multiple ref hooks and allow all of them to reference a single component
 * @example ({ externalRef }) => {
 *   const localRef = useRef();
 *   const localRef2 = useRef();
 *
 *   return <h1 ref={mergeRefs(localRef, localRef2, externalRef)}>Title</h1>;
 * };
 * @returns {Array<function>} Array of reference hooks
 */
export default (...refs) => {
  const filteredRefs = refs.filter(Boolean);

  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];

  /**
   * @description Merges references
   * @param {object} inst Reference instance
   */
  const mergeRefs = (inst) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };

  // @ts-ignore
  return mergeRefs;
};
