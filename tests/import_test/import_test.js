var test = require('tape');
var testSetup = require('../testSetup');

test('import path test', function (t) {
    var el = testSetup('import-basic', t);

    var styles = require('./import_test.scss');
    var style = styles.tag;
    t.equal(style.tagName, 'LINK', 'is link element')

    window.setTimeout(function () {
      var appliedstyles = window.getComputedStyle(el, null);
      t.equal(appliedstyles.backgroundColor, 'rgb(0, 0, 255)', '.import-basic backgorund-color should be rgb(0, 0, 255) (blue)');
      t.equal(appliedstyles.color, 'rgb(255, 0, 0)', '.import-basic color should be rgb(255, 0, 0) (red)');

      t.end();
    }, 100);

});
