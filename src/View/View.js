/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* View.js
* The main view element.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue May  1 16:52:25 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'View',
    dependencies : [ 'bang::Geometry/Rectangle.js', 'bang::Geometry/Matrix.js' ],
    /** * *
    * Initializes the View type.
    * @param {Object}
    * @nosideeffects
    * * **/
    init : function initView (m) {
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
            * A reference to this view's canvas.
            * @type {HTMLCanvasElement}
            * * **/
            this.canvas = document.createElement('canvas');
            /** * *
            * A reference to this view's canvas's context.
            * @type {CanvasRenderingContext2D}
            * * **/
            this.context = this.canvas.getContext('2d');
            /** * *
            * Whether or not this view needs redisplaying.
            * @type {boolean}
            * * **/
            this.isDirty = false;
            /** * *
            * The x coordinate of this view.
            * @type {number}
            * * **/
            this.x = x;
            /** * *
            * The y coordinate of this view.
            * @type {number}
            * * **/
            this.y = y;
            /** * *
            * The x scale of this view.
            * @type {number}
            * * **/
            this.scaleX = 1;
            /** * *
            * The y scale of this view.
            * @type {number}
            * * **/
            this.scaleY = 1;
            /** * *
            * The rotation (in radians) of this view.
            * @type {number}
            * * **/
            this.rotation = 0;
            /** * *
            * The alpha value of this view.
            * @type {number}
            * * **/
            this.alpha = 1;
            /** * *
            * The parent view of this view.
            * False if this view has no parent.
            * @type {View|false}
            * * **/
            this.parent = false;
            /** * *
            * A list of children of this view.
            * @type {Array.<View>}
            * * **/
            this.displayList = [];
            /** * *
            * A string that identifies this view.
            * @type {string}
            * * **/
            this.tag = (_instances++).toString();
            
            // Set the width and height...
            if (typeof w === 'number') {
                this.canvas.width = w;
            } else {
                w = this.canvas.width;
            }
            this.width = w;
            if (typeof h === 'number') {
                this.canvas.height = h;
            } else {
                h = this.canvas.height;
            }
            this.height = w;
            
            // Here we do a little hack to alias the drawing functions 
            // of CanvasRenderingContext2D...
            /** * *
            * Creates an aliased version of a function.
            * @param {function}
            * @return {function}
            * @nosideeffects
            * * **/
            function makeAlias(original) {
                /** * *
                * Draws something to this view after marking the
                * view as dirty (needing redisplay).
                * * **/
                return function aliasedDrawFunction() {
                    this.view.isDirty = true;
                    return original.apply(this, arguments);
                };
            }
            
            this.context.view = this;
            for (var key in this.context) {
                if (typeof this.context[key] === 'function') {
                    // Alias that function...
                    this.context[key] = makeAlias(this.context[key]);
                }
            }
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
        * Returns this view's transformation in local coordinates.
        * If invert is true, will return the inverse of the
        * local tranformation matrix.
        * @param {boolean=}
        * @nosideeffects
        * * **/
        View.prototype.localTransform = function View_localTransform(invert) {
            var matrix = new m.Matrix();
                
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
            return new m.Rectangle(0, 0, this.width, this.height);
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
        };
        /** * *
        * Draws this view and its subviews into the given context.
        * @param {CanvasRenderingContext2D}
        * * **/
        View.prototype.draw = function View_draw(context) {
            context.save();
            // Apply the transform for subviews...
            this.transformContext(context);
            // Draw these pixels into the context...
            context.drawImage(this.canvas, 0, 0);
    
            for (var i=0; i < this.displayList.length; i++) {
                var subView = this.displayList[i];
                subView.draw(context);
            }
            context.restore();
        };
        return View;
    }
});