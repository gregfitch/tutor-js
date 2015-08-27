var Calendar, CourseSelect, ReadingBuilder, TEACHER_USERNAME, describe, expect, _, _ref;

_ref = require('./helpers'), describe = _ref.describe, CourseSelect = _ref.CourseSelect, Calendar = _ref.Calendar, ReadingBuilder = _ref.ReadingBuilder;

expect = require('chai').expect;

_ = require('underscore');

TEACHER_USERNAME = 'teacher01';

describe('Calendar and Stats', function() {
  this.xit('Just logs in (readonly)', function() {
    return this.login(TEACHER_USERNAME);
  });
  this.it('Shows stats for all published plans (readonly)', function() {
    this.login(TEACHER_USERNAME);
    return _.each(['BIOLOGY', 'PHYSICS'], (function(_this) {
      return function(courseCategory) {
        CourseSelect.goTo(_this, courseCategory);
        _this.forEach('.plan.is-published label:not(.continued)', function(plan, index, total) {
          console.log('Opening', courseCategory, index, '/', total);
          plan.click();
          Calendar.Popup.verify(_this);
          _this.driver.findElements({
            css: '.panel .nav.nav-tabs li'
          }).then(function(periods) {
            var period, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = periods.length; _i < _len; _i++) {
              period = periods[_i];
              _results.push(period.click());
            }
            return _results;
          });
          Calendar.Popup.close(_this);
          return Calendar.verify(_this);
        });
        return _this.waitClick({
          css: '.navbar-brand'
        });
      };
    })(this));
  });
  this.it('Opens the learning guide for each course (readonly)', function() {
    this.login(TEACHER_USERNAME);
    return _.each(['PHYSICS', 'BIOLOGY'], (function(_this) {
      return function(courseCategory) {
        _this.addTimeout(10);
        CourseSelect.goTo(_this, courseCategory);
        Calendar.goLearningGuide(_this);
        _this.waitAnd({
          css: '.guide-heading'
        });
        _this.forEach('.panel .nav.nav-tabs li', function(period) {
          return period.click();
        });
        _this.waitClick({
          css: '.back'
        });
        return _this.waitClick({
          css: '.navbar-brand'
        });
      };
    })(this));
  });
  this.it('Opens the review page for every visible plan (readonly)', function() {
    this.login(TEACHER_USERNAME);
    return _.each(['PHYSICS', 'BIOLOGY'], (function(_this) {
      return function(courseCategory) {
        CourseSelect.goTo(_this, courseCategory);
        _this.forEach('.plan.is-open label:not(.continued)', function(plan, index, total) {
          _this.addTimeout(10);
          console.log('Looking at Review for', courseCategory, index, 'of', total);
          plan.click();
          Calendar.Popup.verify(_this);
          Calendar.Popup.goReview(_this);
          _this.driver.sleep(1000);
          _this.forEach('.panel .nav.nav-tabs li', function(period) {
            return period.click();
          });
          _this.driver.navigate().back();
          _this.driver.sleep(1000);
          Calendar.Popup.verify(_this);
          Calendar.Popup.close(_this);
          return Calendar.verify(_this);
        });
        return _this.waitClick({
          css: '.navbar-brand'
        });
      };
    })(this));
  });
  return this.it('Clicks through the performance report (readonly)', function() {
    this.login(TEACHER_USERNAME);
    return _.each(['PHYSICS', 'BIOLOGY'], (function(_this) {
      return function(courseCategory) {
        CourseSelect.goTo(_this, courseCategory);
        _this.waitClick({
          linkText: 'Performance Report'
        }).then(function() {
          return _this.addTimeout(60);
        });
        _this.waitAnd({
          css: '.performance-report .course-performance-title'
        });
        _this.driver.sleep(500);
        _this.forEach('.review-plan', function(item, index, total) {
          console.log('opening Review', courseCategory, index, 'of', total);
          _this.addTimeout(15);
          item.click();
          _this.waitClick({
            css: '.task-breadcrumbs > a'
          });
          return _this.waitAnd({
            css: '.course-performance-wrap'
          });
        });
        _this.forEach({
          css: '.student-name',
          ignoreLengthChange: true
        }, function(item, index, total) {
          console.log('opening Student Forecast', courseCategory, index, 'of', total);
          _this.addTimeout(5);
          item.click();
          _this.waitAnd({
            css: '.chapter-panel.weaker'
          });
          _this.waitClick({
            css: '.learning-guide a.back'
          });
          return _this.waitAnd({
            css: '.course-performance-wrap'
          });
        });
        _this.forEach('.fixedDataTableRowLayout_rowWrapper:nth-of-type(1) .task-result', function(item, index, total) {
          console.log('opening Student view', courseCategory, index, 'of', total);
          _this.addTimeout(5);
          item.click();
          _this.waitAnd({
            css: '.async-button.continue'
          });
          _this.waitClick({
            css: '.pinned-footer a.btn-default'
          });
          return _this.driver.sleep(2000);
        });
        return _this.waitClick({
          css: '.navbar-brand'
        });
      };
    })(this));
  });
});
