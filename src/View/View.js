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
    * @param {object}
    * @nosideeffects
    * * **/
    init : function initView (m) {
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
            this.canvas = document.createElement('canvas');
            
            switch (arguments.length) {
                case 4:
                    this.canvas.width = w;
                    this.width = w;
                    this.canvas.height = h;
                    this.height = h;
                break;
                
                case 2:
                    this.canvas.width = x;
                    this.width = x;
                    this.canvas.height = y;
                    this.height = y;
                break;
                
                default:
                    this.width = this.canvas.width;
                    this.height = this.canvas.height;
            }
            
            // Here we do a little hack to alias the drawing functions 
            // of the CanvasRenderingContext2D...
            /** * *
            * Creates an aliased version of original.
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
            
            this.context = this.canvas.getContext('2d');
            this.context.view = this;
            for (var key in this.context) {
                if (typeof this.context[key] === 'function') {
                    // Alias that function...
                    this.context[key] = makeAlias(this.context[key]);
                }
            }
            
            return this;
        }
        
        View.prototype = {};
        //--------------------------------------
        //  PROPERTIES
        //--------------------------------------
        /** * *
        * Creates a new instance.
        * * **/
        View.prototype.constructor = View;
        /** * *
        * A reference to this view's canvas.
        * @type {HTMLCanvasElement}
        * * **/
        View.prototype.canvas = undefined;
        /** * *
        * A reference to this view's canvas's context.
        * @type {CanvasRenderingContext2D}
        * * **/
        View.prototype.context = undefined;
        /** * *
        * Whether or not this view needs redisplaying.
        * @type {boolean}
        * * **/
        View.prototype.isDirty = false;
        /** * *
        * The x coordinate of this view.
        * @type {number}
        * * **/
        View.prototype.x = 0;
        /** * *
        * The y coordinate of this view.
        * @type {number}
        * * **/
        View.prototype.y = 0;
        /** * *
        * The x scale of this view.
        * @type {number}
        * * **/
        View.prototype.scaleX = 1;
        /** * *
        * The y scale of this view.
        * @type {number}
        * * **/
        View.prototype.scaleY = 1;
        /** * *
        * The rotation (in radians) of this view.
        * @type {number}
        * * **/
        View.prototype.rotation = 0;
        /** * *
        * The alpha value of this view.
        * @type {number}
        * * **/
        View.prototype.alpha = 1;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns a string representation of this view.
        * @return {string}
        * @nosideeffects
        * * **/
        View.prototype.toString = function View_toString() {
            return 'View('+[this.x,this.y,this.width,this.height]+')';
        };
        /** * *
        * Returns the local transformation matrix.
        * If invert is true, will return the inverse of the
        * local tranformation matrix.
        * @param {boolean=}
        * @nosideeffects
        * * **/
        View.prototype.localTransformation = function View_localTransformation(invert) {
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
        * Draws a portion of this view into a context.
        * @param {CanvasRenderingContext2D}
        * @param {Rectangle}
        * @param {Rectangle}   
        * * **/
        View.prototype.drawInto = function View_drawInto(context, sourceRect, destRect) {
            context.drawImage(this.canvas, sourceRect.x(), sourceRect.y(), sourceRect.width(), sourceRect.height(), destRect.x(), destRect.y(), destRect.width(), destRect.height());
        };
        
        return View;
    }
});