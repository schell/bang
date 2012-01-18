/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Note.js
 *    The Note family of addins.
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 17:29:26 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'NoteFamily',
    dependencies : [ 'Global.js', 'Note/Listener.js', 'Note/Dispatcher.js', 'Note/NoteCenter.js', 'Note/Note.js' ],
    init : function initNote (m) {
        /**
         * Initializes the family of Note Addins
         * @param - m Object - The mod modules object.
         */
         return {Note:m.Note, Listener:m.Listener, NoteCenter:m.NoteCenter, Observer:m.Observer};
    }
});
