/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    View.js
 *    The View Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Mon Jan 16 12:31:02 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'View',
    dependencies : [ 'Global.js', 'Notifications.js', 'Geom.js' ],
    init : function initView(m) {
        /**
         * Initializes the View Addin
         * @param - m Object - The mod modules object.
         */     
        
        var addin = function addinView(self) {
            /**
             * Adds View properties to *self*.
             * @param - self Object - The object to add View properties to.
             * @return self View Object 
             */
            self = m.Object(self); 
            
            self.addToString(function View_toString() {
                return '[View]';
            });
            
            // Addin properties of Listener
            m.Listener(self);
            
            // Addin properties of Dispatcher
            m.Dispatcher(self);
            
            // A Rectangle specifying the hit area of this object
            m.safeAddin(self, 'frame', m.Rectangle());
            
            // A reference to the canvas context
            m.safeAddin(self, 'context', undefined);
            
            // A reference to this view's parent container...
            m.safeAddin(self, 'parent', undefined);
            
            // The rotation of this view
            m.safeAddin(self, 'rotation', 0);
            // The scale size of this view
            m.safeAddin(self, 'scale', m.Size.from(1.0, 1.0));
            
            // An array to hold draw functions
            m.safeAddin(self, 'drawQueue', []);
            
            m.safeAddin(self, 'draw', function View_draw() {
                self.context.save();
                self.context.translate(self.frame.origin.x, self.frame.origin.y);
                self.context.rotate(self.rotation);
                self.context.scale(self.scale.width, self.scale.height);
                
                for (var i=0; i < self.drawQueue.length; i++) {
                    var drawFunc = self.drawQueue[i];
                    drawFunc();
                }
                
                self.context.restore();
            });
            
            //--------------------------------------
            //  Interests
            //--------------------------------------
            m.safeAddin(self, 'onParentUpdatedContext', function View_onParentUpdatedContext(note) {
                self.context = note.body;
                self.sendNotification(m.Notifications.DID_UPDATE_CONTEXT, self.context);
            });
            
            m.safeAddin(self, 'onAddedToViewContainer', function View_onAddedToViewContainer(note) {
                if (m.defined(self.parent)) {
                    // Stop listening to the old parent...
                    self.removeInterest(self.parent);
                }
                // Update...
                self.parent = note.body;
                self.context = self.parent.context;
                self.addInterest(self.parent, m.Notifications.DID_UPDATE_CONTEXT, self.onParentUpdatedContext);
                // Notify
                self.sendNotification(m.Notifications.DID_UPDATE_CONTEXT, self.context);
            });
            self.addInterest(self, m.Notifications.WAS_ADDED_TO_VIEWCONTAINER, self.onAddedToViewContainer);
            
            return self;
        };
        
        return addin;
        
    }
});
