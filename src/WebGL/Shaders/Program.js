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
        function Program(gl, shaders) {
            if (!gl) {
                throw new Error('Program must have a gl.');
            }
            /** * *
            * The WebGL gl.
            * @type {WebGLRenderingContext}
            * * **/
            this.gl = gl;
            /** * *
            * A list of Shader objects to compile into this program.
            * @type {Array.<Shader>}
            * * **/
            this.shaders = shaders || [new Shader(this.gl, this.gl.VERTEX_SHADER), new Shader(this.gl, this.gl.FRAGMENT_SHADER)];
            /** * *
            * Whether or not this shader has been compiled
            * @type {boolean}
            * * **/
            this.hasBeenCompiled = false;
            /** * *
            * The webgl shader program.
            * @type {WebGLProgram}
            * * **/
            this.id = this.gl.createProgram();
            
            // Compile the program...
            for (var i=0; i < this.shaders.length; i++) {
                var shader = this.shaders[i];
                this.gl.attachShader(this.id, shader.id);
            }
            this.gl.linkProgram(this.id);
    
            if (!this.gl.getProgramParameter(this.id, this.gl.LINK_STATUS)) {
                throw new Error('LINK_STATUS: '+this.gl.LINK_STATUS+', unable to link the shader program:\n'+this.gl.getProgramInfoLog(this.id));
            }
            // Use this program...
            this.use();
            
            this.aVertex = this.gl.getAttribLocation(this.id, 'aVertex');
            this.gl.enableVertexAttribArray(this.aVertex);
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
            this.gl.useProgram(this.id);
        };
        
        return Program;
    }
});