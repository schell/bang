/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Shader.js
* A GLSL shader program wrapper object.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed May 30 15:40:01 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Shader',
    dependencies : [  ],
    /** * *
    * Initializes the Shader object constructor.        
    * * **/
    init : function ShaderFactory () {
        /** * *
        * The Shader object constructor.
        * @param 
        * @constructor
        * * **/
        function Shader(gl) {
            /** * *
            * A mapping of shader attributes to their attribute locations.  
            * @type {Object}
            * * **/
            this.vertexLocations = {};
            /** * *
            * A mapping of shader uniforms to their locations.
            * @type {Object}
            * * **/
            this.uniformLocations = {};
            /** * *
            * The webgl shader program.
            * @type {WebGLProgram|boolean}
            * * **/
            this.id = false;
            /** * *
            * The WebGLRenderingContext
            * @type {WebGLRenderingContext|false}
            * * **/
            this.gl = gl || false;
            //--------------------------------------
            //  PROPERTIES TO SET WHEN WRITING A
            //  NEW SHADER
            //--------------------------------------
            /** * *
            * The fragment shader source.
            * @type {string}
            * * **/
            this.fragmentSrc = [
                'varying mediump vec4 vColor;',
                'void main(void) {gl_FragColor = vColor;}'
            ].join('');
            /** * *
            * The vertex shader source.
            * @type {string}
            * * **/
            this.vertexSrc = [
                'attribute vec3 aVertex;',
                'attribute vec4 aColor;',
                
                'uniform mat4 uMVMatrix;',
                'uniform mat4 uPMatrix;',
                
                'varying vec4 vColor;',
                
                'void main (void) {',
                '    vColor = aColor;',
                '    vec4 v = vec4(aVertex, 1);',
                '    gl_Position = uPMatrix * uMVMatrix * v;',
                '}'
            ].join('');
            /** * *
            * Returns the names of the vertex attributes.
            * @type {Array.<string>}
            * * **/
            this.attributes = [
                'aVertex',
                'aColor'
            ];
            /** * *
            * Returns the component lengths of each vertex attribute.
            * @type {Array.<number>}
            * * **/
            this.attributeComponentLengths =  [
                3,
                4
            ];
            /** * *
            * Returns the names of the uniforms.
            * @type {Array.<string>}
            * * **/
            this.uniforms = [
                'uMVMatrix',
                'uPMatrix'
            ];
        }
        
        Shader.prototype = {};
        
        Shader.prototype.constructor = Shader;
        //--------------------------------------
        // METHODS
        //--------------------------------------
        /** * *
        * Compiles a shader.
        * @param {number} type The type of shader.
        * @param {string} src The string source of the shader.
        * @return {number} The reference to the compiled shader.
        * * **/
        Shader.prototype.compileShader = function Shader_compileShader(type, src) {
            // Compile the fragment shader...
            var id = this.gl.createShader(type);
            this.gl.shaderSource(id, src);
            this.gl.compileShader(id);
            // Check the status of our compilation...
            if (!this.gl.getShaderParameter(id, this.gl.COMPILE_STATUS)) {
                throw new Error('Failed to compile shader: ' + this.gl.getShaderInfoLog(id) + ' source:\n' + src);
            }
            return id;
        };
        /** * *
        * Compiles and links the shader program.
        * Sets the fragmentId, vertexId and id.
        * * **/
        Shader.prototype.compile = function Shader_compile() {
            // Compile the fragment shader...
            this.fragmentId = this.compileShader(this.gl.FRAGMENT_SHADER, this.fragmentSrc);
            // Compile the vertex shader...
            this.vertexId = this.compileShader(this.gl.VERTEX_SHADER, this.vertexSrc);
            // Create the program id...
            this.id = this.gl.createProgram();
            
            var shaders = [this.fragmentId, this.vertexId];
            // Compile the program...
            for (var i=0; i < 2; i++) {
                var shader = shaders[i];
                this.gl.attachShader(this.id, shader);
            }
            this.gl.linkProgram(this.id);
    
            if (!this.gl.getProgramParameter(this.id, this.gl.LINK_STATUS)) {
                throw new Error('LINK_STATUS: '+this.gl.LINK_STATUS+', unable to link the shader program:\n'+this.gl.getProgramInfoLog(this.id));
            }
            
            // Run through the shaders and get the locations of various attributes
            // and uniforms...
            var attributeNames = this.attributes;
            var uniformNames = this.uniforms;
            
            for (var j=0; j < attributeNames.length; j++) {
                var attrib  = attributeNames[j];
                var location = this.gl.getAttribLocation(this.id, attrib);
                this.gl.enableVertexAttribArray(location);
                this.vertexLocations[attrib] = location;
            }
            for (j=0; j < uniformNames.length; j++) {
                var uniform = uniformNames[j];
                this.uniformLocations[uniform] = this.gl.getUniformLocation(this.id, uniform);
            }
        };
        /** * *
        * Tells the WebGLRenderingContext to use this program.
        * * **/
        Shader.prototype.use = function Shader_use() {
            if (!this.id) {
                this.compile();
            }
            this.gl.useProgram(this.id);
            // Run through and enable all the vertex attributes...
            for (var attributeName in this.vertexLocations) {
                this.gl.enableVertexAttribArray(this.vertexLocations[attributeName]);
            }
        };
        /** * *
        * The number of components in each vertex.
        * * **/
        Shader.prototype.numberOfComponents = function Shader_numberOfComponents() {
            var components = 0;
            var lengths = this.attributeComponentLengths;
            for (var i=0; i < lengths.length; i++) {
                components += lengths[i];
            }
            return components;
        };
        /** * *
        * Calculates and returns the stride of the vertex attributes.
        * @param {number} dataType The type of number represented (gl.BYTE, gl.SHORT, gl.FLOAT).
        * @return {number}
        * * **/
        Shader.prototype.vertexStride = function Shader_vertexStride(dataType) {
            if (!this.gl) {
                throw new Error('Must have gl reference to calculate stride.');
            }
            var components = this.numberOfComponents();
            
            switch (dataType) {
                case this.gl.BYTE:
                    return components;
                case this.gl.SHORT:
                    return components * 2;
                case this.gl.FLOAT:
                    return components * 4;
            }
            return 0;
        };
        /** * *
        * Calculates and returns the offset of the given vertex attribute.
        * @param {string} name The name of the vertex attribute.
        * @param {number} dataType The type of number represented (gl.BYTE, gl.SHORT, gl.FLOAT).
        * @return {number}
        * * **/
        Shader.prototype.vertexOffset = function Shader_vertexOffset(name, dataType) {
            var ndx = this.attributes.indexOf(name);
            if (ndx === -1) {
                throw new Error(name + ' is not a vertex attribute.');
            }
            
            var components = this.numberOfComponents();
            
            switch (dataType) {
                case this.gl.BYTE:
                    return components;
                case this.gl.SHORT:
                    return components * 2;
                case this.gl.FLOAT:
                    return components * 4;
            }
            return 0;
        };
        /** * *
        * Sets the vertex attribute pointers for the shader.
        * @param {number} dataType A reference to the data type.
        * * **/
        Shader.prototype.setVertexAttribPointers = function Shader_setVertexAttribPointers(dataType) {
            dataType = dataType || this.gl.FLOAT;
            
            var components = this.numberOfComponents();
            var attributes = this.attributes;
            var lengths = this.attributeComponentLengths;
            
            var dataTypeSize = 1;
            switch (dataType) {
                case this.gl.SHORT:
                    dataTypeSize = 2;
                break;
                case this.gl.FLOAT:
                    dataTypeSize = 4;
                break;
                default:
                break;
            }
            
            var offset = 0;
            for (var i=0; i < attributes.length; i++) {
                var attribute = attributes[i];
                var length = lengths[i];
                var location = this.vertexLocations[attribute];
                var stride = components*dataTypeSize;
                var attributeOffset = offset*dataTypeSize;
                
                this.gl.vertexAttribPointer(location, length, dataType, false, stride, attributeOffset);
                
                offset += length;
            }
        };
        
        return Shader;
    }
});