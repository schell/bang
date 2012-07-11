/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Stage3d.js
* A Stage constructor for 3D things.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed May 30 15:45:07 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Stage3d',
    dependencies : [ 
        'bang::View/View3d.js', 
        'bang::Geometry/Transform3d.js', 
        'bang::Utils/Animation.js', 
        'bang::Shaders/TexShader.js', 
        'bang::Shaders/Shader.js',
        'bang::Geometry/Mesh.js'
    ],
    /** * *
    * Initializes the Stage object constructor.
    * @return {function}
    * * **/
    init : function StageFactory (View3d, Transform3d, Animation, TexShader, Shader, Mesh) {
        /** * *
        * 
        * @constructor
        * * **/
        function Stage3d(width, height) {
            // Run the View3d constructor giving it a reference to a WebGLRenderingContext...
            View3d.prototype.constructor.call(this);
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
            
            // Update the canvas's dimensions...
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            /** * *
            * The WebGLRenderingContext
            * @type {WebGLRenderingContext} gl 
            * * **/
            this.gl = this.canvas.getContext('experimental-webgl');
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
            this.projection = Transform3d.perspective(45, this.width/this.height, 0.1, 100);
            /** * *
            * The shader program to use for drawing.
            * @type {Shader|boolean}
            * * **/
            this.shaders = {
                texShader : new TexShader(this.gl),
                colorShader : new Shader(this.gl)
            };
            // Set the root view...
            this.stage = this;
            // By default we'll use the normal color shader...
            this.useShader(this.shaders.colorShader);
        }
        
        Stage3d.prototype = new View3d(false, false);
        
        Stage3d.prototype.constructor = Stage3d;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Sends the geometry for this view to WebGL.
        * * **/
        Stage3d.prototype.sendGeometry = function Stage3d_sendGeometry() {
            // Clear the stage...
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            View3d.prototype.sendGeometry.call(this);
        };
        /** * *
        * Returns whether or not this view has been initialized.
        * Use this to determine whether your shaders need to be compiled,
        * or whether your vertices need to be buffered.
        * @return {boolean}
        * * **/
        Stage3d.prototype.isInitialized = function Stage3d_isInitialized() {
            return (this.initialized && View3d.prototype.isInitialized.call(this));
        };
        /** * *
        * Initializes the stage by compiling and linking shader programs.
        * * **/
        Stage3d.prototype.initialize = function Stage3d_initialize() {
            this.gl.clearColor(0,0,0,0);                      
            this.gl.enable(this.gl.DEPTH_TEST);                               
            this.gl.depthFunc(this.gl.LEQUAL);                                
            this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
            this.initialized = true;
            for (var shaderName in this.shaders) {
                var shader = this.shaders[shaderName];
                shader.compile();
            }

            View3d.prototype.initialize.call(this);
        };
        /** * *
        * This is the main step of the display list.
        * * **/
        Stage3d.prototype.step = function Stage3d_step(time) {
           this.draw();
        };
        
        return Stage3d;
    }
});