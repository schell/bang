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
            * A mapping of shader attributes to their attribute locations.  
            * @type {Object}
            * * **/
            this.shaderAttributeLocations = {};
            /** * *
            * A mapping of shader uniforms to their locations.
            * @type {Object}
            * * **/
            this.shaderUniformLocations = {};
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
            
            // Run through the shaders and get the locations of various attributes
            // and uniforms...
            for (var i=0; i < this.shaders.length; i++) {
                var shader = this.shaders[i];
                for (var j=0; j < shader.attributes.length; j++) {
                    var attrib  = shader.attributes[j];
                    var location = this.gl.getAttribLocation(this.id, attrib);
                    this.gl.enableVertexAttribArray(location);
                    this.shaderAttributeLocations[attrib] = location;
                }
                for (var j=0; j < shader.uniforms.length; j++) {
                    var uniform = shader.uniforms[j];
                    this.shaderUniformLocations[uniform] = this.gl.getUniformLocation(this.id, uniform);
                }
            }
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
            // Run through and enable all the vertex attributes...
            for (var i=0; i < this.shaderAttributeLocations.length; i++) {
                var attrib = this.shaderAttributeLocations[i];
                this.gl.enableVertexAttribArray(attrib);
            }
        };
        
        
        return Program;
    }
});