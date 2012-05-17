/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Listener.js
 *    The Listener Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 18:33:06 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/  
mod({
    name : 'Listener',
    dependencies : [ 'bang::Global.js', 'bang::Note/NoteCenter.js' ],
    init : function initListener (m) {
        /**
         * Initializes the Listener Addin
         * @param {Object} The mod modules object.
         */
        
        var addin = function addinListener (self) {
            /**
             * Adds Listener properties to *self*.
             * @param - self Object - The object to add Listener properties to.
             * @return self Listener Object 
             */
            self =Object(self); 
            
           safeAddin(self, 'tag', 'Listener');
            
            // Add in NotePasser properties...
           NotePasser(self);
            
           safeAddin(self, 'addListener', function View_addNoteListener(dispatcher, noteName, callback) {
                /**
                 * Listens for notes named *noteName* dispatched from *dispatcher*. Calls *callback* when
                 * received.
                 */
                var listener = self;
                dispatcher =ifndefInitObj(dispatcher, undefined);
                noteName =ifndefInit(noteName, undefined);
                callback =ifndefInit(callback, function blankCallback(note) {});
                
                self.noteCenter.addListener(listener, dispatcher, noteName, callback);
            });
            
           safeAddin(self, 'removeListener', function _name (dispatcher, noteName) {
                /**
                 * Stops listening for notes named *noteName* dispatched from *dispatcher*.
                 */
                var listener = self;
                dispatcher =ifndefInitObj(dispatcher, undefined);
                noteName =ifndefInitObj(noteName, undefined);
                self.noteCenter.removeListener(listener, dispatcher, noteName);
            });
            
            return self;
        };
        
        return addin;
        
    }
});
