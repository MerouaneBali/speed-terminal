import getDefaultFontSize from './getDefaultFontSize';

/**
 * @module convertEmToPixels
 * @description coverts em units to pixels
 * @requires getDefaultFontSize
 * @example convertEmToPixels(1.125); // 18
 * @example elementRef.current.style.padding = `${convertEmToPixels(1.125)}px`;
 * @returns {number} pixel equivalent of em units
 */
export default (em) => em * getDefaultFontSize();
