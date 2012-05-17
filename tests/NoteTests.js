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
    dependencies : [ 'bang::Global.js', 'bang::Note/NoteCenter.js', 'bang::Note/Listener.js', 'bang::Note/Dispatcher.js' ],
    init : function initNoteCenterTests (m) {
        /**
         * Initializes the NoteCenterTests 
         * @param {Object} The mod modules object.
         */
        return function runNoteCenterTests(callback) {
            // aliases
            var ifndefInit =ifndefInit;
            var ifndefInitObj =ifndefInitObj;
            var safeAddin =safeAddin;
            var assert =assert;
            var Note =Note;
            var NoteCenter =NoteCenter;
            var Listener =Listener;
            var Dispatcher =Dispatcher;
        
            (function NoteCenter_tests() {
                assert.suite = 'NoteCenter tests';
        
                var ec = NoteCenter();
                var dispatcher = {hi:'hi there, im a dispatcher...'};
                var listener = {hi:'hi there, im a listener...'};
                var anotherListener = {hi:'hi there, im another listener...'};
                var note = Note.from(dispatcher,'bigNote');
                var calls = 0;
                var testCalls = function testCalls(n) {
                        calls++;
                };
                ec.addListener(listener, dispatcher, 'bigNote', testCalls);
        
                assert.eq(ec.totalListeners(), 1, 'NoteCenter can add interests.');
        
                ec.dispatch(note);
                assert.eq(calls, 1, 'NoteCenter can dispatch notes.');
        
                ec.removeListener(listener, dispatcher, 'bigNote');
                assert.eq(ec.totalListeners(), 0, 'NoteCenter can remove interests.');
        
                ec.dispatch(note);
                assert.eq(calls, 1, 'Removing interests stops dispatching of notes.');
        
                ec.addListener(listener, undefined, 'asdf', testCalls);
                ec.addListener(anotherListener, undefined, 'asdf', testCalls);
                var noteWithoutDispatcher = Note({
                    name : 'asdf'
                });
                ec.dispatch(noteWithoutDispatcher);
                assert.eq(calls, 3, 'NoteCenter can dispatch notes to observers listening for just names.');
        
                var objectListener = {hi:'hi there, i only listener for objects...'};
                ec.addListener(objectListener, dispatcher, undefined, testCalls);
                var noteWithoutName = Note({
                    dispatcher : dispatcher
                });
                var noteWithNameAndObject = Note({
                    dispatcher : dispatcher,
                    name : 'blahblah'
                });
                ec.dispatch(noteWithoutName);
                ec.dispatch(noteWithNameAndObject);
                assert.eq(calls, 5, 'NoteCenter can dispatch notes to observers listening for just objects.');
        
                ec.removeListener(listener, undefined, 'asdf');
                ec.removeListener(anotherListener, undefined, 'asdf');
                assert.eq(ec.totalListeners(), 1, 'NoteCenter can remove observers listening for just note names.');
        
                ec.removeListener(objectListener, dispatcher, undefined);
                assert.eq(ec.totalListeners(), 0, 'NoteCenter can remove observers listening forjust objects.');
            })();
        
            (function Listener_Dispatcher_tests() {
                assert.suite = 'Listener/Dispatcher Tests';
            
                var listener = Listener({
                    tag : 'listener'
                });
                var dispatcher = Dispatcher({
                    tag : 'dispatcher'
                });
                var payload = false;
                var callback = function(note) {
                    payload = note.body;
                };
                listener.addListener(dispatcher, 'a note name', callback);
                dispatcher.sendNotification('a note name', 666);
                assert.eq(payload, 666, 'Listeners can receive notification from dispatchers.');
            
                listener.removeListener(dispatcher, 'a note name');
                dispatcher.sendNotification('a note name', 777);
                assert.eq(payload, 666, 'Listeners can remove interests.');
            
                var itself =Object({
                    tag : 'itself'
                });
                Listener(itself);
                Dispatcher(itself);
                var listensToItself = false;
                itself.addListener(itself, 'asdf', function asdfCallback(n) {
                    listensToItself = true;
                });
                itself.sendNotification('asdf', 666);
                assert.eq(listensToItself, true, 'Listeners can listen to themselves.');
                
                listener.addListener(dispatcher, 'asdf', function(){});
                var listForASDF = listener.noteCenter.dispatchersOfNoteWithName('asdf');
                var compareList = [itself,dispatcher];
                assert.eq(listForASDF.toString(), compareList.toString(), 'NoteCenter can return list of dispatchers of note name.');
            })();
            
            callback();
        };
    }
});