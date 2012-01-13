/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    NoteCenterTests.js
 *    The NoteCenterTests module.
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 18:46:58 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'NoteTests',
    dependencies : [ 'Note.js' ],
    init : function initNoteCenterTests (m) {
        /**
         * Initializes the NoteCenterTests 
         * @param - m Object - The mod modules object.
         */
         
        // aliases
        var ifndefInit = m.ifndefInit;
        var ifndefInitObj = m.ifndefInitObj;
        var safeAddin = m.safeAddin;
        var assert = m.assert;
        var Note = m.Note;
        var NoteCenter = m.NoteCenter;
        var Observer = m.Observer;
        
        assert.testSuite = 'Note tests';
        
        var ec = NoteCenter();
        var dispatcher = {hi:'hi there, im a dispatcher...'};
        // Some browsers won't let us use Note() because it already exists so we'll
        // use the shorthand addin
        var note = Note.from(dispatcher,'bigNote');
        var calls = 0;
        var observer = Observer({
            note:note,
            callback : function test (n) {
                calls++;
            }
        });
        ec.addObserver(observer);
        ec.dispatch(note);
        assert.eq(calls, 1, 'NoteCenter can register observers and dispatch notes.');
        
        ec.removeObserver(observer);
        ec.dispatch(note);
        assert.eq(calls, 1, 'NoteCenter can remove observers.');
        
        var nameObserver = Observer({
            note : Note.from(undefined, 'asdf'),
            callback : function test (n) {
                calls++;
            }
        });
        ec.addObserver(nameObserver);
        ec.dispatch(Note.from({},'asdf'));
        assert.eq(calls, 2, 'NoteCenter can dispatch notes to observers listening for just names.');
        
        var objectObserver = Observer({
            note : Note.from(ec),
            callback : function test (n) {
                calls++;
            }
        });
        ec.addObserver(objectObserver);
        ec.dispatch(Note.from(ec, 'this name should not matter...'));
        assert.eq(calls, 3, 'NoteCenter can dispatch notes to observers listening for just objects.');
        
        return {};
    }
});