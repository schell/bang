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
    dependencies : [ 'bang::Global.js', 'bang::Graphics/Graphics.js', 'bang::Geometry/Rectangle.js', 'bang::Geometry/Matrix.js', 'bang::Geometry/Geometry.js', 'bang::Note/Listener.js', 'bang::Note/Dispatcher.js' ],
    init : function initView(m) {
        /** * *
        * Initializes the View Addin
        * @param - m Object - The mod modules object.
        * * **/     
        //--------------------------------------
        //  THE ADDIN
        //--------------------------------------
        var addin = function addinView(self) {
            /** * *
            * Adds View properties to *self*.
            * @param - self Object - The object to add View properties to.
            * @return self View Object  
            * * **/
            self = m.Object(self); 
            //--------------------------------------
            //  PROPERTIES
            //--------------------------------------
            
            // A tag...
            m.safeAddin(self, 'tag', 'View');
            
            // Addin properties of Listener...
            m.Listener(self);
            
            // Addin properties of Dispatcher...
            m.Dispatcher(self);
            
            // This view's graphics context...
            m.safeAddin(self, 'graphics', m.Graphics());
            
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
            
            // A special cache of mouse settings (used by Stage.js during mouse events...)
            m.safeAddin(self, '$mouseSettings', {
                mousedOver : false
            });
            //--------------------------------------
            //  COORDINATE TRANSFORMATIONS
            //--------------------------------------
            // Whether or not this view's transformations have been applied...
            var _transformApplied = false;
            m.safeAddin(self, 'applyTransform', function View_applyTransform(context) {
                /** * *
                * Applies this view's transform to a context. The caller must call restoreTransform
                * before the transform can be applied to another context.
                * @param CanvasRenderingContext2D
                * * **/
                if (_transformApplied) {
                    return;
                }
                _transformApplied = true;
                
                context.save();
                
                context.translate(self.x, self.y);
                context.rotate(m.Geometry.ONE_DEGREE*self.rotation);
                context.scale(self.scaleX, self.scaleY);
                context.globalAlpha *= self.alpha;
            });
            m.safeAddin(self, 'restoreTransform', function View_restoreTransform(context) {
                /** * *
                * Restores the context to its state before applying the transforming
                * operations of this view.
                * * **/
                if (_transformApplied) {
                    _transformApplied = false;
                    context.restore();
                }
            });
            m.safeAddin(self, 'getTransformationElements', function View_getTransformationMatrixElements(invert) {
                /** * *
                * Returns the local transformation matrix elements.
                * @param - invert Boolean
                * @return - Array
                * * **/
                var elements = m.Matrix.identityElements();
                
                if (invert) {
                    elements = m.Matrix.scaleElements(elements, 1/self.scaleX, 1/self.scaleY);
                    elements = m.Matrix.rotateElements(elements, -self.rotation);
                    elements = m.Matrix.translateElements(elements, -self.x, -self.y);
                } else {
                    elements = m.Matrix.translateElements(elements, self.x, self.y);
                    elements = m.Matrix.rotateElements(elements, self.rotation);
                    elements = m.Matrix.scaleElements(elements, self.scaleX, self.scaleY);
                }
                return elements;
            });
            m.safeAddin(self, 'getTransformation', function View_getTransformationMatrix(invert) {
                /** * *
                * Returns the local transformation matrix.
                * @param - invert Boolean
                * @return - Matrix
                * * **/
                return m.Matrix({elements : self.getTransformationElements(invert)});
            });
            m.safeAddin(self, 'getCompoundTransformElements', function View_getCompoundTransformElements(invert) {
                /** * *
                * Returns transformation matrix elements that represent this view's complete transform,
                * with the transformations of its parent views applied (in global space).
                * @returns - Array
                * * **/
                // Using this inverse method is kind of a hack...the cleaner way to do this is to 
                // get the regular compound transform and then invert it, but that takes longer
                // as we have to get the compound transform first anyway, so this saves time...
                invert = invert || false;
                var i = invert ? -1 : 1;
                
                // Get this view's transformation matrix...
                var transform = self.getTransformationElements(invert);

                if (!m.defined(self.parent)) {
                    // There is no parent reference, so this view does not
                    // belong to a display list, return only this matrix...
                    return transform;
                }
                
                // Recurse up the display tree and get the compound transform...
                var compoundTransform = self.parent.getCompoundTransformElements(invert);
                
                if (invert) {
                    return m.Matrix.multiplyElements(transform, compoundTransform);
                }
                return m.Matrix.multiplyElements(compoundTransform, transform);
            });
            m.safeAddin(self, 'getCompoundTransform', function View_getCompoundTransformMatrix(invert) {
                /** * *
                * Returns a transformation matrix that represents this view's complete transform,
                * with the transformations of its parent views applied (in global space).
                * @returns - Matrix
                * * **/
                return m.Matrix({elements : self.getCompoundTransformElements(invert)});
            });
            m.safeAddin(self, 'convertPolygonToGlobal', function View_convertPolygonToGlobal(poly) {
                /** * *
                * Converts *poly* from this view's coordinate space to the stage's coordinate space.
                * @param - poly Polygon
                * @return - Polygon
                * * **/
                return m.Matrix({
                    elements : self.getCompoundTransformElements()
                }).transformPolygon(poly);
            });
            m.safeAddin(self, 'convertPolygonToLocal', function View_convertPolygonToLocal(poly) {
                /** * *
                * Converts *poly* from global coordinate space to this view's coordinate space.
                * @param - poly Polygon
                * @return - Polygon
                * * **/
                return m.Matrix({
                    elements : self.getCompoundTransformElements(true)
                }).transformPolygon(poly);
            });
            m.safeAddin(self, 'convertPolygonToView', function View_convertPolygonToView(poly, view) {
                /** * *
                * Converts a polygon in this view's coordinate space to *view*'s coordinate space.
                * @param - view View
                * @param - poly Polygon
                * @return - polygon
                * * **/
                var toGlobalTransform = m.Matrix({elements : self.getCompoundTransformElements()});
                var toLocalTransform = m.Matrix({elements : view.getCompoundTransformElements(true)});
                return toLocalTransform.transformPolygon(toGlobalTransform.transformPolygon(poly));
            });
            m.safeAddin(self, 'convertPolygonFromView', function View_convertPolygonFromView(poly, view) {
                /** * *
                * Converts a polygon in this view's coordinate space to *view*'s coordinate space.
                * @param - view View
                * @param - poly Polygon
                * @return - polygon
                * * **/
                var toGlobalTransform = m.Matrix({elements : view.getCompoundTransformElements()});
                var toLocalTransform = m.Matrix({elements : self.getCompoundTransformElements(true)});
                return toLocalTransform.transformPolygon(toGlobalTransform.transformPolygon(poly));
            });
            //--------------------------------------
            //  DRAWING
            //--------------------------------------
            m.safeAddin(self, 'draw', function View_draw(context) {
                /** * *
                * Draws this view into the 2d context.
                * @param CanvasRenderingContext2D
                * * **/
                self.applyTransform(context);
                
                // Now draw this element into the provided graphics context...
                context.drawImage(self.graphics.context.canvas, 0, 0);
                
                self.restoreTransform(context);
            });
            m.safeAddin(self, 'dirtyRectangle', function View_dirtyRectangle() {
                /** * *
                * Returns the LOCAL dirty rectangle for this view.
                * @return Rectangle
                * * **/
                return m.Rectangle.from(0, 0, self.graphics.canvas.width, self.graphics.canvas.height);
            });
            m.safeAddin(self, 'drawPolygon', function View_addHitAreaDrawFunction(polygon, fill, stroke) {
                /** * *
                * Adds a draw function to the drawQueue that draws this view's hitArea.
                * @param - color String - something like 'rgba(0, 0, 0, 0.5)'
                * * **/
                fill = m.ifndefInit(fill, 'rgba(0,0,0,0.5)');
                stroke = m.ifndefInit(stroke, 'rgba(0,0,0,0.8)');
                self.graphics.save();
                self.graphics.fillStyle = fill;
                self.graphics.strokeStyle = stroke;
                self.graphics.beginPath();
                self.graphics.moveTo(polygon.elements[0], polygon.elements[1]);
                for (var i=2; i <= polygon.elements.length; i+=2) {
                    var x = polygon.elements[i];
                    var y = polygon.elements[i+1];
                    self.graphics.lineTo(x, y);
                }
                self.graphics.closePath();
                self.graphics.fill();
                self.graphics.stroke();
                self.graphics.restore();
            });
            //--------------------------------------
            //  EVENT/NOTIFICATION
            //--------------------------------------
            m.safeAddin(self, 'bubbleMouseEvent', function View_bubbleMouseEvent(eventNotification) {
                /** * *
                * Bubbles a mouse event up to the parent view.
                * @param - Notification
                * * **/
                if (m.defined(self.parent)) {
                    var matrix = self.getTransformationMatrix();
                    matrix.transformPolygon(eventNotification.localPoint);
                    eventNotification.target = self.parent;
                    self.parent.dispatch(eventNotification);
                }
            });
            //--------------------------------------
            //  INTERESTS
            //--------------------------------------
            m.safeAddin(self, 'onParentUpdatedContext', function View_onParentUpdatedContext(note) {
                self.context = note.body;
                self.sendNotification(addin.DID_UPDATE_CONTEXT, self.context);
            });
            
            m.safeAddin(self, 'onAddedToViewContainer', function View_onAddedToViewContainer(note) {
                if (m.defined(self.parent)) {
                    // Stop listening to the old parent...
                    self.removeListener(self.parent);
                }
                // Update...
                self.parent = note.body;
                self.stage = self.parent.stage;
                self.context = self.parent.context;
                self.addListener(self.parent, addin.DID_UPDATE_CONTEXT, self.onParentUpdatedContext);
                // Notify
                self.sendNotification(addin.DID_UPDATE_CONTEXT, self.context);
            });
            self.addListener(self, addin.WAS_ADDED_TO_VIEWCONTAINER, self.onAddedToViewContainer);
            
            return self;
        };
        //--------------------------------------
        //  NOTIFICATIONS SENT BY THIS ADDIN
        //--------------------------------------
        // All events sent by this addin...
        var events = {
            // Sent from a View after being added to a ViewContainer...
            WAS_ADDED_TO_VIEWCONTAINER : 'wasAddedToViewContainer',
            // Sent from a View after being removed from a ViewContainer...
            WAS_REMOVED_FROM_VIEWCONTAINER : 'wasRemovedFromViewContainer',
            // Sent from a View just after that view updates its drawing context...
            DID_UPDATE_CONTEXT : 'didUpdateContext',
            // Sent from a View just after the user mouses on said View...
            MOUSE_DOWN : 'mouseDown',
            MOUSE_UP : 'mouseUp',
            MOUSE_CLICK : 'mouseClick',
            MOUSE_MOVE : 'mouseMove',
            MOUSE_OVER : 'mouseOver',
            MOUSE_OUT : 'mouseOut'
        };
        m.safeAddinAllPropertiesOf(addin, events);
        
        return addin;
        
    }
});
