/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* NotePasser.js
* The NotePasser Addin
* This mostly provides a default NoteCenter instance for Dispatcher and Listener instances.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Jan 17 21:02:17 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'NotePasser',
    dependencies : [ 'Global.js', 'Note/NoteCenter.js' ],
    init : function initNotePasser (m) {
        /** * *
        * Initializes the NotePasser Addin
        * @param - m Object - The mod modules object.
        * * **/
        
        var defaultNoteCenter;
        
        var addin = function addinNotePasser (self) {
            /**
             * Adds NotePasser properties to *self*.
             * @param - self Object - The object to add NotePasser properties to.
             * @return self NotePasser Object 
             */
            self = m.Object(self); 
            
            self.addToString(function NotePassert_toString() {
                return '[NotePasser]';
            });
            
            defaultNoteCenter = defaultNoteCenter || m.NoteCenter();
            
            m.safeAddin(self, 'noteCenter', defaultNoteCenter);
            
            return self;
        };
        
        return addin;
    }
});
