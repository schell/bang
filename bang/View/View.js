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
            //-----------------------------
            //  GETTERS AND SETTERS
            //-----------------------------
            /** * *
            * The x coordinate of this view.
            * @type {number}
            * * **/
            if (typeof this.__defineGetter__ === 'function') {
                this._x = x;
                this.__defineGetter__('x', function getx() {
                        return this._x;
                });
                this.__defineSetter__('x', function setx(x) {
                    this.stage.needsDisplay = true;
                    this._x = x;
                });
            } else {
                this.x = x;
            }
            /** * *
            * The y coordinate of this view.
            * @type {number}
            * * **/
            if (typeof this.__defineGetter__ === 'function') {
                this._y = y;
                this.__defineGetter__('y', function gety() {
                    return this._y;
                });
                this.__defineSetter__('y', function sety(y) {
                    this.stage.needsDisplay = true;
                    this._y = y;
                });
            } else {
                this.y = y;
            }
            /** * *
            * The width of the view and its canvas.
            * @type {number}
            * * **/
            if (typeof this.__defineGetter__ === 'function') {
                this.__defineGetter__('width', function getwidth() {
                    return this.context.canvas.width;
                });
                this.__defineSetter__('width', function setwidth(width) {
                    this.context.canvas.width = width;
                    this.stage.needsDisplay = true;
                });
            } else {
                this.width = w;
            }
            /** * *
            * The height of the view and its canvas.
            * @type {number}
            * * **/
            if (typeof this.__defineGetter__ === 'function') {
                this._height = h;
                this.__defineGetter__('height', function getheight() {
                    return this.context.canvas.height;
                });
                this.__defineSetter__('height', function setheight(height) {
                    this.context.canvas.height = height;
                    this.stage.needsDisplay = true;
                });
            } else {
                this.height = h;
            }
            /** * *
            * The x scale of this view.
            * @type {number}
            * * **/
            if (typeof this.__defineGetter__ === 'function') {
                this._scaleX = 1;
                this.__defineGetter__('scaleX', function getscaleX() {
                        return this._scaleX;
                });
                this.__defineSetter__('scaleX', function setscaleX(scaleX) {
                    this.stage.needsDisplay = true;
                    this._scaleX = scaleX;
                });
            } else {
                this.scaleX = 1;
            }
            /** * *
            * The y scale of this view.
            * @type {number}
            * * **/
            if (typeof this.__defineGetter__ === 'function') {
                this._scaleY = 1;
                this.__defineGetter__('scaleY', function getscaleY() {
                    return this._scaleY;
                });
                this.__defineSetter__('scaleY', function setscaleY(scaleY) {
                    this.stage.needsDisplay = true;
                    this._scaleY = scaleY;
                });
            } else {
                this.scaleY = 1;
            }
            /** * *
            * The rotation (in radians) of this view.
            * @type {number}
            * * **/
            if (typeof this.__defineGetter__ === 'function') {
                this._rotation = 0;
                this.__defineGetter__('rotation', function getrotation() {
                        return this._rotation;
                });
                this.__defineSetter__('rotation', function setrotation(rotation) {
                    this.stage.needsDisplay = true; 
                    this._rotation = rotation;
                });
            } else {
                this.rotation = 0;
            }
            /** * *
            * The alpha value of this view.
            * @type {number}
            * * **/
            if (typeof this.__defineGetter__ === 'function') {
                this._alpha = 1;
                this.__defineGetter__('alpha', function getalpha() {
                        return this._alpha;
                });
                this.__defineSetter__('alpha', function setalpha(alpha) {
                    this.stage.needsDisplay = true;
                    this._alpha = alpha;
                });
            } else {
                this.alpha = 1;
            }
            /** * *
            * The parent view of this view.
            * False if this view has no parent.
            * @type {View|false}
            * * **/
            this.parent = false;
            /** * *
            * The stage view.
            * @type {Stage|false} stage 
            * * **/
            if (typeof this.__defineGetter__ === 'function') {
                this._stage = false;
                this.__defineGetter__('stage', function getstage() {
                    return this._stage;
                });
                this.__defineSetter__('stage', function setstage(stage) {
                    this._stage = stage;
                    this.context.stage = stage;
                    for (var i=0; i < this.displayList.length; i++) {
                        this.displayList[i].stage = stage;
                    }
                });
            } else {
                this.stage = false;
            }
            /** * *
            * A string that identifies this view.
            * @type {string}
            * * **/
            this.tag = (_instances++).toString();
            /** * *
            * A list of child views.
            * @type {Array.<View>}
            * * **/
            this.displayList = [];
        }
        
        View.prototype = {};
        
        View.prototype.constructor = View;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns a string representation of this view.
        * @return {string}
        * @nosideeffects
        * * **/
        View.prototype.toString = function View_toString() {
            return 'View{"'+this.tag+'"['+[this.x,this.y,this.width,this.height]+']}';
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
            subView.parent = this;
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
            subView.parent = this;
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
            subView.parent = false;
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