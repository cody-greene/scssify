'use strict'
const importedFiles = new Set()
module.exports = function (file) {
  importedFiles.add(file)
  if (file === 'resolve-to-vars')
    return {file: 'tests/util/_vars.scss'}
  return null
}

// Expose for assertions
module.exports.importedFiles = importedFiles
