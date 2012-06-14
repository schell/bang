/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* GLView.js
* A View in 3d space. 
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed May 30 16:08:45 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'GLView',
    dependencies : [ 'bang::Geometry/Transform3d.js', 'bang::Geometry/Mesh.js'],
    /** * *
    * Initializes the GLView object constructor.
    * @param {function} View The View constructor.
    * * **/
    init : function GLViewFactory (Transform3d, Mesh) {
        /** * *
        * Creates a new GLView. By default a GLView's mesh will be a flat triangle
        * at the origin of 3d space.
        * @param {Mesh} mesh
        * @constructor
        * * **/
        function GLView(gl, mesh) {
            /** * *
            * The WebGLRenderingContext that this view renders into.
            * @type {WebGLRenderingContext}
            * * **/
            this.gl = gl;
            /** * *
            * A reference to the root view.
            * This is important because the root view typically handles
            * the projection matrix.
            * @type {GLStage}
            * * **/
            this.stage = false;
            /** * *
            * A model mesh.
            * @type {Mesh}
            * * **/
            this.mesh = mesh || new Mesh(
                // positions        // colors
                1.0,  1.0,  0.0,    1.0, 1.0, 1.0, 1.0,
                -1.0, 1.0,  0.0,    1.0, 0.0, 0.0, 1.0,
                1.0,  -1.0, 0.0,    0.0, 1.0, 0.0, 1.0,
                -1.0, -1.0, 0.0,    0.0, 0.0, 1.0, 1.0
            );
            /** * *
            * The transformation of the view.
            * @type {Transform3d}
            * * **/
            this.transform = new Transform3d();
            /** * *
            * A WebGLBuffer to hold our mesh data.
            * False by default, will bind to a buffer before the first draw
            * after a mesh has been set as this property.
            * @type {WebGLBuffer|boolean}
            * * **/
            this.meshBuffer = false;
            /** * *
            * A list of child views.
            * @type {Array.<GLView>}
            * * **/
            this.displayList = [];
            /** * *
            * The shader program to use for drawing.
            * @type {Shader|boolean}
            * * **/
            this.shader = this.gl ? new Shader(this.gl) : false;
        }
        
        GLView.prototype = {};
        
        GLView.prototype.constructor = GLView;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Adds a subview to this view.
        * @param {GLView}
        * * **/
        GLView.prototype.addView = function GLView_addView(subView) {
            if (subView.parent) {
                subView.parent.removeView(subView);
            }
            this.displayList.push(subView);
            subView.parent = this;
            if (!subView.gl) {
                subView.gl = this.gl;
            }
            if (!subView.shader) {
                subView.shader = this.shader;
            }
            subView.stage = this.stage;
        };
        /** * *
        * Adds a subview to this view at a given index.
        * @param {GLView}
        * @param {number}
        * * **/
        GLView.prototype.addViewAt = function GLView_addViewAt(subView, insertNdx) {
            insertNdx = insertNdx || 0;
            
            if (subView.parent) {
                subView.parent.removeView(subView);
            }
            this.displayList.splice(insertNdx, 0, subView);
            subView.parent = this;
            if (!subView.gl) {
                subView.gl = this.gl;
            }
            if (!subView.shader) {
                subView.shader = this.shader;
            }
            subView.stage = this.stage;
        };
        /** * *
        * Removes a subview of this view.
        * @param {GLView}
        * * **/
        GLView.prototype.removeView = function GLView_removeView(subView) {
            var ndx = this.displayList.indexOf(subView);
            if (ndx !== -1) {
                this.displayList.splice(ndx, 1);
            } else {
                throw new Error('Subview must be a child of the caller.');
            }
            subView.parent = false;
            subView.stage = false;
        };
        /** * *
        * Buffers the mesh and stores it in meshBuffer.
        * * **/
        GLView.prototype.bufferMeshData = function GLView_bufferMeshData() {
            this.meshBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh), this.gl.STATIC_DRAW);
        };
        /** * *
        * Sets up the vertex attribute pointers for a draw.
        * * **/
        GLView.prototype.setVertices = function GLView_setupVertices() {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshBuffer);
            this.shader.setVertexAttribPointers();
        };
        /** * *
        * Sets the shader uniforms.
        * @param {Transform3d} parentMatrix The parent view's transform matrix.
        * @return {Transform3d} The compound transform.
        * * **/
        GLView.prototype.setUniforms = function GLView_setUniforms(parentMatrix) {
            var mvMatUniform = this.shader.uniformLocations.uMVMatrix;
            var transform = parentMatrix ? parentMatrix.multiply(this.transform) : this.transform;
            this.gl.uniformMatrix4fv(mvMatUniform, false, new Float32Array(transform.transpose()));
            return transform;
        };
        /** * *
        * Draws the view.
        * * **/
        GLView.prototype.draw = function GLView_draw(parentMatrix) {
            if (!this.meshBuffer && this.mesh) {
                this.bufferMeshData();
            }
            
            this.setVertices();
            var compoundTransform = this.setUniforms(parentMatrix);
            
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.mesh.length/7);
            
            for (var i=0; i < this.displayList.length; i++) {
                var child = this.displayList[i];
                child.draw(compoundTransform);
            }
        };
        
        return GLView;
    }
});