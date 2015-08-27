var COMMAND_HISTORY, COMMAND_HISTORY_MAX, SERVER_URL, chai, describe, expect, fs, logger, screenshot, selenium, seleniumMocha, _,
  __slice = [].slice;

selenium = require('selenium-webdriver');

seleniumMocha = require('selenium-webdriver/testing');

_ = require('underscore');

chai = require('chai');

chai.use(require('chai-as-promised'));

expect = {
  chai: chai
};

fs = require('fs');

SERVER_URL = process.env['SERVER_URL'] || 'http://localhost:3001/';

logger = selenium.logging.getLogger('webdriver.http.Executor');

logger.setLevel(selenium.logging.Level.ALL);

COMMAND_HISTORY = [];

COMMAND_HISTORY_MAX = 20;

logger.addHandler(function(record) {
  if (COMMAND_HISTORY.length >= COMMAND_HISTORY_MAX) {
    COMMAND_HISTORY.shift();
  }
  return COMMAND_HISTORY.push(record.getMessage());
});

screenshot = function(driver, filename) {
  var fn, p;
  fn = function(data) {
    var base64Data;
    base64Data = data.replace(/^data:image\/png;base64,/, "");
    return new selenium.promise.Promise(function(resolve, reject) {
      return fs.writeFile("" + filename + ".png", base64Data, 'base64', function(err) {
        if (err) {
          return reject(err);
        } else {
          return resolve(true);
        }
      });
    });
  };
  p = driver.takeScreenshot().then(fn);
  return p;
};

describe = function(name, cb) {
  return seleniumMocha.describe(name, function() {
    var after, afterEach, before, beforeEach, iit, it, xit;
    it = seleniumMocha.it, iit = seleniumMocha.iit, xit = seleniumMocha.xit, before = seleniumMocha.before, after = seleniumMocha.after, afterEach = seleniumMocha.afterEach, beforeEach = seleniumMocha.beforeEach;
    this.it = it;
    this.iit = iit;
    this.xit = xit;
    this.before = before;
    this.after = after;
    this.__beforeEach = beforeEach;
    this.__afterEach = afterEach;
    this.before(function() {
      this.driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();
      this.screenshot = (function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return screenshot.apply(null, [_this.driver].concat(__slice.call(args)));
        };
      })(this);
      this.freshId = function() {
        return '_SE ' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2);
      };
      this.toLocator = (function(_this) {
        return function(locator) {
          if (typeof locator === 'string') {
            console.warn("Please use {css: '" + locator + "'} instead of just a string as the argument");
            return {
              css: locator
            };
          } else {
            return locator;
          }
        };
      })(this);
      this.waitAnd = (function(_this) {
        return function(locator) {
          var el;
          locator = _this.toLocator(locator);
          _this.driver.wait(selenium.until.elementLocated(locator));
          el = _this.driver.findElement(locator);
          _this.driver.wait(selenium.until.elementIsVisible(el));
          return el;
        };
      })(this);
      this.waitClick = (function(_this) {
        return function(locator) {
          var el;
          el = _this.waitAnd(locator);
          _this.scrollTop();
          el.click();
          return el;
        };
      })(this);
      this.scrollTop = (function(_this) {
        return function() {
          _this.driver.executeScript("window.scrollTo(0,0);");
          return _this.driver.sleep(200);
        };
      })(this);
      this.scrollTo = (function(_this) {
        return function(el) {
          _this.driver.executeScript("arguments[0].scrollIntoView(true);", el);
          return _this.driver.sleep(200);
        };
      })(this);
      this.logout = (function(_this) {
        return function() {
          return _this.driver.isElementPresent({
            css: '.modal-dialog .modal-header .close'
          }).then(function(isPresent) {
            if (isPresent) {
              _this.waitClick({
                css: '.modal-dialog .modal-header .close'
              });
            }
            return _this.driver.isElementPresent({
              css: '.-hamburger-menu'
            }).then(function(isPresent) {
              if (isPresent) {
                _this.waitClick({
                  css: '.-hamburger-menu'
                });
                return _this.waitAnd({
                  css: '.-hamburger-menu .-logout-form'
                }).submit();
              }
            });
          });
        };
      })(this);
      this.injectErrorLogging = (function(_this) {
        return function() {
          return _this.driver.executeScript(function() {
            var originalOnError;
            originalOnError = window.onerror;
            if (!window.IS_CHECKING_FOR_ERRORS) {
              window.IS_CHECKING_FOR_ERRORS = true;
              return window.onerror = function() {
                var args, msg;
                msg = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                document.querySelector('body').setAttribute('data-js-error', msg);
                return typeof originalOnError === "function" ? originalOnError.apply(null, [msg].concat(__slice.call(args))) : void 0;
              };
            }
          });
        };
      })(this);
      this.forEach = (function(_this) {
        return function(options, fn, fn2) {
          var css, ignoreLengthChange, linkText, locator;
          if (typeof options === 'string') {
            locator = {
              css: options
            };
          } else {
            css = options.css, linkText = options.linkText, ignoreLengthChange = options.ignoreLengthChange;
            if (linkText) {
              locator = {
                linkText: linkText
              };
            } else if (css) {
              locator = {
                css: css
              };
            } else {
              throw new Error("Unknown locator format. So far only linkText and css are recognized. " + options);
            }
          }
          return _this.driver.findElements(locator).then(function(els1) {
            var index;
            index = 0;
            if (typeof fn2 === "function") {
              fn2(els1);
            }
            return _.each(els1, function(el) {
              return _this.driver.findElements(locator).then(function(els) {
                el = els[index];
                if (els.length !== els1.length && !ignoreLengthChange) {
                  throw new Error("Length changed during foreach! before: " + els1.length + " after: " + els.length);
                }
                index += 1;
                return el.isDisplayed().then(function(isDisplayed) {
                  if (!isDisplayed) {
                    _this.scrollTo(el);
                  }
                  return fn.call(_this, el, index, els1.length);
                });
              });
            });
          });
        };
      })(this);
      return this.login = (function(_this) {
        return function(username, password) {
          if (password == null) {
            password = 'password';
          }
          _this.addTimeout(10);
          _this.waitClick({
            linkText: 'Login'
          });
          _this.waitAnd({
            css: '#auth_key, #search_query'
          });
          _this.driver.isElementPresent({
            css: '#search_query'
          }).then(function(isPresent) {
            if (isPresent) {
              _this.driver.findElement({
                css: '#search_query'
              }).sendKeys(username);
              _this.driver.findElement({
                css: '#search_query'
              }).submit();
              return _this.waitClick({
                linkText: username
              });
            } else {
              _this.driver.findElement({
                css: '#auth_key'
              }).sendKeys(username);
              _this.driver.findElement({
                css: '#password'
              }).sendKeys(password);
              return _this.driver.findElement({
                css: '.password-actions button.standard'
              }).click();
            }
          });
          _this.driver.wait(selenium.until.elementLocated({
            css: '#react-root-container [data-reactid]'
          }));
          return _this.injectErrorLogging();
        };
      })(this);
    });
    this.__beforeEach(function() {
      var currentTimeout, timeout;
      timeout = this.timeout;
      currentTimeout = 0;
      this.addTimeout = (function(_this) {
        return function(sec) {
          currentTimeout += sec * 1000;
          return timeout.call(_this, currentTimeout, true);
        };
      })(this);
      this.timeout = (function(_this) {
        return function(ms, isInternal) {
          if (!isInternal) {
            throw new Error('use addTimeout (preferably in the helper you are using) instead of timeout');
          }
          if (ms) {
            return timeout.call(_this, ms, isInternal);
          } else {
            return timeout.call(_this);
          }
        };
      })(this);
      this.addTimeout(10);
      this.driver.get(SERVER_URL);
      this.driver.wait(selenium.until.elementLocated({
        css: '#react-root-container .-hamburger-menu, body#home'
      }));
      return this.logout().then(function() {
        return COMMAND_HISTORY.splice(0, COMMAND_HISTORY.length);
      });
    });
    this.__afterEach(function() {
      var msg, state, title, _i, _len, _ref;
      this.addTimeout(2 * 60);
      _ref = this.currentTest, state = _ref.state, title = _ref.title;
      if (state === 'failed') {
        console.log("Action history (showing last " + COMMAND_HISTORY_MAX + "):");
        for (_i = 0, _len = COMMAND_HISTORY.length; _i < _len; _i++) {
          msg = COMMAND_HISTORY[_i];
          console.log(msg);
        }
        console.log('------------------');
        screenshot(this.driver, "test-failed-" + title);
      }
      this.driver.findElement({
        css: 'body'
      }).getAttribute('data-js-error').then(function(msg) {
        if (msg) {
          console.log('JS Error! ' + msg);
          return screenshot(this.driver, "test-failed-" + title);
        }
      });
      return this.logout();
    });
    this.after(function() {
      return this.driver.quit();
    });
    return cb.call(this);
  });
};

module.exports = {
  describe: describe,
  xdescribe: seleniumMocha.xdescribe
};
