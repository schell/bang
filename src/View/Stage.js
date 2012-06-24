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
    dependencies : [ 'bang::View/View.js', 'bang::Geometry/Rectangle.js', 'bang::Utils/Animation.js' ],
    /** * *
    * Initializes Stage type
    * @param m {Object} 
    * @return {function(number, number)}
    * * **/
    init : function initStage (View, Rectangle, Animation) {
        /** * *
        * Creates a new Stage view object.
        * @param width {number=}
        * @param height {number=}
        * @constructor
        * @extends View
        * * **/
        function Stage(width, height) {
           View.call(this, 0, 0, width, height);
            
            /** * *
            * An animation timer for scheduling redraws.
            * @type {Animation}
            * * **/
            this.timer = new Animation();
            /** * *
            * An object that identifies the Stage's step animation in the Stage's timer.
            * @type {Object}
            * * **/
            this.stepAnimation = this.timer.requestAnimation(this.step, this);
            /** * *
            * A canvas for drawing the display list into.
            * Since the Stage is also a View, we need to separate the canvas's
            * into the Stage as a View's canvas and the entire display list's canvas.
            * @type {HTMLCanvasElement}
            * * **/
            this.compositeCanvas = document.createElement('canvas');
            this.compositeCanvas.width = this.width;
            this.compositeCanvas.height = this.height;
            /** * *
            * Whether or not to draw the redraw regions into the composite context
            * after each redraw.
            * @type {boolean}
            * * **/
            this.showRedrawRegions = false;
            /** * *
            * Whether or not to use WebGL for rendering.
            * @type {boolean}
            * * **/
            this.useWebGL = true;
        }
        
        Stage.prototype = new View();
        
        Stage.prototype.constructor = Stage;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns a flattened list of all this view's subviews.
        * @return {Array.<View>}
        * * **/
        Stage.prototype.children = function Stage_children() {
            var children = [this];
            for (var i=0; i < children.length; i++) {
                var child = children[i];
                if (child.displayList.length) {
                    // Splice the child's displayList into children
                    // after child, so its children will be checked
                    // next...
                    Array.prototype.splice.apply(children, [i+1, 0].concat(child.displayList));
                }
            }
            return children;
        };
        /** * *
        * Draws this view and its display hierarchy into the given context.
        * @param {HTMLCanvasRenderingContext2D}
        * * **/
        Stage.prototype.draw = function Stage_draw(context) {
            if (!context) {
                return;
            }
            // Clear the stage...
            context.clearRect(0, 0, this.width, this.height);
            
            View.prototype.draw.call(this, context);
        };
        /** * *
        * This is the main step of the display list.
        * * **/
        Stage.prototype.step = function Stage_step(time) {
           this.draw(this.compositeCanvas.getContext('2d'));
        };
        
        return Stage;
    }
});
