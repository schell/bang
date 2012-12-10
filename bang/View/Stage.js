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
            * A canvas for drawing the display list into.
            * Since the Stage is also a View, we need to separate the canvas's
            * into the Stage as a View's canvas and the entire display list's canvas.
            * @type {HTMLCanvasElement}
            * * **/
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            /** * *
            * Whether or not to clear the screen before each draw.
            * Set to false if the stage will be drawn by another view.
            * @type {boolean} clearsOnDraw 
            * * **/
            this.clearsOnDraw = true;

            this.stage = this;
        }
        
        Stage.prototype = new View();
        
        Stage.prototype.constructor = Stage;
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the timer property.
        * @returns {Animation} 
        * * **/
        Stage.prototype.__defineGetter__('timer', function Stage_gettimer() {
            if (!this._timer) {
                this._timer = new Animation();
            }
            return this._timer;
        }); 
        /** * *
        * Gets the needsDisplay property.
        * Whether or not the stage needs to be redrawn.
        * @returns {boolean} 
        * * **/
        Stage.prototype.__defineGetter__('needsDisplay', function Stage_getneedsDisplay() {
            if (!this._needsDisplay) {
                this._needsDisplay = false;
            }
            return this._needsDisplay;
        });
        /** * *
        * Sets the needsDisplay property.
        * Triggers a redraw.
        * @param {boolean} needsDisplay
        * * **/
        Stage.prototype.__defineSetter__('needsDisplay', function Stage_setneedsDisplay(needsDisplay) {
            if (this._needsDisplay !== needsDisplay && needsDisplay) {
                this.timer.requestAnimationOnce(this.step, this);    
            }
            this._needsDisplay = needsDisplay;
        });
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
        * Draws the stage and its subviews into the given context.
        * @param context {CanvasRenderingContext2D}
        * * **/
        Stage.prototype.draw = function Stage_draw(context) {
            context = context || this.canvas.getContext('2d');
            
            context.save();
            if (this.clearsOnDraw) {
                // Clear the entire stage...
                context.clearRect(0, 0, this.width, this.height);
            }
            // Call View's draw...
            View.prototype.draw.call(this, context);
            this.needsDisplay = false;
        };
        /** * *
        * The stepping function.
        * * **/
        Stage.prototype.step = function Stage_step(time) {
            this.draw();
        };
        
        return Stage;
    }
});
