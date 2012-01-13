/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    NoteCenter.js
 *    The NoteCenter Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 17:47:40 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'NoteCenter',
    dependencies : [ 'Global.js', 'Note.js', 'Note/Observer.js' ],
    init : function initNoteCenter (m) {
        /**
         * Initializes the NoteCenter Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinNoteCenter (self) {
            /**
             * Adds NoteCenter properties to *self*.
             * @param - self Object - The object to add NoteCenter properties to.
             * @return self NoteCenter Object 
             */
            self = m.ifndefInitObj(self, m.initialObject()); 
            
            // protected observers array
            var _observers = [];
            
            m.safeAddin(self, 'addObserver', function NoteCenter_addObserver (observer) {
                /**
                 * Adds *observer* to the array of observers.
                 */
                if (!m.defined(observer)) {
                    // Maybe we should throw an error here?
                    return;
                }
                
                _observers.push(observer);
            });
            
            // Some helper functions for determining what an observer is listening for...
            function isListeningForThisNote (observer, note) {
                if (observer.note.name === note.name && observer.note.dispatcher === note.dispatcher) {
                    return true;
                }
                return false;
            };
            function isListeningForAllNotesFromObject (observer, dispatcher) {
                if (!m.defined(observer.note.name) && observer.note.dispatcher === dispatcher) {
                    return true;
                }
                return false;
            };
            function isListeningForAllNotesWithName (observer, name) {
                if (!m.defined(observer.dispatcher) && observer.note.name === name) {
                    return true;
                }
                return false;
            };
            
            m.safeAddin(self, 'dispatch', function NoteCenter_dispatch (note) {
                /**
                 * Dispatches *note* to listening observers.
                 * @param - note Note
                 */
                for (var i = _observers.length - 1; i >= 0; i--){
                    var observer = _observers[i];
                    var noteGotEaten = false;
                    var callback = function NoteCenter_dispatch_callback() {
                        /**
                         * Calls the observer's callback function and sets *dispatched*.
                         */
                        observer.callback.call(observer.listener, note);
                        if (observer.consumesNote) {
                            // Don't pass the note on.
                            noteGotEaten = true;
                        }
                    };
                    if (!m.defined(observer.note)) {
                        // We need an note 
                        continue;
                    }
                    if (isListeningForThisNote(observer, note)) {
                        // The observer is listening for this particular note on this particular object,
                        // so dispatch!
                        callback();
                    } else if (isListeningForAllNotesFromObject(observer, note.dispatcher)) {
                        // The observer is listening for all notes from this particular object,
                        // so dispatch!
                        callback();
                    } else if (isListeningForAllNotesWithName(observer, note.name)) {
                        // The observer is listening for all notes with this particular name,
                        // so dispatch!
                        callback();
                    }
                    
                    if (noteGotEaten) {
                        return;
                    }
                }
            });
            
            m.safeAddin(self, 'removeObserver', function NoteCenter_removeObserver (observer) {
                var ndx = _observers.indexOf(observer);
                while (ndx !== -1) {
                    _observers.splice(ndx, 1);
                    ndx = _observers.indexOf(observer);
                }
            });
            
            self.addToString(function NoteCenter_toString() {
                return '[NoteCenter]';
            });
            
            return self;
        };
        
        return addin;
        
    }
});
