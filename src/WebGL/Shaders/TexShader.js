/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* TexShader.js
* A texture shader.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Jun 12 21:12:19 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'TexShader',
    dependencies : [ 'bang::WebGL/Shader/Shader.js' ],
    /** * *
    * Initializes the TexShader object constructor.
    * @param {function} Shader The Shader object constructor.
    * * **/
    init : function TexShaderFactory (Shader) {
        /** * *
        * Creates a new TexShader object.
        * @constructor
        * * **/
        function TexShader(gl, type, src, attributes, uniforms) {
            if (!gl) {
                throw new Error('Shader must have gl.');
            }
            if (!type) {
                throw new Error('Shader must have a type, FRAGMENT_SHADER or VERTEX_SHADER');
            }
            /** * *
            * A list of all the vertex shader attributes.
            * @type {Array.<string>}
            * * **/
            attributes = attributes || (type === this.gl.VERTEX_SHADER ? ['aVertex','aTex'] : []);
            /** * *
            * A list of attribute sizes.
            * @type {Array.<number>}
            * * **/
            this.attributeSizes = attributeSize || (type === this.gl.VERTEX_SHADER ? [3,2] : []);
            /** * *
            * A list of all the vertex and fragment shader uniforms.
            * @type {Array.<string>}
            * * **/
            uniforms = uniforms || (type === this.gl.VERTEX_SHADER ? ['uMVMatrix', 'uPMatrix', 'uSampler'] : []);
            
            Shader.prototype.constructor.call(this, gl, type, attributes, uniforms);
        }
        
        TexShader.prototype = {};
        
        TexShader.prototype.constructor = TexShader;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * The source string for this shader.
        * @param {number}
        * @return {string}
        * * **/
        Shader.prototype.defaultSourceForType = function Shader_defaultSourceForType(type) {
            var src = '';
            switch (type) {
                case this.gl.FRAGMENT_SHADER: 
                    src += 'varying highp vec2 vTex;\n';

                    src += 'uniform sampler2D uSampler;\n';
                    
                    src += 'void main(void) {\n';
                    src += '    gl_FragColor = texture2D(uSampler, vec2(vTex.s, vTex.t))\n';
                    src += '}\n';
                break;
                
                case this.gl.VERTEX_SHADER:
                    src += 'attribute vec3 aVertex;\n';
                    src += 'attribute vec2 aTex;\n';

                    src += 'uniform mat4 uMVMatrix;\n';
                    src += 'uniform mat4 uPMatrix;\n';

                    src += 'varying highp vec2 vTex;\n';

                    src += 'void main (void) {\n';
                    src += '    vec4 v = vec4(aVertex, 1);\n';
                    src += '    gl_Position = uPMatrix * uMVMatrix * v;\n';
                    src += '    vTex = aTex;\n';
                    src += '}\n';
                break;
                
                default:
            }
            return src;
        };
        
        
        return TexShader;
    }
});