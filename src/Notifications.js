/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Notifications.js
 *    Basically a big list of notification names.
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 17:29:26 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Notifications',
    dependencies : [ 'Global.js', 'Note/Listener.js', 'Note/Dispatcher.js', 'Note/NoteCenter.js', 'Note/Note.js' ],
    init : function initNote (m) {
        /**
         * Initializes the family of system notifications.
         * @param - m Object - The mod modules object.
         */
         return {
             DID_UPDATE_CONTEXT : 'didUpdateContext',
             DID_ADD_SUBVIEW : 'didAddView',
             WAS_ADDED_TO_VIEWCONTAINER : 'wasAddedToViewContainer',
             FRAME_TICK : 'frameTick',
             DID_LOAD_IDENTITY : 'didLoadIdentity'
         };
    }
});
