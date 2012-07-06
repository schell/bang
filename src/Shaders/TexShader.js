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
    dependencies : [ 'bang::Shaders/Shader.js' ],
    /** * *
    * Initializes the TexShader object constructor.
    * @param {function} Shader The Shader object constructor.
    * * **/
    init : function TexShaderFactory (Shader) {
        /** * *
        * A static array of available texture sizes.
        * @type {Array.<number>} __textureSizes 
        * * **/
        var __textureSizes = function () {
            var maxSize = document.createElement('canvas').getContext('experimental-webgl').MAX_TEXTURE_SIZE;
            var sizes = [];
            var i = 2;
            var size = Math.pow(2, i);
            while (size <= maxSize) {
                sizes.push(size);
                i++;
                size = Math.pow(2, i);
            }
            return sizes;
        }();
        /** * *
        * Creates a new TexShader object.
        * @constructor
        * * **/
        function TexShader(gl) {
            Shader.prototype.constructor.call(this, gl);
            /** * *
            * An object to hold our initialized textures.
            * @type {Object.<string, WebGLTexture>}
            * * **/
            this.textures = {
                currentTexture : 0
            };
            /** * *
            * The fragment shader source.
            * @type {string}
            * * **/
            this.fragmentSrc = [
                'varying highp vec2 vTex;',
                
                'uniform sampler2D uSampler;',
                
                'void main(void) {',
                '   gl_FragColor = texture2D(uSampler, vec2(vTex.s, vTex.t));',
                '}'
            ].join('');
            /** * *
            * The vertex shader source.
            * @type {string}
            * * **/
            this.vertexSrc = [
                'attribute vec3 aVertex;',
                'attribute vec2 aTex;',
                
                'uniform mat4 uMVMatrix;',
                'uniform mat4 uPMatrix;',
                
                'varying highp vec2 vTex;',
                
                'void main (void) {',
                '    vTex = aTex;',
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
                'aTex'
            ];
            /** * *
            * Returns the component lengths of each vertex attribute.
            * @type {Array.<number>}
            * * **/
            this.attributeComponentLengths = [
                3,
                2
            ];
            /** * *
            * Returns the names of the uniforms.
            * @type {Array.<string>}
            * * **/
            this.uniforms = [
                'uMVMatrix',
                'uPMatrix',
                'uSampler'
            ];
        }
        
        TexShader.prototype = new Shader();
        
        TexShader.prototype.constructor = TexShader;
        //--------------------------------------
        //  TEXTURE SPECIFIC METHODS
        //--------------------------------------
        /** * *
        * Creates and stores a new WebGLTexture.
        * @param {string} name The name of the texture.
        * @param {HTMLElement} image The canvas or image to create the texture with. 
        * @return {WebGLTexture}   
        * * **/
        TexShader.prototype.createTexture = function TexShader_createTexture(name, image) {
            // Prepare the image to become a texture...
            var texImage = false;
            if (image.width !== image.height || __textureSizes.indexOf(image.width) == -1) {
                // We need to create a new image of a power of two to store this image...
                var maxDimension = Math.max(image.width, image.height);
                var size = function findSize(s) {
                    var i = 0;
                    var size = __textureSizes[i];
                    while (s > size) {
                        size = __textureSizes[++i];
                        if (i > __textureSizes.length-1) {
                            throw new Error('Texture size is greater than max available.');
                        }
                    }
                    return size;
                }(maxDimension);
                var canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                canvas.getContext('2d').drawImage(image, 0, 0);
                texImage = canvas;
            } else {
                texImage = image;
            }
            var texture = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texImage);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);  
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);  
            this.gl.generateMipmap(this.gl.TEXTURE_2D);  
            this.gl.bindTexture(this.gl.TEXTURE_2D, null); 

            texture.width = texImage.width;
            texture.height = texImage.height;
            texture.image = texImage;
            texture.fudgeX = texImage.width/image.width;
            texture.fudgeY = texImage.height/image.height;
            // Save the texture...
            this.textures[name] = texture;
            this.textures.currentTexture = texture;
            return texture;
        };
        
        return TexShader;
    }
});