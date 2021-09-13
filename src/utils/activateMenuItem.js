export default (menuItemsRef, refIndex) => {
  menuItemsRef.current[refIndex].setAttribute('active', true);

  menuItemsRef.current.map(
    (menuItem, index) =>
      menuItem && index !== refIndex && menuItem.setAttribute('active', false)
  );
};
