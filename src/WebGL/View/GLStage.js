/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* GLStage.js
* A Stage constructor for 3D things.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed May 30 15:45:07 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'GLStage',
    dependencies : [ 'bang::WebGL/View/GLView.js', 'bang::WebGl/Shaders/Program.js' ],
    /** * *
    * Initializes the Stage object constructor.
    * @return {function}
    * * **/
    init : function StageFactory (GLView, Program) {
        /** * *
        * 
        * @constructor
        * * **/
        function GLStage(width, height) {
            /** * *
            * An HTMLCanvasElement to hold our scene.
            * @type {HTMLCanvasElement}
            * * **/
            this.canvas = document.createElement('canvas');
            /** * *
            * The width of our drawing buffer.
            * @type {number}
            * * **/
            this.width = width || this.canvas.width;
            /** * *
            * The height of our drawing buffer.
            * @type {number}
            * * **/
            this.height = height || this.canvas.height;
            /** * *
            * A WebGL context to draw into.
            * @type {WebGLRenderingContext}
            * * **/
            this.canvas.getContext('experimental-webgl');
            /** * *
            * A list of Programs to use for drawing.
            * If this is left unset, the stage will not draw. Set to false by default.
            * @type {Array.<Program>|boolean}
            * * **/
            this.programs = false;
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
            * Whether or not the stage is ready for drawing.
            * @type {boolean}
            * * **/
            this.initialized = false;
        }
        
        GLStage.prototype = {};
        
        GLStage.prototype.constructor = GLStage;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Initializes the stage by compiling and linking shader programs.
        * * **/
        GLStage.prototype.initialize = function GLStage_initialize() {
            this.context.clearColor(0, 0, 0, 0);
            this.context.clearDepth(1.0);
		    this.context.enable(gl.DEPTH_TEST);
		    this.context.enable(gl.BLEND);
		    this.context.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            
        };
        
        /** * *
        * Draws this view and its display hierarchy into the given context.
        * @param {HTMLCanvasRenderingContext2D}
        * * **/
        GLStage.prototype.draw = function GLStage_draw(context) {
            if (!this.shaders) {
                // Shaders must be set first...
                return;
            }
            if (!this.initialized) {
                this.initialize();
            }
            // Do the draw...
            
        };
        /** * *
        * This is the main step of the display list.
        * * **/
        GLStage.prototype.step = function GLStage_step(time) {
           this.draw(this.compositeCanvas.getContext('2d'));
        };
        
        
        return GLStage;
    }
});