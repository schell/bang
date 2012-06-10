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
        function Shader(context, type, src) {
            if (!context) {
                throw new Error('Shader must have context.');
            }
            if (!type) {
                throw new Error('Shader must have a type, FRAGMENT_SHADER or VERTEX_SHADER');
            }
            /** * *
            * The WebGLRenderingContext
            * @type {WebGLRenderingContext}
            * * **/
            this.context = context;
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
            * The webgl shader object.
            * @type {WebGLShader}
            * * **/
            this.id = this.context.createShader(type);
            
            // Compile the shader...
            this.context.shaderSource(this.id, this.src);
            this.context.compileShader(this.id);
            // Check the status of our compilation...
            if (!this.context.getShaderParameter(this.id, this.context.COMPILE_STATUS)) {
                throw new Error('Failed to compile shader ' + this.id + ':\n' + this.context.getShaderInfoLog(this.id));
            }
        }
        
        Shader.prototype = {};
        
        Shader.prototype.constructor = Shader;
        //--------------------------------------
        //  CLASS PROPERTIES
        //--------------------------------------
        Shader.prototype.defaultSourceForType = function Shader_defaultSourceForType(type) {
            var src = '';
            switch (type) {
                case this.context.FRAGMENT_SHADER: 
                    src += '#ifdef GL_ES\n';
                    src += '	precision highp float;\n';
                    src += '#endif\n';
                    src += '\n';
                    src += 'varying vec4 vColor;\n';
                    src += '\n';
                    src += 'void main (void) {\n';
                    src += '	gl_FragColor = vColor;\n';
                    src += '}\n';
                break;
                
                case this.context.VERTEX_SHADER:
                    src += 'attribute vec3 aVertexPosition;\n';
                    src += '\n';
                    src += 'uniform mat4 uMVMatrix;\n';
                    src += 'uniform mat4 uPMatrix;\n';
                    src += 'uniform vec4 uColor;\n';
                    src += '\n';
                    src += 'varying vec4 vColor;\n';
                    src += '\n';
                    src += 'void main (void) {\n';
                    src += '\n';
                    src += '    vec4 v = vec4(aVertexPosition, 1);\n';
                    src += '\n';
                    src += '    gl_Position = uPMatrix * uMVMatrix * v;\n';
                    src += '	vColor = uColor;\n';
                    src += '}\n';
                break;
                
                default:
            }
            return src;
        };
        
        return Shader;
    }
});