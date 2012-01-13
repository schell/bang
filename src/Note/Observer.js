/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Observer.js
 *    The Observer Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 17:55:22 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Observer',
    dependencies : [ 'Global.js', 'Note.js' ],
    init : function initObserver (m) {
        /**
         * Initializes the Observer Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinObserver (self) {
            /**
             * Adds Observer properties to *self*.
             * @param - self Object - The object to add Observer properties to.
             * @return self Observer Object 
             */
            self = m.ifndefInitObj(self, m.initialObject()); 
            
            m.safeAddin(self, 'note', m.Note());
            m.safeAddin(self, 'callback', function Observer_callback (event) {
                /**
                 *  A generic callback.
                 */
                console.log('Observer.js - generic observer callback',note.toString());
            });
            m.safeAddin(self, 'consumesNote', false);
            return self;
        };
        
        return addin;
        
    }
});
