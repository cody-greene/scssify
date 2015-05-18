/*eslint-env browser */

function getHead () {
  return document.head || document.getElementsByTagName('head')[0]
}

function attachAttributes (tag, attributes) {
  for (let key in attributes) {
    if (!attributes.hasOwnProperty(key)) {
      continue
    }
    const value = attributes[key]
    tag.setAttribute('data-' + key, value)
  }
}

const insertCSS = {
    // Create a <link> tag with optional data attributes
    createLink (href) {
      const head = getHead()
      const link = document.createElement('link')

      link.href = href
      link.rel = 'stylesheet'

      attachAttributes(link)

      head.appendChild(link)

      return link
    },
    // Create a <style> tag with optional data attributes
    createStyle (cssText, attributes) {
      const head = getHead()
      const style = document.createElement('style')

      style.type = 'text/css'

      attachAttributes(style, attributes)

      if (style.sheet) { // for jsdom and IE9+
        style.innerHTML = cssText
        style.sheet.cssText = cssText
        head.appendChild(style)
      } else if (style.styleSheet) { // for IE8 and below
        head.appendChild(style)
        style.styleSheet.cssText = cssText
      } else { // for Chrome, Firefox, and Safari
        style.appendChild(document.createTextNode(cssText))
        head.appendChild(style)
      }

      return style
    }
}

export default insertCSS
