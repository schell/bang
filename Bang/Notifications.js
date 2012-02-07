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
    dependencies : [ 'Bang/Global.js', 'Bang/Note/Listener.js', 'Bang/Note/Dispatcher.js', 'Bang/Note/NoteCenter.js', 'Bang/Note/Note.js' ],
    init : function initNote (m) {
        /**
         * Initializes the family of system notifications.
         * @param - m Object - The mod modules object.
         */
         return {
             View : {
                 DID_UPDATE_CONTEXT : 'didUpdateContext',
                 WAS_ADDED_TO_VIEWCONTAINER : 'wasAddedToViewContainer',
             },
             ViewContainer : {
                 DID_ADD_SUBVIEW : 'didAddSubview', 
             },
             Stage : {
                 FRAME_TICK : 'frameTick',
             },
             Bitmap : {
                 DID_LOAD : 'didLoad',
                 DID_NOT_LOAD : 'didNotLoad'
             }
         };
    }
});
