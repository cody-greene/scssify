'use strict'
const mockImporter = require('./mock-importer')
module.exports = function () {
  module.exports.count++;
  return mockImporter
}

module.exports.count = 0;

