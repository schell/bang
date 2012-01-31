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
    dependencies : [ 'Global.js', 'Notifications.js', 'Geometry.js' ],
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
            
            // Addin properties of Listener...
            m.Listener(self);
            
            // Addin properties of Dispatcher...
            m.Dispatcher(self);
            
            // An array to hold draw functions...
            m.safeAddin(self, 'drawQueue', []);
            
            // A Rectangle specifying the hit area of this object...
            m.safeAddin(self, 'hitArea', m.Rectangle());
            
            // A reference to the canvas context...
            m.safeAddin(self, 'context', undefined);
            
            // A reference to this view's parent container...
            m.safeAddin(self, 'parent', undefined);
            
            // A transformation matrix...
            m.safeAddin(self, 'transform', m.Matrix().loadIdentity());
            
            m.safeAddin(self, 'x', function View_x(x) {
                /** * *
                * Gets and/or sets the x position of this view.
                * @param - x Number
                * * **/
                return self.transform.x(x);
            });
            m.safeAddin(self, 'y', function View_y(y) {
                /** * *
                * Gets and/or sets the y position of this view.
                * @param - y Number
                * * **/
                return self.transform.y(y);
            });
            m.safeAddin(self, 'applyTransform', function View_applyTransform() {
                /** * *
                * Applies this view's transform to its context.
                * * **/
                var a = self.transform.a();
                var b = self.transform.b();
                var c = self.transform.c();
                var d = self.transform.d();
                var x = self.transform.x();
                var y = self.transform.y();
                
                self.context.transform(a,b,c,d,x,y);
            });
            
            m.safeAddin(self, 'draw', function View_draw() {
                self.context.save();
                
                self.applyTransform();
                
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
