var Calendar, CourseSelect, ReadingBuilder, TEACHER_USERNAME, describe, _, _ref;

_ref = require('../helpers'), describe = _ref.describe, CourseSelect = _ref.CourseSelect, Calendar = _ref.Calendar, ReadingBuilder = _ref.ReadingBuilder;

_ = require('underscore');

TEACHER_USERNAME = 'teacher01';

describe('Assignment Cleanup', function() {
  return this.it('Deletes all drafts (not really a test but nice cleanup)', function() {
    var forEach;
    this.login(TEACHER_USERNAME);
    this.addTimeout(2);
    CourseSelect.goTo(this, 'ANY');
    Calendar.verify(this);
    forEach = (function(_this) {
      return function(css, fn, fn2) {
        return _this.driver.findElements({
          css: css
        }).then(function(els1) {
          var index;
          index = 0;
          if (typeof fn2 === "function") {
            fn2(els1);
          }
          return _.each(els1, function(el) {
            return _this.driver.findElement({
              css: css
            }).then(function(el) {
              index += 1;
              return fn.call(_this, el, index, els1.length);
            });
          });
        });
      };
    })(this);
    forEach('.plan:not(.is-published)', (function(_this) {
      return function(plan, index, total) {
        plan.click();
        ReadingBuilder.edit(_this, {
          action: 'DELETE'
        }).then(function() {
          return console.log('Deleted', index, '/', total);
        });
        return Calendar.verify(_this);
      };
    })(this), function(plans) {
      if (plans.length) {
        return console.log("Deleting " + plans.length + " Drafts...");
      }
    });
    return forEach('.plan.is-published:not(.is-open)', (function(_this) {
      return function(plan, index, total) {
        _this.addTimeout(10);
        plan.click();
        Calendar.Popup.goEdit(_this);
        ReadingBuilder.edit(_this, {
          action: 'DELETE'
        }).then(function() {
          return console.log('Deleted', index, '/', total);
        });
        return Calendar.verify(_this);
      };
    })(this), function(plans) {
      if (plans.length) {
        return console.log("Deleting " + plans.length + " Unopened...");
      }
    });
  });
});
