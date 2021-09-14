/**
 * @module getDefaultFontSize
 * @description Get the browser's default font size
 * @example const defaultFontSize = getDefaultFontSize(); // 16
 * @returns {number} Browser default font size
 */
export default () =>
  parseInt(
    window
      .getComputedStyle(document.body)
      .getPropertyValue('font-size')
      .slice(0, -2),
    10
  );
