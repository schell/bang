/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Global.js
 *    A set of functions all of Bang needs.
 *    Copyright (c) 2012 . All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Tue Jan 10 20:05:33 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Global',
    dependencies : [],
    init : function initGlobal (m) {
        /**
         * Initializes Global.
         * Defines functions inside mod's module object that all of Bang will need.
         * @param - m Object - mod's module object.
         */
         var defined = m.defined = function (variable) {
            /**
             * Determines whether or not the variable is defined.
             * @param - variable Object - The object to test the definition of.
             * @return - Boolean
             */
            if (variable === null) {
                return false;
            }
            if (variable === undefined) {
                return false;
            }
            return true;
        };
        
        var ifndefInit = m.ifndefInit = function (variable, value) {
            /**
             *    Ensures that a variable is defined, sets variable to value
             *    if not, returns variable.
             *    @return variable
             */
            variable = defined(variable) ? variable : value;
            return variable;
        };

        var ifndefInitNum = m.ifndefInitNum = function (variable, value) {
            /**
             *    Ensures that variable is defined as a number, defaults to value.
             *    @return Number
             */
            variable = m.defined(variable) ? variable : value;
            if (isNaN(variable)) {
                if (isNaN(value)) {
                    console.error('value',value.toString(),'is not a number...');
                    return 0;
                } else {
                    variable = value;
                }
            }
            return variable;
        };

        var ifndefInitObj = m.ifndefInitObj = function (obj, defaultObj) {
            /**
             *    Ensures that *obj* is defined, and has (at least) all properties of *defaultObj*.
             *    *defaultObj* should be the default state of *obj*.
             *    @param  obj - an object, the one to init
             *    @param    defaultObj - an object, the default object
             *    @return obj - an object, the one init'd
             */
            obj = obj || defaultObj;
            for (var key in defaultObj) {
                if (!(key in obj) || key === 'toString') {
                    obj[key] = defaultObj[key];
                }
            }
            return obj;
        };

        var assert = m.assert = (function () {
            /**
             * An object that facilitates unit tests.
             */
            var passes = 0, fails = 0;
            var failStrings = [];
            var tests = [];
            return {
                eq : function (uno, dos, statement) {
                    var testFunc = function test(testObj) {
                        console.log(tests.length, statement);
                        var unoString = typeof uno === 'undefined' ? 'undefined' : uno.toString();
                        var dosString = typeof dos === 'undefined' ? 'undefined' : dos.toString();
                        console.log('    asserting '+unoString+' === '+dosString);
                        if (uno !== dos) {
                            var failString = '('+uno+' !== '+dos+') '+assert.suite+' - '+statement;
                            console.log('    ERROR '+failString);
                            testObj.failString = failString;
                            return false;
                        }
                        return true;
                    };
                    var testObj = {
                        test : testFunc
                    };
                    testObj.success = testObj.test(testObj);
                    tests.push(testObj);
                },
                stat : function () {
                    console.log('\n');
                    var fails = 0;
                    for (var i = 0; i < tests.length; i++) {
                        var test = tests[i];
                        if ('failString' in test) {
                            if (fails === 0) {
                                console.log('FAIL...');
                            }
                            console.log('    '+ i + ' ' + test.failString);
                            fails++;
                        }
                    }
                    if (fails === 0) {
                        console.log('OKAY!');
                    }
                    console.log('passes:'+(tests.length - fails)+' fails:'+fails);
                },
                suite : 'Generic Tests',
                tests : tests
            };
        })();

        m.requestAnimation = function (animationFunction) {
            /** * *
            * Calls *animationFunction* over and over again.
            * @param - animationFunction Function - The function to call over and over, repeatedly.
            * @returns - Function
            * * **/
            var request = window.requestAnimationFrame       ||
                          window.webkitRequestAnimationFrame ||
                          window.mozRequestAnimationFrame    ||
                          window.onRequestAnimationFrame     ||
                          window.msRequestAnimationFrame     ||
                          function (callback) {
                              setTimeout(callback, 1000/12);
                              return callback;
                          };
            var animation = {
                id : 0
            };
            var animate = function (time) {
                /**
                 * Calls the animation function and schedules another call.
                 * 
                 */
                // Update the animation id first
                animation.id = request(animate);
                animationFunction(time);
            };

            animation.id = request(animate);
            return animation;
        };
        
        m.cancelAnimation = function (animation) {
            /** * *
            * Cancels an animation request returned by m.requestAnimation.
            * @param - animationFunction Function
            * * **/
            var timeout = function (id) {
                clearTimeout(id);
            };
                         
            var cancel = window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.cancelAnimationFrame || timeout;

            cancel(animation.id);
        };
        
        m.safeAddin = function safeAddin (obj, key, value) {
            /**
             * Adds *value* to *obj* as the property *key*, unless *key*
             * already exists on *obj*.
             * @param - obj Object - The object to add *value* to.
             * @param - key String - The property name of *value*.
             * @param - value Object - Some object to add to *obj*.
             */
            if (!(key in obj)) {
                obj[key] = value;
                return true;
            }
            return false;
        };
        
        m.safeOverride = function safeOverride (obj, key, superKey, value) {
            /** * *
            * Adds *value* to *obj* as the property *key*. If *key*
            * already exists the existing *key* is stored on *obj*
            * as *superKey*.
            * @param - obj Object - The object to add *value* to.
            * @param - key String - The property name of *value*.
            * @param - superKey String - The new property name of the super value.
            * @param - value Object - Some object to add to *obj*.
            * * **/
            if (key.toString() in obj) {
                var superValue = obj[key];
                obj[key] = value;
                return m.safeAddin(obj, superKey, superValue);
            } else {
                obj[key] = value;
            }
        };
        
        // a unique id for created objects.
        var _uniqueId = 0;
        m.Object = function (self) {
            /**
             * Creates an initial object used in Addins. 
             * @param - self Object
             * @return - Object
             */
            if (!m.defined(self)) {
                self = {};
            }
            
            if (!m.defined(self.tag)) {
                self.tag = (_uniqueId++).toString();
            }
            m.safeAddin(self, 'addToString', function Global_addToString(newToString) {
                /** * *
                * Adds another toString function to the object.
                * @param - newToString Function
                * * **/
                if (self.toString().indexOf(newToString()) === -1) {
                    if ('toString' in self) {
                        var oldToString = self.toString;
                        self.toString = function () {
                            return newToString()+'+'+oldToString();
                        };
                    } else {
                        self.toString = newToString;
                    }
                }
            });
            
            self.toString = function () {
                return '['+self.tag.toString()+']';
            };
            
            return self;
        };
        
        m.objectIsKindOfObject = function(object, kindOf) {
            /** * *
            * TODO: Finish this by comparing properties.
            * * **/
            return false;
        };

        (function Global_setupLogging() {
            /**
             *    Logs a message to console (if available)
             */
            if (window.console) {
                return;
            }
            window.console = {};
            window.console.log = function () {};
            window.console.trace = function () {};
        })();

        (function Global_implementObjectCreate() {
            /**
             *    Provides prototypal inheritance for all objects.
             *
             *    @author Douglas Crockford
             */
            if (typeof Object.create !== 'function') {
                Object.create = function (o) {
                    function F() {}
                    F.prototype = o;
                    return new F();
                };
            }
        })();
        // return the global object
        return {};
    }
});