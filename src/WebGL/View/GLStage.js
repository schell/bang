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
    dependencies : [ 'bang::WebGL/View/GLView.js', 'bang::Geometry/Transform3d.js', 'bang::Utils/Animation.js' ],
    /** * *
    * Initializes the Stage object constructor.
    * @return {function}
    * * **/
    init : function StageFactory (GLView, Transform3d, Animation) {
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
            
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            
            // Run the GLView constructor giving it a reference to a WebGLRenderingContext...
            GLView.prototype.constructor.call(this, this.canvas.getContext('experimental-webgl'));
            
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
            //this.rootView = false;
            /** * *
            * The projection matrix.
            * @type {Transform3d}
            * * **/
            this.projection = Transform3d.perspective(45, 640/480, 0.1, 100);
        }
        
        GLStage.prototype = new GLView(false, false);
        
        GLStage.prototype.constructor = GLStage;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Initializes the stage by compiling and linking shader programs.
        * * **/
        GLStage.prototype.initialize = function GLStage_initialize() {
            this.gl.stage = this;
            this.gl.clearColor(0.5, 0.5, 0.5, 1.0);                      
            this.gl.enable(this.gl.DEPTH_TEST);                               
            this.gl.depthFunc(this.gl.LEQUAL);                                
            this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
            this.initialized = true;
        };
        /** * *
        * Draws this view and its display hierarchy into the given gl.
        * @param {HTMLCanvasRenderingContext2D}
        * * **/
        GLStage.prototype.draw = function GLStage_draw(gl) {
            if (!this.initialized) {
                this.initialize();
            }
            // Do the draw...
            GLView.prototype.draw.call(this);
        };
        /** * *
        * This is the main step of the display list.
        * * **/
        GLStage.prototype.step = function GLStage_step(time) {
           this.draw();
        };
        
        
        return GLStage;
    }
});