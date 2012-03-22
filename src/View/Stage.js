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
    dependencies : [ 'bang::View/ViewContainer.js', 'bang::Geom/Matrix.js', 'bang::Note/MouseEventNote.js' ],
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
            if (self.hitArea.width() === 0 || self.hitArea.height() === 0) {
                self.hitArea = m.Rectangle.from(0,0,500,500);
            }
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
            m.safeAddin(self, 'setParentElement', function Stage_setParentElement(id) {
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
            function createMouseEvent(eventName, nativeEvent) {
                /** * *
                * Fires a mouse down event into the display list. This function is meant to be attached
                * to a canvas's onmousedown callback.
                * @param - nativeEvent MouseEvent
                * * **/
                var x = nativeEvent.offsetX;
                var y = nativeEvent.offsetY;
                // Get all the dispatchers that could potentially send this notification (because something is listening)...
                var dispatchersOfMouseEvent = self.noteCenter.dispatchersOfNoteWithName(eventName);
                // Sort them so the top views are last...
                dispatchersOfMouseEvent.sort(sortByNdxInDisplayList);
                // Run backward through the list...
                for (var i = dispatchersOfMouseEvent.length - 1; i >= 0; i--){
                    var potentialDispatcher = dispatchersOfMouseEvent[i];
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
                                name : eventName,
                                localPoint : localPoint,
                                globalPoint : globalPoint,
                                target : potentialDispatcher,
                                body : nativeEvent
                            });
                            return note;
                        }
                    }
                }
                // If nothing was found, return false...
                return false;
            }
            m.safeAddin(self, 'fireMouseDownEvent', function Stage_mouseDown(nativeEvent) {
                /** * *
                * Dispatches a mouse down event.
                * * **/
                var mouseEventNote = createMouseEvent(m.Notifications.View.MOUSE_DOWN, nativeEvent);
                if (mouseEventNote) {
                    mouseEventNote.target.dispatch(mouseEventNote);
                }
            });
            m.safeAddin(self, 'fireMouseUpEvent', function Stage_mouseUp(nativeEvent) {
                /** * *
                * Dispatches a mouse up event.
                * * **/
                var mouseEventNote = createMouseEvent(m.Notifications.View.MOUSE_UP, nativeEvent);
                if (mouseEventNote) {
                    mouseEventNote.target.dispatch(mouseEventNote);
                }
            });
            m.safeAddin(self, 'fireMouseClickEvent', function Stage_mouseUp(nativeEvent) {
                /** * *
                * Dispatches a mouse up event.
                * * **/
                var mouseEventNote = createMouseEvent(m.Notifications.View.MOUSE_CLICK, nativeEvent);
                if (mouseEventNote) {
                    mouseEventNote.target.dispatch(mouseEventNote);
                }
            });
            // A private boolean to hold whether or not ANY views have been moused over...
            m.safeAddin(self, 'fireMouseMoveEvent', function Stage_mouseMove(nativeEvent) {
                /** * *
                * Dispatches a mouse move event or a mouse over.
                * * **/
                var mouseEventNote = createMouseEvent(m.Notifications.View.MOUSE_MOVE, nativeEvent);
                var overView = false;
                if (mouseEventNote) {
                    overView = mouseEventNote.target;
                    if (overView.$mouseSettings.mousedOver === false) {
                        // Intercept this mouseMove and change it into a mouseOver...
                        overView.$mouseSettings.mousedOver = true;
                        mouseEventNote.name = m.Notifications.View.MOUSE_OVER;
                    }
                    mouseEventNote.target.dispatch(mouseEventNote);
                } 
                
                // Fire mouseOut events for previously moused over
                // views, as long as there are some...
                for (var i = _displayList.length - 1; i >= 0; i--){
                    var view = _displayList[i];
                    if (view === overView) {
                        continue;
                    }
                    if (view.$mouseSettings.mousedOver === true) {
                        var globalPoint = m.Point({
                            elements : [
                                nativeEvent.offsetX,
                                nativeEvent.offsetY
                            ]
                        });
                        var localPoint = view.convertPolygonToLocal(globalPoint.copy());
                        if (view.hitArea.containsPoint(localPoint)) {
                            continue;
                        } else {
                            view.$mouseSettings.mousedOver = false;
                            var mouseOutEvent = m.MouseEventNote({
                                name : m.Notifications.View.MOUSE_OUT,
                                globalPoint : globalPoint,
                                localPoint : undefined,
                                target : view,
                                body : nativeEvent
                            });
                            view.dispatch(mouseOutEvent);
                        }
                    }
                }
            });
            self.canvas.onmousedown = self.fireMouseDownEvent;
            self.canvas.onmouseup = self.fireMouseUpEvent;
            self.canvas.onclick = self.fireMouseClickEvent;
            self.canvas.onmousemove = self.fireMouseMoveEvent;
            self.canvas.onmouseout = function mouseOutAll(nativeEvent) {
                var globalPoint = m.Point({
                    elements : [
                        nativeEvent.offsetX,
                        nativeEvent.offsetY
                    ]
                });
                
                for (var i = _displayList.length - 1; i >= 0; i--){
                    var view = _displayList[i];
                    if (view.$mouseSettings.mousedOver === true) {
                        view.$mouseSettings.mousedOver = false;
                        var mouseOutEvent = m.MouseEventNote({
                            name : m.Notifications.View.MOUSE_OUT,
                            globalPoint : globalPoint,
                            localPoint : undefined,
                            target : view,
                            body : nativeEvent
                        });
                        view.dispatch(mouseOutEvent);
                    }
                }
            };
            return self;
        };
        
        return addin;
        
    }
});
