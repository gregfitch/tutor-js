var CourseCalendar, goTo, selenium;

selenium = require('selenium-webdriver');

CourseCalendar = require('./calendar');

goTo = (function(_this) {
  return function(test, category) {
    switch (category) {
      case 'BIOLOGY':
        test.waitClick({css: '[data-category="biology"]'});
        break;
      case 'PHYSICS':
        test.waitClick({css: '[data-category="physics"]'});
        break;
      default:
        test.waitClick({css: '[data-category]'});
    }
    return CourseCalendar.verify(test);
  };
})(this);

module.exports = {
  goTo: goTo
};
