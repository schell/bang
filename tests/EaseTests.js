/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* EaseTests.js
* Tests for the Ease Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Jan 31 09:25:46 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'EaseTests',
    dependencies : [ 'Ease/Ease.js' ],
    init : function initEaseTests (m) {
        /** * *
        * Initializes the EaseTests
        * @param - m Object - The mod modules object.
        * * **/
        var assert = m.assert;
        assert.testSuite = 'Ease Tests';
        
        return {};
    }
});
