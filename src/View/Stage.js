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
    dependencies : [ 'bang::View/ViewContainer.js', 'bang::Geometry/Matrix.js', 'bang::Note/MouseEventNote.js', 'bang::Utils/Pool.js' ],
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
            
            // Whether or not we clear the canvas before redrawing...
            m.safeAddin(self, 'clearCanvasOnFrameTick', true);
            // Set this view's stage reference to itself, so other views can grab it...
            self.stage = self;
            //--------------------------------------
            //  INITILIZATION WITH DOM
            //--------------------------------------
            m.safeAddin(self, 'compositeContext', function Stage_initCanvas() {
                var canvas = document.createElement('canvas');
                canvas.width = self.hitArea.width();
                canvas.height = self.hitArea.height();
                canvas.id = 'Bang_'+Math.random().toString().substr(2);
                return canvas.getContext('2d');
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
                switch (typeof id) {
                    case 'string':
                        _parentElement = document.getElementById(id);
                    break;
                    case 'object':
                        _parentElement = id;
                    break;
                    default:
                        _parentElement = false;
                }
                if (!_parentElement) {
                    throw new Error('Could not find html element '+id.toString());
                }
                _parentElement.appendChild(self.compositeContext.canvas);
            });
            m.safeAddin(self, 'remove', function Stage_remove() {
                /** * *
                * Removes the stage from its parent element and stops execution.
                * * **/
                m.cancelAllAnimations();
                _parentElement.removeChild(self.compositeContext.canvas);
            });
            //--------------------------------------
            //  DISPLAY LIST
            //--------------------------------------
            // A private, up-to-date, flattened version of the entire display list...
            var _displayList = [self];
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
            //--------------------------------------
            //  TICKING/DIRTY RECTANGLES
            //--------------------------------------
            // A var to hold our dirty views - we make
            // one here to save on allocation every frame...
            var _dirtyViews = [];
            // A var to hold our matrix transforms...
            var _dirtyTransform = m.Matrix();
            m.safeAddin(self, 'getGlobalDirtyRectangleForView', function Stage_getGlobalDirtyRectangleForView(view) {
                /** * *
                * Returns the enclosing dirty rectangle in global coordinates for a given view.
                * @param View
                * @return Rectangle
                * * **/
                var rect = dirtyView.dirtyRectangle();
                var transform = dirtyView.getCompoundTransformMatrix();
                // Transformed dirty rectangle...
                var tdr = transform.transformPolygon(rect.copy());
                var x1 = tdr.polygon_left();
                var y1 = tdr.polygon_top();
                var x2 = tdr.polygon_right();
                var y2 = tdr.polyong_bottom();
                var globalDirtyRect = m.Rectangle.from(x1, y1, x2-x1, y2-y1);
                return globalDirtyRect;
            });
            m.safeAddin(self, 'tick', function Stage_tick() {
                /** * *
                * Called every frame.
                * Steps all animations and other on-frame events.
                * * **/
                _dirtyViews.length = 0;
                // A naive dirty rectangles implementation...
                for (var i = _displayList.length - 1; i >= 0; i--) {
                    var view = _displayList[i];
                    if (view.graphics.isDirty) {
                        _dirtyViews.push(view);
                    }
                    if (view === self) {
                        _dirtyViews = [self];
                    }
                }
                /*
                while (_dirtyViews.length) {
                    var dirtyView = _dirtyViews.shift();
                    var rect = self.getGlobalDirtyRectangleForView(dirtyView);
                    // Clear that rectangle...
                    self.graphics.clearRect(rect.x(), rect.y(), rect.width(), rect.height());
                    // Run through all the views and draw where they intersect this rect...
                    // This would be a good place to optimize with R-trees...
                    
                }
                */
                // Just for now draw the stage...
                if (self.compositeContext.canvas.width != self.graphics.canvas.width ||
                    self.compositeContext.canvas.height != self.graphics.canvas.height) {
                    self.compositeContext.canvas.width = self.graphics.canvas.width;
                    self.compositeContext.canvas.height = self.graphics.canvas.height;
                }
                self.compositeContext.clearRect(0, 0, self.compositeContext.canvas.width, self.compositeContext.canvas.height);
                self.compositeContext.drawImage(self.graphics.canvas, 0, 0);
                // Send out a global tick notification...
                self.sendNotification(m.Stage.FRAME_TICK);
                
                // !!! Full repaint every frame...
                self.graphics.isDirty = true;
            });
            // set up frame tick
            _animation = m.requestAnimation(self.tick);
            //--------------------------------------
            //  INTERESTS
            //--------------------------------------
            self.addListener(undefined, m.ViewContainer.DID_ADD_SUBVIEW, compileDisplayList);
            self.addListener(undefined, m.ViewContainer.DID_REMOVE_SUBVIEW, compileDisplayList);
            //--------------------------------------
            //  MOUSE INPUT POOLING
            //--------------------------------------
            var pool = m.Pool.sharedInstance();
            var pointPond = 'MousePoint';
            var eventPond = 'MouseEvent';
            if (!pool.pondExists(pointPond)) {
                pool.addPond(pointPond, function createMousePoint() {
                    return m.Point();
                }, function(){}, function(){});
            }
            function getMousePoint(nativeEvent) {
                var point = pool.get(pointPond);
                if (nativeEvent) {
                    point.elements[0] = nativeEvent.offsetX;
                    point.elements[1] = nativeEvent.offsetY;
                }
                return point;
            }
            function tossMousePoint(mp) {
                return pool.toss(mp);
            }
            if (!pool.pondExists(eventPond)) {
                pool.addPond(eventPond, function createNote() {
                    return m.MouseEventNote();
                }, function(){}, function(){});
            }
            function getMouseNote() {
                return pool.get(eventPond);
            }
            function tossMouseNote(mn) {
                return pool.toss(mn);
            }
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
            function createMouseNote(eventName, nativeEvent) {
                /** * *
                * Fires a mouse down event into the display list. This function is meant to be attached
                * to a canvas's onmouse* callback.
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
                        var globalPoint = getMousePoint();
                        globalPoint.elements[0] = x;
                        globalPoint.elements[1] = y;
                        
                        var localPoint = getMousePoint();
                        localPoint.elements[0] = x;
                        localPoint.elements[1] = y;
                        localPoint = potentialDispatcher.convertPolygonToLocal(localPoint);
                        
                        var hit = poly.containsPoint(localPoint);
                        if (hit) {
                            var note = getMouseNote();
                                note.name = eventName;
                                note.localPoint = localPoint;
                                note.globalPoint = globalPoint;
                                note.target = potentialDispatcher;
                                note.body = nativeEvent;

                            tossMousePoint(globalPoint);
                            tossMousePoint(localPoint);
                            return note;
                        }
                        
                        tossMousePoint(globalPoint);
                        tossMousePoint(localPoint);
                    }
                }
                // If nothing was found, return false...
                return false;
            }
            m.safeAddin(self, 'fireMouseDownEvent', function Stage_mouseDown(nativeEvent) {
                /** * *
                * Dispatches a mouse down event.
                * * **/
                var mouseEventNote = createMouseNote(m.View.MOUSE_DOWN, nativeEvent);
                if (mouseEventNote) {
                    mouseEventNote.target.dispatch(mouseEventNote);
                    tossMouseNote(mouseEventNote);
                }
            });
            m.safeAddin(self, 'fireMouseUpEvent', function Stage_mouseUp(nativeEvent) {
                /** * *
                * Dispatches a mouse up event.
                * * **/
                var mouseEventNote = createMouseNote(m.View.MOUSE_UP, nativeEvent);
                if (mouseEventNote) {
                    mouseEventNote.target.dispatch(mouseEventNote);
                    tossMouseNote(mouseEventNote);
                }
            });
            m.safeAddin(self, 'fireMouseClickEvent', function Stage_mouseUp(nativeEvent) {
                /** * *
                * Dispatches a mouse up event.
                * * **/
                var mouseEventNote = createMouseNote(m.View.MOUSE_CLICK, nativeEvent);
                if (mouseEventNote) {
                    mouseEventNote.target.dispatch(mouseEventNote);
                    tossMouseNote(mouseEventNote);
                }
            });
            // A private boolean to hold whether or not ANY views have been moused over...
            m.safeAddin(self, 'fireMouseMoveEvent', function Stage_mouseMove(nativeEvent) {
                /** * *
                * Dispatches a mouse move event or a mouse over.
                * * **/
                var mouseEventNote = createMouseNote(m.View.MOUSE_MOVE, nativeEvent);
                var overView = false;
                if (mouseEventNote) {
                    overView = mouseEventNote.target;
                    if (overView.$mouseSettings.mousedOver === false) {
                        // Intercept this mouseMove and change it into a mouseOver...
                        overView.$mouseSettings.mousedOver = true;
                        mouseEventNote.name = m.View.MOUSE_OVER;
                    }
                    mouseEventNote.target.dispatch(mouseEventNote);
                    mouseEventNote = tossMouseNote(mouseEventNote);
                } 
                
                // Fire mouseOut events for previously moused over
                // views, as long as there are some...
                for (var i = _displayList.length - 1; i >= 0; i--){
                    var view = _displayList[i];
                    if (view === overView) {
                        continue;
                    }
                    if (view.$mouseSettings.mousedOver === true) {
                        var globalPoint = getMousePoint(nativeEvent); 
                        var localPoint = getMousePoint(nativeEvent);
                        localPoint = view.convertPolygonToLocal(localPoint);
                            
                        if (! view.hitArea.containsPoint(localPoint)) {
                            view.$mouseSettings.mousedOver = false;
                            var mouseOutEvent = getMouseNote();
                                mouseOutEvent.name = m.View.MOUSE_OUT;
                                mouseOutEvent.globalPoint = globalPoint;
                                mouseOutEvent.localPoint = undefined;
                                mouseOutEvent.target = view;
                                mouseOutEvent.body = nativeEvent;
                                
                            view.dispatch(mouseOutEvent);
                            tossMouseNote(mouseOutEvent);
                        }

                        tossMousePoint(globalPoint);
                        tossMousePoint(localPoint);
                    }
                }
            });
            self.graphics.canvas.onmousedown = self.fireMouseDownEvent;
            self.graphics.canvas.onmouseup = self.fireMouseUpEvent;
            self.graphics.canvas.onclick = self.fireMouseClickEvent;
            self.graphics.canvas.onmousemove = self.fireMouseMoveEvent;
            self.graphics.canvas.onmouseout = function mouseOutAll(nativeEvent) {
                var globalPoint = getMousePoint(nativeEvent);
                
                // To save some object creation we create one event...
                var mouseOutNote = getMouseNote();
                    mouseOutNote.name = m.View.MOUSE_OUT;
                    mouseOutNote.globalPoint = globalPoint;
                    mouseOutNote.localPoint = undefined;
                    mouseOutNote.body = nativeEvent;
                
                for (var i = _displayList.length - 1; i >= 0; i--){
                    var view = _displayList[i];
                    if (view.$mouseSettings.mousedOver === true) {
                        view.$mouseSettings.mousedOver = false;
                        // Use the created mouse event here...
                        mouseOutNote.target = view;
                        view.dispatch(mouseOutNote);
                    }
                }
                // And use it here...
                mouseOutNote.name = m.Stage.MOUSE_LEAVE;
                mouseOutNote.target = self;
                self.$mouseSettings.mousedOver = false;
                self.dispatch(mouseOutNote);
                
                tossMouseNote(mouseOutNote);
                tossMousePoint(globalPoint);
            };
            return self;
        };
        //--------------------------------------
        //  NOTIFICATIONS SENT BY THIS ADDIN
        //--------------------------------------
        var events = {
             // Sent from the Stage every frame just before rendering...
             FRAME_TICK : 'frameTick',
             MOUSE_LEAVE : 'mouseLeave'
         };
         m.safeAddinAllPropertiesOf(addin, events);
        
        return addin;
        
    }
});
