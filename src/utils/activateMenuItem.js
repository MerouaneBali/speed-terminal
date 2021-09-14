/**
 * @module activeMenuItems
 * @deprecated Will be removed in the next major master push
 * @description Activate current menu item and deactivate all the others
 * @param {{current: Array}} menuItemsRef Menu items referances array
 * @param {number} refIndex Index of current menu item
 * @example ({ innerRef, menuItemsRef, refIndex }) => (
 *   <MenuCheckbox
 *     innerRef={innerRef}
 *     onChange={() => activateMenuItem(menuItemsRef, refIndex)}
 *   />
 * );
 */
(menuItemsRef, refIndex) => {
  menuItemsRef.current[refIndex].setAttribute('active', true);

  menuItemsRef.current.map(
    (menuItem, index) =>
      menuItem && index !== refIndex && menuItem.setAttribute('active', false)
  );
};
