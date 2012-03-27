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
    dependencies : [ 'bang::Global.js', 'bang::Note/Listener.js', 'bang::Note/Dispatcher.js', 'bang::Note/NoteCenter.js', 'bang::Note/Note.js' ],
    init : function initNote (m) {
        /**
         * Initializes the family of system notifications.
         * @param - m Object - The mod modules object.
         */
         return {
             View : {
                 // Sent from a View just after that view updates its drawing context...
                 DID_UPDATE_CONTEXT : 'didUpdateContext',
                 // Sent from a View after being added to a ViewContainer...
                 WAS_ADDED_TO_VIEWCONTAINER : 'wasAddedToViewContainer',
                 // Sent from a View after being removed from a ViewContainer...
                 WAS_REMOVED_FROM_VIEWCONTAINER : 'wasRemovedFromViewContainer',
                 // Sent from a View just after the user mouses on said View...
                 MOUSE_DOWN : 'mouseDown',
                 MOUSE_UP : 'mouseUp',
                 MOUSE_CLICK : 'mouseClick',
                 MOUSE_MOVE : 'mouseMove',
                 MOUSE_OVER : 'mouseOver',
                 MOUSE_OUT : 'mouseOut',
                 MOUSE_LEAVE : 'mouseLeave'
             },
             ViewContainer : {
                 // Sent from a ViewContainer after adding a subview, just after said subview sends WAS_ADDED_TO_VIEWCONTAINER
                 DID_ADD_SUBVIEW : 'didAddSubview',
                 // Sent from a ViewContainer after removing a subview, just before said subview sends WAS_REMOVED_FROM_VIEWCONTAINER
                 DID_REMOVE_SUBVIEW : 'didRemoveSubview'
             },
             Stage : {
                 // Sent from the Stage every frame just before rendering...
                 FRAME_TICK : 'frameTick'
             },
             Bitmap : {
                 // Sent from a Bitmap after loading an image...
                 DID_LOAD : 'didLoad',
                 // Sent from a Bitmap after failing to load an image...
                 DID_NOT_LOAD : 'didNotLoad'
             }
         };
    }
});
