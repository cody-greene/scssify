'use strict'
const importedFiles = new Set()
module.exports = function (file) {
  importedFiles.add(file)
  return null
}

// Expose for assertions
module.exports.importedFiles = importedFiles
