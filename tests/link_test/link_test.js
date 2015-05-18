var test = require('tape');
var testSetup = require('../testSetup')

test('link tag test', function (t) {
    var el = testSetup('link-basic', t);

    var styles = require('./link_test.scss');

    var link = styles.tag;

    t.equal(link.tagName, 'LINK', 'is link element')

    window.setTimeout(function () {
      var appliedstyles = window.getComputedStyle(el, null);
      t.equal(appliedstyles.backgroundColor, 'rgb(0, 0, 255)', '.link-basic backgorund-color should be rgb(0, 0, 255) (blue)');
      t.equal(appliedstyles.color, 'rgb(255, 0, 0)', '.link-basic color should be rgb(255, 0, 0) (red)');

      t.end();
    }, 100);

});
