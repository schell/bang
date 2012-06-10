/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Program.js
* Handles compiling vertex and fragment shaders.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Sat Jun  9 16:31:14 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Program',
    dependencies : [ 'bang::WebGL/Shaders/Shader.js' ],
    /** * *
    * Initializes the Program object constructor.
    * @param {function} Shader The Shader object constructor.
    * * **/
    init : function ProgramFactory (Shader) {
        /** * *
        * Creates a new shader program object.
        * @constructor
        * * **/
        function Program(context, shaders) {
            if (!context) {
                throw new Error('Program must have a context.');
            }
            /** * *
            * The WebGL context.
            * @type {WebGLRenderingContext}
            * * **/
            this.context = context;
            /** * *
            * A list of Shader objects to compile into this program.
            * @type {Array.<Shader>}
            * * **/
            this.shaders = shaders || [new Shader(this.context, this.context.VERTEX_SHADER), new Shader(this.context, this.context.FRAGMENT_SHADER)];
            /** * *
            * Whether or not this shader has been compiled
            * @type {boolean}
            * * **/
            this.hasBeenCompiled = false;
            /** * *
            * The webgl shader program.
            * @type {WebGLProgram}
            * * **/
            this.id = this.context.createProgram();
            
            // Compile the program...
            for (var i=0; i < this.shaders.length; i++) {
                var shader = this.shaders[i];
                this.context.attachShader(this.id, shader.id);
            }
            this.context.linkProgram(this.id);
    
            if (!this.context.getProgramParameter(this.id, this.context.LINK_STATUS)) {
                throw new Error('LINK_STATUS: '+this.context.LINK_STATUS+', unable to link the shader program:\n'+this.context.getProgramInfoLog(this.id));
            }
            // Use this program...
            this.use();
        }
        
        Program.prototype = {};
        
        Program.prototype.constructor = Program;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Tells the WebGLRenderingContext to use this program.
        * * **/
        Program.prototype.use = function Program_use() {
            this.context.useProgram(this.id);
        };
        
        return Program;
    }
});