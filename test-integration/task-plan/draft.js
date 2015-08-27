var Calendar, CourseSelect, ReadingBuilder, TEACHER_USERNAME, describe, expect, _ref;

_ref = require('../helpers'), describe = _ref.describe, CourseSelect = _ref.CourseSelect, Calendar = _ref.Calendar, ReadingBuilder = _ref.ReadingBuilder;

expect = require('chai').expect;

TEACHER_USERNAME = 'teacher01';

describe('Draft Tests', function() {
  this.before(function() {
    return this.verifyDisplayed = (function(_this) {
      return function(css) {
        return _this.waitAnd({
          css: css
        }).isDisplayed().then(function(isDisplayed) {
          return expect(isDisplayed).to.be["true"];
        });
      };
    })(this);
  });
  this.it('Shows Validation Error when saving a blank Reading, Homework, and External (idempotent)', function() {
    var title;
    this.addTimeout(30);
    title = this.freshId();
    this.login(TEACHER_USERNAME);
    CourseSelect.goTo(this, 'ANY');
    Calendar.createNew(this, 'READING');
    ReadingBuilder.edit(this, {
      action: 'SAVE'
    });
    this.verifyDisplayed('.assignment-name.has-error .required-hint');
    this.verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint');
    this.verifyDisplayed('.readings-required');
    ReadingBuilder.edit(this, {
      action: 'CANCEL'
    });
    Calendar.createNew(this, 'HOMEWORK');
    ReadingBuilder.edit(this, {
      action: 'SAVE'
    });
    this.verifyDisplayed('.assignment-name.has-error .required-hint');
    this.verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint');
    this.verifyDisplayed('.problems-required');
    ReadingBuilder.edit(this, {
      action: 'CANCEL'
    });
    Calendar.createNew(this, 'EXTERNAL');
    ReadingBuilder.edit(this, {
      action: 'SAVE'
    });
    this.verifyDisplayed('.assignment-name.has-error .required-hint');
    this.verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint');
    this.verifyDisplayed('.external-url.has-error .required-hint');
    return ReadingBuilder.edit(this, {
      action: 'CANCEL'
    });
  });
  this.it('Creates a draft Reading with opensAt to today and deletes (idempotent)', function() {
    var title;
    this.addTimeout(60);
    title = this.freshId();
    this.login(TEACHER_USERNAME);
    CourseSelect.goTo(this, 'ANY');
    Calendar.createNew(this, 'READING');
    ReadingBuilder.edit(this, {
      name: title,
      dueAt: 'EARLIEST',
      sections: [1.1, 1.2, 2.1, 3, 3.1],
      action: 'SAVE'
    });
    Calendar.goOpen(this, title);
    ReadingBuilder.edit(this, {
      action: 'DELETE'
    });
    return Calendar.verify(this);
  });
  return this.it('Creates a draft Reading checks and then unchecks some sections (idempotent)', function() {
    var title;
    this.addTimeout(2 * 60);
    title = this.freshId();
    this.login(TEACHER_USERNAME);
    CourseSelect.goTo(this, 'ANY');
    Calendar.createNew(this, 'READING');
    ReadingBuilder.edit(this, {
      name: title,
      dueAt: 'EARLIEST',
      sections: [1.1, 1.2, 2.1, 3],
      action: 'SAVE'
    });
    Calendar.goOpen(this, title);
    ReadingBuilder.edit(this, {
      sections: [1.1, 1.2, 2.1, 3],
      action: 'SAVE'
    });
    this.verifyDisplayed('.readings-required');
    ReadingBuilder.edit(this, {
      action: 'DELETE'
    });
    return Calendar.verify(this);
  });
});
