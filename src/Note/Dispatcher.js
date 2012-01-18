/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Dispatcher.js
 *    The Dispatcher Addin.
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Tue Jan 17 15:30:50 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Dispatcher',
    dependencies : [ 'Note/Note.js', 'Note/NotePasser.js', 'Note/NoteCenter.js' ],
    init : function initDispatcher (m) {
        /**
         * Initializes the Dispatcher Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinDispatcher (self) {
            /**
             * Adds Dispatcher properties to *self*.
             * @param - self Object - The object to add Dispatcher properties to.
             * @return self Dispatcher Object 
             */
            self = m.ifndefInitObj(self, m.initialObject()); 
            
            // Add in NotePasser properties
            m.NotePasser(self);
            
            m.safeAddin(self, 'dispatch', function Dispatcher_dispatch(note) {
                /**
                 * Dispatches *note* to this dispatcher's note center.
                 */
                note.dispatcher = self;
                self.noteCenter.dispatch(note);
            });
            
            m.safeAddin(self, 'sendNotification', function Dispatcher_sendNotification(name, body) {
                /**
                 * Dispatches a note with *name* and *body* to this dispatcher's note center.
                 */
                var note = m.Note({
                    dispatcher : self,
                    name : name, 
                    body : body
                });
                self.dispatch(note);
            });
            
            self.addToString(function Dispatcher_toString() {
                return '[Dispatcher]';
            });
            
            return self;
        };
        
        return addin;
        
    }
});