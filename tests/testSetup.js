module.exports = function (className, t) {
  var body = document.body;
  var el = document.createElement('div');
  el.classList.add(className);
  el.innerHTML = 'lorem ipsum';
  body.appendChild(el);

  var defaultStyles = window.getComputedStyle(el, null);
  t.ok(['rgba(0, 0, 0, 0)', 'transparent'].indexOf(defaultStyles['background-color'] || defaultStyles.backgroundColor) !== -1, 'default background-color should be transparent');
  t.equal(defaultStyles.color, 'rgb(0, 0, 0)', 'default color should be black');

  return el;
};
