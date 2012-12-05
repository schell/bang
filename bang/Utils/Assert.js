/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Assert.js
* Defines the base type object.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Apr 24 10:28:43 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Assert',
    dependencies : [  ],
    init : function initType () {
        /** * *
        * Initializes the assert object.
        * * **/
        //--------------------------------------
        //  ADDITIONS TO WINDOW
        //--------------------------------------
        /**
        *    Logs a message to console (if available)
        */
        (function Animation_setupLogging() {
            if (window.console) {
                return;
            }
            window.console = {};
            window.console.log = function () {};
            window.console.trace = function () {};
        })();

        /**
        * An object that facilitates unit tests.
        */
        var assert = window.assert = (function () {
            var passes = 0, fails = 0;
            var failStrings = [];
            var tests = [];
            var console = window.console;
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
        //--------------------------------------
        //  ASSERT
        //--------------------------------------
        function Assert() {
            // Just a dummy constructor
            return {};
        }
        
        Assert.prototype = {};
        
        return Assert;
    }
});
