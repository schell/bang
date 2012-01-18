/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* ViewTests.js
* Testing for the View Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Jan 17 16:36:44 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'ViewTests',
    dependencies : [ 'View/View.js' ],
    init : function initViewTests (m) {
        /** * *
        * Initializes the ViewTests
        * @param - m Object - The mod modules object.
        * * **/
        var assert = m.assert;
        assert.testSuite = 'View Tests';
        
        var view = m.View();
        var payload = false;
        var callback = function(note) {
            payload = note.body;
        };
        view.addInterest(view, 'a note name', callback);
        view.dispatch(m.Note({
            name : 'a note name',
            body : 666
        }));
        assert.eq(payload, 666, 'View can add interests and dispatch notifications.');
           
        view.removeInterest(view, 'a note name');
        view.dispatch(m.Note({
            name : 'a note name',
            body : 777
        }));
        assert.eq(payload, 666, 'View can remove interests.');
        
        return {};
    }
});
