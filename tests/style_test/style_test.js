var test = require('tape');
var testSetup = require('../testSetup');

test('style tag test', function (t) {
    var el = testSetup('style-basic', t);

    var styles = require('./style_test.scss');
    var style = styles.tag;
    t.equal(style.tagName, 'STYLE', 'is style element')

    window.setTimeout(function () {
      var appliedstyles = window.getComputedStyle(el, null);
      t.equal(appliedstyles.backgroundColor, 'rgb(0, 0, 255)', '.style-basic backgorund-color should be rgb(0, 0, 255) (blue)');
      t.equal(appliedstyles.color, 'rgb(255, 0, 0)', '.style-basic color should be rgb(255, 0, 0) (red)');

      t.end();
    }, 100);

});
