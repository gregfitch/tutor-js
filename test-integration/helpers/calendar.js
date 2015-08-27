var Popup, createNew, expect, goLearningGuide, goOpen, selenium, verify;

selenium = require('selenium-webdriver');

expect = require('chai').expect;

verify = function(test) {
  return test.waitAnd({css: '.calendar-container:not(.calendar-loading)'});
};

createNew = function(test, type) {
  verify(test);
  test.waitClick({css: '.add-assignment .dropdown-toggle'});
  switch (type) {
    case 'READING':
      return test.waitClick({linkText: 'Add Reading'});
    case 'HOMEWORK':
      return test.waitClick({linkText: 'Add Homework'});
    case 'EXTERNAL':
      return test.waitClick({linkText: 'Add External Assignment'});
    default:
      return expect(false, 'Invalid assignment type').to.be["true"];
  }
};

goOpen = function(test, title) {
  var el;
  verify(test);
  el = test.waitAnd({css: "[data-title='" + title + "']"});
  test.scrollTo(el);
  el.click();
  return test.scrollTop();
};

goLearningGuide = function(test) {
  return test.waitClick({linkText: 'Performance Forecast'});
};

Popup = {
  verify: function(test) {
    test.addTimeout(5);
    return test.waitAnd({css: '.plan-modal .panel.panel-default'});
  },
  close: function(test) {
    test.waitClick({css: '.plan-modal .close'});
    return test.driver.sleep(500);
  },
  goEdit: function(test) {
    return test.waitClick({linkText: 'Edit Assignment'});
  },
  goReview: function(test) {
    test.waitClick({linkText: 'Review Metrics'});
    return test.waitAnd({css: '.task-teacher-review .task-breadcrumbs'});
  }
};

module.exports = {
  verify: verify,
  createNew: createNew,
  goOpen: goOpen,
  goLearningGuide: goLearningGuide,
  Popup: Popup
};
