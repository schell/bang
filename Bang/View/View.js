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
            
            m.safeAddin(self, 'tag', 'View');
            
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
            
            // A reference to this view's stage (the root of the display tree)
            m.safeAddin(self, 'stage', undefined);
            
            m.safeAddin(self, 'alpha', 1.0);
            
            m.safeAddin(self, 'x', 0.0);
            m.safeAddin(self, 'y', 0.0);
            m.safeAddin(self, 'scaleX', 1.0);
            m.safeAddin(self, 'scaleY', 1.0);
            m.safeAddin(self, 'rotation', 0.0);
            //--------------------------------------
            //  COORDINATE TRANSFORMATIONS
            //--------------------------------------
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
            m.safeAddin(self, 'getCompoundTransform', function View_getCompoundTransform(invert) {
                /** * *
                * Returns a transformation matrix that represents this view's complete transform,
                * with the transformations of its parent views applied (in global space).
                * @returns - Matrix
                * * **/
                // Using this inverse method is kind of a hack...the cleaner way to do this is to 
                // get the regular compound transform and then invert it, but that takes longer
                // as we have to get the compound transform first anyway, so this saves time...
                invert = invert || false;
                var i = invert ? -1 : 1;
                
                // Get this view's transformation matrix...
                var matrix = m.Matrix();
                if (invert) {
                    matrix.scale(1/self.scaleX, 1/self.scaleY);
                    matrix.rotate(-self.rotation);
                    matrix.translate(-self.x, -self.y);
                } else {
                    matrix.translate(self.x, self.y);
                    matrix.rotate(self.rotation);
                    matrix.scale(self.scaleX, self.scaleY);
                }

                if (!m.defined(self.parent)) {
                    // There is no parent reference, so this view does not
                    // belong to a display list, return only this matrix...
                    return  matrix;
                }
                
                // Recurse up the display tree and get the compound transform...
                var compoundTransform = self.parent.getCompoundTransform(invert);
                
                if (invert) {
                    return matrix.multiply(compoundTransform);
                }
                return compoundTransform.multiply(matrix);
            });
            m.safeAddin(self, 'convertPolygonToGlobal', function View_convertPolygonToGlobal(poly) {
                /** * *
                * Converts *poly* from this view's coordinate space to the stage's coordinate space.
                * @param - poly Polygon
                * @return - Polygon
                * * **/
                return self.getCompoundTransform().transformPolygon(poly);
            });
            m.safeAddin(self, 'convertPolygonToLocal', function View_convertPolygonToLocal(poly) {
                /** * *
                * Converts *poly* from global coordinate space to this view's coordinate space.
                * @param - poly Polygon
                * @return - Polygon
                * * **/
                return self.getCompoundTransform(true).transformPolygon(poly);
            });
            m.safeAddin(self, 'convertPolygonToView', function View_convertPolygonToView(poly, view) {
                /** * *
                * Converts a polygon in this view's coordinate space to *view*'s coordinate space.
                * @param - view View
                * @param - poly Polygon
                * @return - polygon
                * * **/
                var toGlobalTransform = self.getCompoundTransform();
                var toLocalTransform = view.getCompoundTransform(true);
                return toLocalTransform.transformPolygon(toGlobalTransform.transformPolygon(poly));
            });
            m.safeAddin(self, 'convertPolygonFromView', function View_convertPolygonFromView(poly, view) {
                /** * *
                * Converts a polygon in this view's coordinate space to *view*'s coordinate space.
                * @param - view View
                * @param - poly Polygon
                * @return - polygon
                * * **/
                var toGlobalTransform = view.getCompoundTransform();
                var toLocalTransform = self.getCompoundTransform(true);
                return toLocalTransform.transformPolygon(toGlobalTransform.transformPolygon(poly));
            });
            //--------------------------------------
            //  DRAWING
            //--------------------------------------
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
            m.safeAddin(self, 'addHitAreaDrawFunction', function View_addHitAreaDrawFunction(fill, stroke) {
                /** * *
                * Adds a draw function to the drawQueue that draws this view's hitArea.
                * @param - color String - something like 'rgba(0, 0, 0, 0.5)'
                * * **/
                fill = m.ifndefInit(fill, 'rgba(0,0,0,0.5)');
                stroke = m.ifndefInit(stroke, 'rgba(0,0,0,0.8)');
                var drawFunc = function () {
                    self.context.save();
                    self.context.fillStyle = fill;
                    self.context.strokeStyle = stroke;
                    self.context.beginPath();
                    self.context.moveTo(self.hitArea.elements[0], self.hitArea.elements[1]);
                    for (var i=2; i <= self.hitArea.elements.length; i+=2) {
                        var x = self.hitArea.elements[i];
                        var y = self.hitArea.elements[i+1];
                        self.context.lineTo(x, y);
                    }
                    self.context.closePath();
                    self.context.fill();
                    self.context.stroke();
                    self.context.restore();
                };
                self.drawQueue.push(drawFunc);
            });
            //--------------------------------------
            //  INTERESTS
            //--------------------------------------
            m.safeAddin(self, 'onParentUpdatedContext', function View_onParentUpdatedContext(note) {
                self.context = note.body;
                self.sendNotification(m.Notifications.View.DID_UPDATE_CONTEXT, self.context);
            });
            
            m.safeAddin(self, 'onAddedToViewContainer', function View_onAddedToViewContainer(note) {
                if (m.defined(self.parent)) {
                    // Stop listening to the old parent...
                    self.removeInterest(self.parent);
                }
                // Update...
                self.parent = note.body;
                self.stage = self.parent.stage;
                self.context = self.parent.context;
                self.addInterest(self.parent, m.Notifications.View.DID_UPDATE_CONTEXT, self.onParentUpdatedContext);
                // Notify
                self.sendNotification(m.Notifications.View.DID_UPDATE_CONTEXT, self.context);
            });
            self.addInterest(self, m.Notifications.View.WAS_ADDED_TO_VIEWCONTAINER, self.onAddedToViewContainer);
            
            return self;
        };
        
        return addin;
        
    }
});
