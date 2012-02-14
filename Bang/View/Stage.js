/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Stage.js
* The Stage Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Sat Jan 21 17:38:39 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Stage',
    dependencies : [ 'Bang/View/ViewContainer.js', 'Bang/Geom/Matrix.js', 'Bang/Note/MouseEventNote.js' ],
    init : function initStage (m) {
        /**
         * Initializes the Stage Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinStage (self) {
            /**
             * Adds Stage properties to *self*.
             * @param - self Object - The object to add Stage properties to.
             * @return self Stage Object 
             */
            self = m.Object(self); 
            
            
            // Addin ViewContainer...
            m.ViewContainer(self);
            
            self.toString = function() {
                return '[Stage]';
            };
            
            // Some default values...
            self.hitArea = m.Rectangle.from(0, 0, 500, 500);
            // Whether or not we clear the canvas before redrawing...
            m.safeAddin(self, 'clearCanvasOnFrameTick', true);
            // Set this view's stage reference to itself, so other views can grab it...
            self.stage = self;
            // A reference to the 2D canvas rendering context...
            m.safeAddin(self, 'context', undefined);
            //--------------------------------------
            //  INITILIZATION WITH DOM
            //--------------------------------------
            m.safeAddin(self, 'canvas', function Stage_initCanvas() {
                var canvas = document.createElement('canvas');
                canvas.width = self.hitArea.width();
                canvas.height = self.hitArea.height();
                canvas.id = 'Bang_'+Math.random().toString().substr(2);
                self.context = canvas.getContext('2d');
                return canvas;
            }());
            // A private reference to the canvas's containing element...
            var _parentElement;
            // A private reference to the stage's animation...
            var _animation;
            m.safeAddin(self, 'setParentElement', function Stage_setContainerDiv(id) {
                /** * *
                * Sets the div id of the Stage's parent container.
                * @param - id String - The id of the div that will contain the stage.
                * * **/
                _parentElement = document.getElementById(id.toString());
                if (!_parentElement) {
                    throw new Error('Could not find html element '+id.toString());
                }
                _parentElement.appendChild(self.canvas);
            });
            m.safeAddin(self, 'remove', function Stage_remove() {
                /** * *
                * Removes the stage from its parent element and stops execution.
                * * **/
                m.cancelAllAnimations();
                _parentElement.removeChild(self.canvas);
            });
            //--------------------------------------
            //  DRAWING
            //--------------------------------------
            m.safeOverride(self, 'draw', 'viewContainer_draw', function Stage_draw() {
                // Send out a global hitArea tick notification...
                self.sendNotification(m.Notifications.Stage.FRAME_TICK);
                // Clear the stage...
                if (self.clearCanvasOnFrameTick) {
                    self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);    
                }
                // Draw the stage...
                self.viewContainer_draw();
            });
            // set up drawing
            _animation = m.requestAnimation(self.draw);
            //--------------------------------------
            //  INTERESTS
            //--------------------------------------
            // A private, up-to-date, flattened version of the entire display list...
            var _displayList = [];
            function compileDisplayList() {
                /** * *
                * Compiles a flattened display list.
                * * **/
                function flattenChildrenOf(view) {
                    var list = [view];
                    if ('subviews' in view && (typeof view.subviews === 'function')) {
                        // This view has children, add them...
                        var subviews = view.subviews();
                        for (var i=0; i < subviews.length; i++) {
                            list = list.concat(flattenChildrenOf(subviews[i]));
                        }
                    } 
                    return list;
                }
                _displayList = flattenChildrenOf(self, _displayList);
            }
            m.safeAddin(self, 'displayList', function Stage_displayList() {
                /** * *
                * Returns a copy of the flattened display list.
                * @return - Array
                * * **/
                return _displayList.map(function(el,ndx,a) {
                    return el;
                });
            });
            self.addInterest(undefined, m.Notifications.ViewContainer.DID_ADD_SUBVIEW, compileDisplayList);
            self.addInterest(undefined, m.Notifications.ViewContainer.DID_REMOVE_SUBVIEW, compileDisplayList);
            //--------------------------------------
            //  MOUSE INPUT HANDLING
            //--------------------------------------
            function sortByNdxInDisplayList(a, b) {
                /** * *
                * A mouse event helper that sorts dispatchers (most important last)
                * * **/
                var andx = _displayList.indexOf(a);
                var bndx = _displayList.indexOf(b);
                return andx - bndx;
            }   
            
            m.safeAddin(self, 'fireMouseDownEvent', function Stage_fireMouseDownEvent(nativeEvent) {
                /** * *
                * Fires a mouse down event into the display list. This function is meant to be attached
                * to a canvas's onmousedown callback.
                * @param - nativeEvent MouseEvent
                * * **/
                var x = nativeEvent.offsetX;
                var y = nativeEvent.offsetY;
                // Get all the dispatchers that could potentially send this notification (because something is listening)...
                var dispatchersOfMouseDown = self.noteCenter.dispatchersOfNoteWithName(m.Notifications.View.MOUSE_DOWN);
                // Sort them so the top views are last...
                dispatchersOfMouseDown.sort(sortByNdxInDisplayList);
                // Run backward through the list...
                for (var i = dispatchersOfMouseDown.length - 1; i >= 0; i--){
                    var potentialDispatcher = dispatchersOfMouseDown[i];
                    if (m.defined(potentialDispatcher.hitArea)) {
                        // Get the dispatcher's hitArea in global coords...
                        var poly = potentialDispatcher.hitArea.copy();
                        var globalPoint = m.Point({
                            elements : [
                                x, y
                            ]
                        });
                        var localPoint = potentialDispatcher.convertPolygonToLocal(globalPoint.copy());
                        var hit = poly.containsPoint(localPoint);
                        if (hit) {
                            var note = m.MouseEventNote({
                                localPoint : localPoint,
                                globalPoint : globalPoint,
                                target : potentialDispatcher,
                                body : nativeEvent
                            });
                            potentialDispatcher.dispatch(note);
                            //TODO: possibly bubble the event up the display list - here or in the View...
                            return;
                        }
                    }
                }
            });
            self.canvas.onmouseup = self.fireMouseDownEvent;
            return self;
        };
        
        return addin;
        
    }
});
