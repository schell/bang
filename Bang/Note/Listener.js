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
    dependencies : [ 'Bang/Global.js', 'Bang/Note/NoteCenter.js' ],
    init : function initListener (m) {
        /**
         * Initializes the Listener Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinListener (self) {
            /**
             * Adds Listener properties to *self*.
             * @param - self Object - The object to add Listener properties to.
             * @return self Listener Object 
             */
            self = m.Object(self); 
            
            m.safeAddin(self, 'tag', 'Listener');
            
            // Add in NotePasser properties...
            m.NotePasser(self);
            
            m.safeAddin(self, 'addInterest', function View_addNoteListener(dispatcher, noteName, callback) {
                /**
                 * Listens for notes named *noteName* dispatched from *dispatcher*. Calls *callback* when
                 * received.
                 */
                var listener = self;
                dispatcher = m.ifndefInitObj(dispatcher, undefined);
                noteName = m.ifndefInit(noteName, undefined);
                callback = m.ifndefInit(callback, function blankCallback(note) {});
                
                self.noteCenter.addInterest(listener, dispatcher, noteName, callback);
            });
            
            m.safeAddin(self, 'removeInterest', function _name (dispatcher, noteName) {
                /**
                 * Stops listening for notes named *noteName* dispatched from *dispatcher*.
                 */
                var listener = self;
                dispatcher = m.ifndefInitObj(dispatcher, undefined);
                noteName = m.ifndefInitObj(noteName, undefined);
                self.noteCenter.removeInterest(listener, dispatcher, noteName);
            });
            
            return self;
        };
        
        return addin;
        
    }
});
