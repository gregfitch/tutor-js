var Calendar, CourseSelect, ReadingBuilder, TEACHER_USERNAME, describe, expect, _ref;

_ref = require('../helpers'), describe = _ref.describe, CourseSelect = _ref.CourseSelect, Calendar = _ref.Calendar, ReadingBuilder = _ref.ReadingBuilder;

expect = require('chai').expect;

TEACHER_USERNAME = 'teacher01';

describe('Assignment Publishing Tests', function() {
  return this.it('Publishes a Reading with opensAt to tomorrow and deletes (idempotent)', function() {
    var title;
    title = this.freshId();
    this.login(TEACHER_USERNAME);
    CourseSelect.goTo(this, 'ANY');
    Calendar.createNew(this, 'READING');
    ReadingBuilder.edit(this, {
      name: title,
      opensAt: 'NOT_TODAY',
      dueAt: 'EARLIEST',
      sections: [1.2],
      action: 'PUBLISH'
    });
    Calendar.goOpen(this, title);
    Calendar.Popup.goEdit(this);
    ReadingBuilder.edit(this, {
      action: 'DELETE'
    });
    return Calendar.verify(this);
  });
});
