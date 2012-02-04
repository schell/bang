/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    ListenerTests.js
 *    Tests for the Listener Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Tue Jan 17 11:16:04 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'ListenerTests',
    dependencies : [ 'Bang/Note/Listener.js' ],
    init : function initListenerTests (m) {
        /**
        * Initializes the ListenerTests
        * @param - m Object - The mod modules object.
        */
        
        return function runDispatcherTests (callback) {
            callback();
        }
    }
});
