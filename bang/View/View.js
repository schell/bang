/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* View.js
* The main view type.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue May  1 16:52:25 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'View',
    dependencies : [ 
        'bang::Geometry/Rectangle.js', 
        'bang::Geometry/Transform2d.js', 
        'bang::View/CanvasContext.js' 
    ],
    /** * *
    * Initializes the View type.
    * @param {Object}
    * @nosideeffects
    * * **/
    init : function initView (Rectangle, Transform2d, CanvasContext) {
        /** * *
        * A private variable for holding the number
        * of instantiated View objects.
        * @type {number}
        * * **/
        var _instances = 0;
        /** * *
        * Creates a new View object.
        * @param {number}
        * @param {number}
        * @param {number}
        * @param {number}
        * @return {View} 
        * @nosideeffects
        * * **/
        function View(x, y, w, h) {
            x = x || 0;
            y = y || 0;
            /** * *
            * A reference to this view's canvas's context.
            * @type {CanvasRenderingContext2D}
            * * **/
            this.context = CanvasContext.createContext(w, h);
            /** * *
            * A string that identifies this view.
            * @type {string}
            * * **/
            this.tag = (_instances++).toString();

            this.x = x;
            this.y = y;
        }
        
        View.prototype = {};
        
        View.prototype.constructor = View;
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the x property.
        * 
        * @returns {number} x 
        * * **/
        View.prototype.__defineGetter__('x', function View_getx() {
            if (!this._x) {
                this._x = 0;
            }
            return this._x;
        });
        /** * *
        * Sets the x property.
        * 
        * @param {number} 
        * * **/
        View.prototype.__defineSetter__('x', function View_setx(x) {
            this.stage.needsDisplay = true;
            this._x = x;
        });
        /** * *
        * Gets the y property.
        * 
        * @returns {number} y 
        * * **/
        View.prototype.__defineGetter__('y', function View_gety() {
            if (!this._y) {
                this._y = 0;
            }
            return this._y;
        });
        /** * *
        * Sets the y property.
        * 
        * @param {number} 
        * * **/
        View.prototype.__defineSetter__('y', function View_sety(y) {
            this.stage.needsDisplay = true;
            this._y = y;
        });
        /** * *
        * Gets the width property.
        * This is the width of the view and its canvas and context.
        * @returns {number} width 
        * * **/
        View.prototype.__defineGetter__('width', function View_getwidth() {
            return this.context.canvas.width;
        });
        /** * *
        * Sets the width property.
        * This forwards to the context's canvas width and sets the stage to redraw.
        * @param {number} 
        * * **/
        View.prototype.__defineSetter__('width', function View_setwidth(width) {
            this.context.canvas.height = width;
            this.stage.needsDisplay = true;
        });
        /** * *
        * Gets the height property.
        * This is the height of the view and its canvas and context.
        * @returns {number} height 
        * * **/
        View.prototype.__defineGetter__('height', function View_getheight() {
            return this.context.canvas.height;
        });
        /** * *
        * Sets the height property.
        * This forwards to the context's canvas height and sets the stage to redraw.
        * @param {number} 
        * * **/
        View.prototype.__defineSetter__('height', function View_setheight(height) {
            this.context.canvas.height = height;
            this.stage.needsDisplay = true;
        });
        /** * *
        * Gets the scaleX property.
        * This is the scale of the view on the x axis.
        * @returns {number} scaleX 
        * * **/
        View.prototype.__defineGetter__('scaleX', function View_getscaleX() {
            if (!this._scaleX) {
                this._scaleX = 1;
            }
            return this._scaleX;
        });
        /** * *
        * Sets the scaleX property.
        * Sets the stage to redraw.
        * @param {number} 
        * * **/
        View.prototype.__defineSetter__('scaleX', function View_setscaleX(scaleX) {
            this._scaleX = scaleX;
            this.stage.needsDisplay = true;
        });
        /** * *
        * Gets the scaleY property.
        * This is the scale of the view on the y axis.
        * @returns {number} scaleY 
        * * **/
        View.prototype.__defineGetter__('scaleY', function View_getscaleY() {
            if (!this._scaleY) {
                this._scaleY = 1;
            }
            return this._scaleY;
        });
        /** * *
        * Sets the scaleY property.
        * Sets the stage to redraw.
        * @param {number} 
        * * **/
        View.prototype.__defineSetter__('scaleY', function View_setscaleY(scaleY) {
            this._scaleY = scaleY;
            this.stage.needsDisplay = true;
        });
        /** * *
        * Gets the rotation property.
        * The clockwise rotation in degrees.
        * @returns {number} rotation 
        * * **/
        View.prototype.__defineGetter__('rotation', function View_getrotation() {
            if (!this._rotation) {
                this._rotation = 0;
            }
            return this._rotation;
        });
        /** * *
        * Sets the rotation property.
        * Sets the stage to redraw.
        * @param {number} 
        * * **/
        View.prototype.__defineSetter__('rotation', function View_setrotation(rotation) {
            this._rotation = rotation;
            this.stage.needsDisplay = true;
        });
        /** * *
        * Gets the alpha property.
        * This is the opacity of the view, 1 represents a fully opaque view, 0 is fully translucent.
        * @returns {number} alpha 
        * * **/
        View.prototype.__defineGetter__('alpha', function View_getalpha() {
            if (!this._alpha) {
                this._alpha = 1;
            }
            return this._alpha;
        });
        /** * *
        * Sets the alpha property.
        * Sets the stage to redraw.
        * @param {number} 
        * * **/
        View.prototype.__defineSetter__('alpha', function View_setalpha(alpha) {
            this._alpha = alpha;
            this.stage.needsDisplay = true;
        });
        /** * *
        * Gets the stage property.
        * The root of the views.
        * @returns {Stage} stage 
        * * **/
        View.prototype.__defineGetter__('stage', function View_getstage() {
            if (!this._stage) {
                this._stage = false;
            }
            return this._stage;
        });
        /** * *
        * Sets the stage property.
        * Runs through all the children of this view and sets their stage propeties too.
        * @param {Stage} 
        * * **/
        View.prototype.__defineSetter__('stage', function View_setstage(stage) {
            this._stage = stage;
            this.context.stage = stage;
            for (var i=0; i < this.displayList.length; i++) {
                this.displayList[i].stage = stage;
            }
        });
        /** * *
        * Gets the parent property.
        * The parent view of this view. False if this view has no parent.
        * @returns {View|false} parent 
        * * **/
        View.prototype.__defineGetter__('parent', function View_getparent() {
            if (!this._parent) {
                this._parent = false;
            }
            return this._parent;
        });
        /** * *
        * Gets the displayList property.
        * A list of this view's child views.
        * @returns {Array.<View>} 
        * * **/
        View.prototype.__defineGetter__('displayList', function View_getdisplayList() {
            if (!this._displayList) {
                this._displayList = [];
            }
            return this._displayList;
        });
        /** * *
        * Sets the displayList property.
        * Runs through the old list and removes all the views, then runs
        * through the new list and adds all the new views.
        * @param {Array.<View>} displayList
        * * **/
        View.prototype.__defineSetter__('displayList', function View_setdisplayList(displayList) {
            while (this.displayList.length) {
                this.removeView(this.displayList[0]);
            }
            for (var i=0; i < displayList.length; i++) {
                this.addView(displayList[i]);
            }
        });
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns a string representation of this view.
        * @return {string}
        * @nosideeffects
        * * **/
        View.prototype.toString = function View_toString() {
            return 'View-"'+this.tag+'"('+[this.x,this.y,this.width,this.height]+')';
        };
        /** * *
        * Initializes the view.
        * Currently empty. This exists to conform View to a View3d,
        * so View objects can be rendered by a View3d.
        * * **/
        View.prototype.initialize = function View_initialize() {
            
        };
        /** * *
        * Returns this view's transformation in local coordinates.
        * If invert is true, will return the inverse of the
        * local tranformation matrix.
        * @param {boolean=}
        * @nosideeffects
        * * **/
        View.prototype.localTransform = function View_localTransform(invert) {
            var matrix = new Transform2d();
                
            if (invert) {
                // Let's just provide them with an inverse instead of
                // making them take the inverse afterwards, it should
                // save some cycles...
                matrix = matrix.scale(1/this.scaleX, 1/this.scaleY);
                matrix = matrix.rotate(-this.rotation);
                matrix = matrix.translate(-this.x, -this.y);
            } else {
                matrix = matrix.translate(this.x, this.y);
                matrix = matrix.rotate(this.rotation);
                matrix = matrix.scale(this.scaleX, this.scaleY);
            }
            return matrix;
        };
        /** * *
        * Returns this view's transformation in global coordinates.
        * If invert is true, will return the inverse of the
        * global tranformation matrix.
        * @param {boolean=}
        * @nosideeffects
        * * **/
        View.prototype.globalTransform = function View_globalTransform(invert) {
            invert = invert || false;
            var i = invert ? -1 : 1;
                
            // Get this view's transformation matrix...
            var transform = this.localTransform(invert);

            if (!this.parent) {
                // There is no parent view, so either this view does not
                // belong to a display list, or we've hit the root of the tree...
                return transform;
            }
                
            // Recurse up the tree and get the compound transfor..
            var compound = this.parent.globalTransform(invert);
                
            if (invert) {
                return transform.multiply(compound);
            }
            return compound.multiply(transform);
        };
        /** * *
        * Returns a copy of the given local vector converted into global coordinates.
        * @param {Vector}
        * @return {Vector}
        * @nosideeffects
        * * **/
        View.prototype.vectorToGlobal = function View_vectorToGlobal(vector) {
            return this.globalTransform().transformPolygon(vector);
        };
        /** * *
        * Returns a copy of the given global vector converted into local coordinates.
        * @param {Vector}
        * @return {Vector}
        * @nosideeffects
        * * **/
        View.prototype.vectorToLocal = function View_vectorToLocal(vector) {
            var inverse = true;
            return this.globalTransform(inverse).transformPolygon(vector);
        };
        /** * *
        * Returns the local bounds of this view.
        * @return {Rectangle}
        * * **/
        View.prototype.localBoundary = function View_localBoundary() {
            return new Rectangle(0, 0, this.width, this.height);
        };
        /** * *
        * Applies this view's transformation to a context.  
        * @param {CanvasRenderingContext2D} 
        * * **/
        View.prototype.transformContext = function View_transformContext(context) {
            context.translate(this.x, this.y);
            context.rotate(this.rotation);
            context.scale(this.scaleX, this.scaleY);
            context.globalAlpha *= this.alpha;
        };
        /** * *
        * Adds a subview to this view.
        * @param {View}
        * * **/
        View.prototype.addView = function View_addView(subView) {
            if (subView.parent) {
                subView.parent.removeView(subView);
            }
            this.displayList.push(subView);
            subView._parent = this;
            subView.stage = this.stage;
            this.stage.needsDisplay = true;
        };
        /** * *
        * Adds a subview to this view at a given index.
        * @param {View}
        * @param {number}
        * * **/
        View.prototype.addViewAt = function View_addViewAt(subView, insertNdx) {
            insertNdx = insertNdx || 0;
            
            if (subView.parent) {
                subView.parent.removeView(subView);
            }
            this.displayList.splice(insertNdx, 0, subView);
            subView._parent = this;
            subView.stage = this.stage;
            this.stage.needsDisplay = true;
        };
        /** * *
        * Removes a subview of this view.
        * * **/
        View.prototype.removeView = function View_removeView(subView) {
            var ndx = this.displayList.indexOf(subView);
            if (ndx !== -1) {
                this.displayList.splice(ndx, 1);
            } else {
                throw new Error('subview must be a child of the caller.');
            }
            subView._parent = false;
            subView.stage = false;
            this.stage.needsDisplay = true;
        };
        /** * *
        * Draws this view and its subviews into the given context.
        * @param {CanvasRenderingContext2D}
        * * **/
        View.prototype.draw = function View_draw(context) {
            if (!context || !CanvasRenderingContext2D.prototype.isPrototypeOf(context)) {
                context = this.stage.canvas.getContext('2d');
            }
            context.save();
            // Apply the transform for subviews...
            this.transformContext(context);
            // Draw these pixels into the context...
            context.drawImage(this.context.canvas, 0, 0);
    
            for (var i=0; i < this.displayList.length; i++) {
                var subView = this.displayList[i];
                subView.draw(context);
            }
            context.restore();
        };
        return View;
    }
});
