/**
 * @module getTransformValue
 *
 * @description Get value of key property from transform matrix
 *
 * @param {Object} element Element to get transform matrix from
 * @param {String} key Key of transform matrix property
 *
 * @return {String} Value of key property from transform matrix
 */
export default (element, key) => {
  const style = window.getComputedStyle(element);
  // eslint-disable-next-line no-undef
  const matrix = new WebKitCSSMatrix(style.transform);
  return matrix[key];
};
