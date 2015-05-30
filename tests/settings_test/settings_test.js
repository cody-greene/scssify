var test = require('tape');
var testSetup = require('../testSetup');

test('settings test', function (t) {
    var el = testSetup('settings-basic', t);

    var styles = require('./settings_test.scss');

    t.equal(styles.tag, undefined, 'not auto inserted');
    t.ok(styles.css.indexOf('sourceMap') > -1, 'source map included');

    t.ok(styles.css.indexOf('-webkit') > -1, 'postcss plugins ran')

    var tag = require('scssify').createLink('data:text/css;base64,' +btoa(styles.css));
    console.log(styles.css)
    window.setTimeout(function () {
      var appliedstyles = window.getComputedStyle(el, null);
      t.equal(appliedstyles.backgroundColor, 'rgb(0, 0, 255)', '.settings-basic backgorund-color should be rgb(0, 0, 255) (blue)');
      t.equal(appliedstyles.color, 'rgb(255, 0, 0)', '.settings-basic color should be rgb(255, 0, 0) (red)');

      t.end();
    }, 1000);

});
