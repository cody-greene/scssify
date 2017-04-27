'use strict'
/*eslint-env browser */

function getHead() {
  return document.head || document.getElementsByTagName('head')[0]
}

function attachAttributes(tag, attributes) {
  for (var key in attributes) if (attributes.hasOwnProperty(key)) {
    tag.setAttribute('data-' + key, attributes[key])
  }
}

module.exports = {
  /**
   * Create a <style>...</style> tag and add it to the document head
   * @param {string} cssText
   * @param {object?} attributes Optional data-* attribs
   * @return {window.Element}
   */
  createStyle: function (cssText, options) {
    var style = document.createElement('style')
    var position = options.prepend === true ? 'prepend' : 'append'
    var container = getHead()
    style.type = 'text/css'
    attachAttributes(style, options.verbose)
    if (style.sheet) { // for jsdom and IE9+
      style.innerHTML = cssText
      style.sheet.cssText = cssText
    }
    else if (style.styleSheet) { // for IE8 and below
      style.styleSheet.cssText = cssText
    }
    else { // for Chrome, Firefox, and Safari
      style.appendChild(document.createTextNode(cssText))
    }
    if (position === 'prepend') {
      container.insertBefore(style, container.childNodes[0]);
    } else {
      container.appendChild(style);
    }
    return style
  }
}
