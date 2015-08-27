var edit, selenium, setDate;

selenium = require('selenium-webdriver');

setDate = function(test, css, date) {
  test.driver.findElement({
    css: "" + css + " .datepicker__input"
  }).click();
  switch (date) {
    case 'TODAY':
      test.waitClick({
        css: '.datepicker__container .datepicker__month .datepicker__day.datepicker__day--today'
      });
      break;
    case 'NOT_TODAY':
      test.waitClick({
        css: '.datepicker__container .datepicker__month .datepicker__day:not(.datepicker__day--disabled):not(.datepicker__day--today)'
      });
      break;
    case 'EARLIEST':
      test.waitClick({
        css: '.datepicker__container .datepicker__month .datepicker__day:not(.datepicker__day--disabled)'
      });
      break;
    default:
      throw new Error("BUG: Invalid date: '" + date + "'");
  }
  return test.driver.wait((function(_this) {
    return function() {
      return test.driver.isElementPresent({
        css: '.datepicker__container'
      }).then(function(isPresent) {
        return !isPresent;
      });
    };
  })(this));
};

edit = (function(_this) {
  return function(test, _arg) {
    var action, description, dueAt, name, opensAt, section, sections, _fn, _i, _len;
    name = _arg.name, description = _arg.description, opensAt = _arg.opensAt, dueAt = _arg.dueAt, sections = _arg.sections, action = _arg.action;
    test.waitAnd({
      css: '.reading-plan, .homework-plan, .external-plan'
    });
    if (name) {
      test.waitAnd({
        css: '#reading-title'
      }).sendKeys(name);
    }
    if (opensAt) {
      setDate(test, '.-assignment-open-date', opensAt);
    }
    if (dueAt) {
      setDate(test, '.-assignment-due-date', dueAt);
    }
    if (sections) {
      test.driver.findElement({
        css: '#reading-select'
      }).click();
      test.waitAnd({
        css: '.select-reading-dialog:not(.hide)'
      });
      test.scrollTop();
      _fn = function(section) {
        var isChapter;
        section = "" + section;
        isChapter = !/\./.test(section);
        if (isChapter) {
          return test.waitClick({
            css: ".dialog:not(.hide) [data-chapter-section='" + section + "'] .chapter-checkbox input"
          });
        } else {
          return test.driver.findElement({
            css: ".dialog:not(.hide) [data-chapter-section='" + section + "']"
          }).isDisplayed().then(function(isDisplayed) {
            if (!isDisplayed) {
              test.waitClick({
                css: ".dialog:not(.hide) [data-chapter-section='" + (section.split('.')[0]) + "']"
              });
            }
            return test.waitClick({
              css: ".dialog:not(.hide) [data-chapter-section='" + section + "']"
            });
          });
        }
      };
      for (_i = 0, _len = sections.length; _i < _len; _i++) {
        section = sections[_i];
        _fn(section);
      }
      test.waitClick({
        css: '.-show-problems'
      });
    }
    switch (action) {
      case 'PUBLISH':
        return test.waitClick({
          css: '.async-button.-publish'
        }).then(function() {
          return test.addTimeout(3 * 60);
        });
      case 'SAVE':
        return test.waitClick({
          css: '.async-button.-save'
        });
      case 'CANCEL':
        test.waitClick({
          css: '.footer-buttons [aria-role="close"]'
        });
        return test.driver.wait(selenium.until.alertIsPresent()).then(function(alert) {
          return alert.accept();
        });
      case 'DELETE':
        test.waitClick({
          css: '.async-button.delete-link'
        });
        return test.driver.wait(selenium.until.alertIsPresent()).then(function(alert) {
          alert.accept();
          return test.addTimeout(60);
        });
    }
  };
})(this);

module.exports = {
  setDate: setDate,
  edit: edit
};
