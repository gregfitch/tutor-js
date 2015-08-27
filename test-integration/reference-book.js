var SECTIONS_TO_TEST, SERVER_URL, TEACHER_USERNAME, describe, expect, selenium;

describe = require('./helpers').describe;

selenium = require('selenium-webdriver');

expect = require('chai').expect;

SERVER_URL = process.env['SERVER_URL'] || 'http://localhost:3001/';

TEACHER_USERNAME = 'teacher01';

SECTIONS_TO_TEST = 10;

describe('Reference Book Exercises', function() {
  return this.it('Loads Biology reference book (readonly)', function() {
    var checkForMissingExercises;
    this.login(TEACHER_USERNAME);
    checkForMissingExercises = (function(_this) {
      return function() {
        var doneLoading, i, _i, _results;
        _this.addTimeout(60);
        _this.waitAnd({
          css: '.page-wrapper .page.has-html'
        });
        _this.waitClick({
          css: '.menu-toggle'
        });
        doneLoading = function() {
          return _this.driver.isElementPresent({
            css: '.loadable.is-loading, .loading-exercise'
          }).then(function(isPresent) {
            return !isPresent;
          });
        };
        _results = [];
        for (i = _i = 1; 1 <= SECTIONS_TO_TEST ? _i <= SECTIONS_TO_TEST : _i >= SECTIONS_TO_TEST; i = 1 <= SECTIONS_TO_TEST ? ++_i : --_i) {
          _this.driver.findElement({
            css: 'a.nav.next'
          }).getAttribute('href').then(function(oldHref) {
            var checkPageChanged, ifPageDidntChange;
            _this.addTimeout(3);
            console.log('----------------');
            _this.driver.findElement({
              css: 'a.nav.next'
            }).click();
            _this.driver.wait(doneLoading);
            checkPageChanged = function() {
              return _this.driver.findElement({
                css: 'a.nav.next'
              }).getAttribute('href').then(function(newHref) {
                return newHref !== oldHref;
              });
            };
            ifPageDidntChange = function() {
              _this.addTimeout(3);
              console.log('Page did not change. reclicking.');
              _this.driver.findElement({
                css: 'a.nav.next'
              }).click();
              return _this.driver.wait(doneLoading);
            };
            return _this.driver.wait(checkPageChanged, 1000).then(null, ifPageDidntChange);
          });
          _results.push(_this.driver.getCurrentUrl().then(function(pageUrl) {
            _this.addTimeout(3);
            _this.driver.findElements({
              css: '[data-type="exercise"] .question'
            }).then(function(elements) {
              if (elements.length) {
                return console.log("Found " + elements.length + " exercises");
              }
            });
            return _this.driver.findElements({
              css: '.reference-book-missing-exercise'
            }).then(function(elements) {
              if (elements.length > 0) {
                return console.log("Found " + elements.length + " missing exercises in " + pageUrl);
              }
            });
          }));
        }
        return _results;
      };
    })(this);
    this.driver.get("" + SERVER_URL + "books/2");
    this.injectErrorLogging();
    checkForMissingExercises();
    this.driver.get("" + SERVER_URL + "books/1");
    this.injectErrorLogging();
    return checkForMissingExercises();
  });
});
