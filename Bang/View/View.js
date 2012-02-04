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
    dependencies : [ 'Bang/Global.js', 'Bang/Notifications.js', 'Bang/Geometry.js' ],
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
            
            m.safeAddin(self, 'alpha', 1.0);
            
            m.safeAddin(self, 'x', 0.0);
            m.safeAddin(self, 'y', 0.0);
            m.safeAddin(self, 'scaleX', 1.0);
            m.safeAddin(self, 'scaleY', 1.0);
            m.safeAddin(self, 'rotation', 0.0);
            // Whether or not this view's transformations have been applied...
            var _transformApplied = false;
            m.safeAddin(self, 'applyTransform', function View_applyTransform() {
                /** * *
                * Applies this view's transform to its context.
                * * **/
                if (_transformApplied) {
                    return;
                }
                _transformApplied = true;
                
                self.context.save();
                
                self.context.translate(self.x, self.y);
                self.context.rotate(m.Geometry.ONE_DEGREE*self.rotation);
                self.context.scale(self.scaleX, self.scaleY);
                self.context.globalAlpha *= self.alpha;
            });
            m.safeAddin(self, 'restoreTransform', function View_restoreTransform() {
                /** * *
                * Restores the context to its state before applying the transforming
                * operations of this view.
                * * **/
                if (_transformApplied) {
                    _transformApplied = false;
                    self.context.restore();
                }
            });
            
            m.safeAddin(self, 'draw', function View_draw() {
                /** * *
                * Draws this view into the 2d context.
                * * **/
                self.applyTransform();
                
                for (var i=0; i < self.drawQueue.length; i++) {
                    var drawFunc = self.drawQueue[i];
                    drawFunc();
                }
                
                self.restoreTransform();
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
