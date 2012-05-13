/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*    Global.js
*    A set of functions added right into the top modules object.
*    Copyright (c) 2012 . All rights reserved.
*
*    @author    Schell Scivally
*    @since    Tue Jan 10 20:05:33 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Global',
    dependencies : [],
    /**
    * Initializes Global.
    * Defines functions inside mod's module object that all of Bang will need.
    * @param - m Object - mod's module object.
    */
    init : function initGlobal (m) {
        /**
        * An object that facilitates unit tests.
        * @type {object}
        */
        m.assert = (function () {
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
        
        /** * *
        * A private array to hold all the current animations.
        * @type {Array.<object>}
        * * **/
        var _animations = [];
        /** * *
        * Calls *animationFunction* over and over again.
        * @param - animationFunction Function - The function to call over and over, repeatedly.
        * @returns - Function
        * * **/
        m.requestAnimation = function (animationFunction) {
            var request = window.requestAnimationFrame       ||
                          window.webkitRequestAnimationFrame ||
                          window.mozRequestAnimationFrame    ||
                          window.onRequestAnimationFrame     ||
                          window.msRequestAnimationFrame     ||
                          function (callback) {
                              setTimeout(callback, 1000/60);
                              return callback;
                          };
            var animation = {
                id : 0,
                cancelled : false
            };
            
            // Store a reference to the animation...
            _animations.push(animation);

            /** * *
            * Calls the animation function and schedules another call.
            * @param {number}
            * * **/
            var animate = function (time) {
                time = time || Date.now();
                
                if (animation.cancelled !== false) {
                    // Abort if the animation has been cancelled...
                    return;
                }
                // Update the animation id...
                animation.id = animation.cancelled ? false : request(animate);
                // Animate...
                animationFunction(time);
            };

            animation.id = request(animate);
            return animation;
        };

        /** * *
        * Cancels an animation request returned by m.requestAnimation.
        * @param {object}
        * * **/
        m.cancelAnimation = function(animation) {
            var timeout = function(id) {
                clearTimeout(id);
            };
                         
            var cancel = window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.cancelAnimationFrame || timeout;
            animation.cancelled = true;
            cancel(animation.id);
            
            // Remove the animation from our list...
            var ndx = _animations.indexOf(animation);
            if (ndx !== -1) {
                _animations.splice(ndx, 1);
            }
        };

        /** * *
        * Cancels all animations currently registered.
        * * **/
        m.cancelAllAnimations = function() {
            while (_animations.length) {
                m.cancelAnimation(_animations[0]);
            }
        };

        /** * *
        * Returns the number of registered animations.
        * @return {number}
        * * **/
        m.animationCount = function() {
            return _animations.length;
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

        return {};
    }
});