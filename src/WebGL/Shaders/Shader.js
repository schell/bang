/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Shader.js
* A GLSL shader source wrapper object.
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
        * 
        * @constructor
        * * **/
        function Shader(gl, type, src, attributes, uniforms) {
            if (!gl) {
                throw new Error('Shader must have gl.');
            }
            if (!type) {
                throw new Error('Shader must have a type, FRAGMENT_SHADER or VERTEX_SHADER');
            }
            /** * *
            * The WebGLRenderingContext
            * @type {WebGLRenderingContext}
            * * **/
            this.gl = gl;
            /** * *
            * The type of this shader.
            * @type {number}
            * * **/
            this.type = type || 0;
            /** * *
            * The source code for this shader
            * @type {string}
            * * **/
            this.src = src || this.defaultSourceForType(type);
            /** * *
            * A list of all the vertex shader attributes.
            * @type {Array.<string>}
            * * **/
            this.attributes = attributes || (type === this.gl.VERTEX_SHADER ? ['aVertex'] : []);
            /** * *
            * A list of all the vertex and fragment shader uniforms.
            * @type {Array.<string>}
            * * **/
            this.uniforms = uniforms || (type === this.gl.VERTEX_SHADER ? ['uMVMatrix', 'uPMatrix'] : []);
            /** * *
            * The webgl shader object.
            * @type {WebGLShader}
            * * **/
            this.id = this.gl.createShader(type);
            
            // Compile the shader...
            this.gl.shaderSource(this.id, this.src);
            this.gl.compileShader(this.id);
            // Check the status of our compilation...
            if (!this.gl.getShaderParameter(this.id, this.gl.COMPILE_STATUS)) {
                throw new Error('Failed to compile shader ' + this.id + ':\n' + this.gl.getShaderInfoLog(this.id));
            }
        }
        
        Shader.prototype = {};
        
        Shader.prototype.constructor = Shader;
        //--------------------------------------
        // METHODS
        //--------------------------------------
        Shader.prototype.defaultSourceForType = function Shader_defaultSourceForType(type) {
            var src = '';
            switch (type) {
                case this.gl.FRAGMENT_SHADER: 
                    src += 'void main(void) { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);}';
                break;
                
                case this.gl.VERTEX_SHADER:
                    src += 'attribute vec3 aVertex;\n';

                    src += 'uniform mat4 uMVMatrix;\n';
                    src += 'uniform mat4 uPMatrix;\n';

                    src += 'void main (void) {\n';
                    src += '    vec4 v = vec4(aVertex, 1);\n';
                    src += '    gl_Position = uPMatrix * uMVMatrix * v;\n';
                    src += '}\n';
                break;
                
                default:
            }
            return src;
        };
        
        
        return Shader;
    }
});