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
            
            // A private alpha value...
            var _alpha = 1.0;
            m.safeAddin(self, 'alpha', function View_alpha(a) {
                /** * *
                * Getter/setter for this view's alpha (transparency) value.
                * This is a getter/setter just for consistency's sake with x,y,scaleX,scaleY...
                * @param - a Number
                * @returns - Number
                * * **/
                _alpha = m.ifndefInitNum(a, _alpha);
                return _alpha;
            });
            
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
            // A private var to hold the scaleX...
            var _scaleX = 1.0;
            m.safeAddin(self, 'scaleX', function View_scaleX(x) {
                /** * *
                * Getter/setter for the scale factor in x of this view.
                * @param - x Number
                * @returns - Number
                * * **/
                
                _scaleX = m.ifndefInitNum(x, _scaleX);
                self.transform.scaleX(x);
                return _scaleX;
            });
            // A private var to hold the scaleY...
            var _scaleY = 1.0;
            m.safeAddin(self, 'scaleY', function View_scaleY(y) {
                /** * *
                * Getter/setter for the scale factor in y of this view.
                * @param - y Number
                * @returns - Number
                * * **/
                _scaleY = m.ifndefInitNum(y, _scaleY);
                self.transform.scaleY(y);
                return _scaleY;
            });
            // A private var to hold this view's rotation...
            var _rotation = 0;
            m.safeAddin(self, 'rotation', function View_rotation(r) {
                /** * *
                * Getter/setter for the rotation of this view.
                * @param - r Number
                * @returns - Number
                * * **/
                _rotation = m.ifndefInitNum(r, _rotation) % 360;
                // Store all the other transform values...
                var store = {
                    x : self.x(),
                    y : self.y(),
                    scaleX : self.scaleX(),
                    scaleY : self.scaleY()
                };
                var mat = m.Matrix().rotate(_rotation);
                self.transform.elements = mat.elements;
                // Reset those other values we stored...
                self.x(store.x);
                self.y(store.y);
                //self.z(store.z);
                //self.scaleX(store.scaleX);
                //self.scaleY(store.scaleY);
                //self.scaleZ(store.scaleZ);
                return _rotation;
            });
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
                
                var a = self.transform.a();
                var b = self.transform.b();
                var c = self.transform.c();
                var d = self.transform.d();
                var x = self.transform.x();
                var y = self.transform.y();
                
                self.context.transform(a,b,c,d,x,y);
                self.context.globalAlpha *= _alpha;
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
            
            function onTransformLoadsIdentity(note) {
                _rotation = 0;
                _scaleX = 1.0;
                _scaleY = 1.0;
            }
            self.addInterest(self.transform, m.Notifications.DID_LOAD_IDENTITY, onTransformLoadsIdentity);
            
            return self;
        };
        
        return addin;
        
    }
});
