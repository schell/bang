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
    dependencies : [ 'Global.js', 'Note/Note.js' ],
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
            
            function packObserver(listener, dispatcher, noteName, callback) {
                /**
                 * Packs up a listener, note and callback.
                 */
                return {
                    listener : listener,
                    dispatcher : dispatcher,
                    name : noteName,
                    callback : callback
                };
            }
            
            m.safeAddin(self, 'totalInterests', function NoteCenter_totalInterests() {
                /**
                 * Returns the total number of stored interests.
                 * @return - Number
                 */
                return _observers.length;
            });
            
            m.safeAddin(self, 'addInterest', function NoteCenter_addInterest(listener, dispatcher, name, callback) {
                /**
                 * Registers *listener* as interested in receiving notifications of *name*, 
                 * coming from *dispatcher*. Calls *callback* when notes of this type get dispatched.
                 */
                
                // At the very least we need a listener, a callback and a dispatcher or a note name
                if (!m.defined(listener)) {
                    throw new Error('Listener must be defined.');
                } else if (!m.defined(callback)) {
                    throw new Error('Callback must be defined.');
                } else if (!m.defined(dispatcher) && !m.defined(name)) {
                    throw new Error('At least on of either dispatcher or note name must be defined.');
                }
                
                var observer = packObserver(listener, dispatcher, name, callback);
                _observers.push(observer);
            });
            
            m.safeAddin(self, 'dispatch', function NoteCenter_dispatch (note) {
                /**
                 * Dispatches *note* to listening observers.
                 * @param - note Note
                 */
                if (!m.defined(note)) {
                    throw new Error('Note to dispatch must be defined.');
                }
                
                var callback = function NoteCenter_dispatch_callback(observer, note) {
                    /**
                     * Calls the observer's callback function and sets *dispatched*.
                     */
                    observer.callback.call(observer.listener, note);
                };
                
                for (var i = _observers.length - 1; i >= 0; i--){
                    var observer = _observers[i];
                    
                    if (m.defined(observer.dispatcher)) {
                        // This observer is listening to a specific object.
                        if (observer.dispatcher === note.dispatcher) {
                            // This observer is listening to this specific object.
                            if (m.defined(observer.name)) {
                                // This observer is listening for a specific notification.
                                if (observer.name === note.name) {
                                    // This observer is listening for this specific notification.
                                    callback(observer, note);
                                    continue;
                                }
                            } else {
                                // This observer is listening for any notes from this specific object.
                                callback(observer, note);
                                continue;
                            }
                        }
                    } else if (m.defined(observer.name) && observer.name === note.name) {
                        // This observer is listening to all notifications with this name, 
                        // coming from no specific object.
                        callback(observer, note);
                        continue;
                    }
                }
            });
            
            m.safeAddin(self, 'removeInterest', function NoteCenter_removeInterest(listener, dispatcher, name, callback) {
                if (!m.defined(listener)) {
                    throw new Error('Listener must be defined.');
                } else if (!m.defined(dispatcher) && !m.defined(name)) {
                    throw new Error('At least on of either dispatcher or note name must be defined.');
                }
                
                for (var i=0; i < _observers.length; i++) {
                    var observer = _observers[i];
                    if (observer.listener === listener) {
                        // We found an observer with this listener...
                        if (m.defined(dispatcher) && m.defined(name)) {
                            // We want to remove interests with this dispatcher and a specific name...
                            if (m.defined(observer.dispatcher) && observer.dispatcher === dispatcher) {
                                // This observer is listening to this dispatcher...
                                if (m.defined(observer.name) && observer.name === name) {
                                    // This observer is listening for this specific notification...
                                    _observers.splice(i, 1);
                                    i--;
                                    continue;
                                }
                            }
                        } else if (m.defined(dispatcher) && m.defined(observer.dispatcher) && dispatcher === observer.dispatcher) {
                            // We want to remove all interests from this listener with this dispatcher...
                            _observers.splice(i, 1);
                            i--;
                            continue;
                        } else if (m.defined(name) && m.defined(observer.name) && name === observer.name) {
                            // We want to remove all interests from this listener with this note name...
                            _observers.splice(i, 1);
                            i--;
                            continue;
                        }
                    }
                }
            });
            
            self.addToString(function NoteCenter_toString() {
                return '[NoteCenter]';
            });
            
            return self;
        };
        
        // A default note center for our listeners and dispatchers to use...
        addin.defaultNoteCenter = addin();
        
        return addin;
        
    }
});
