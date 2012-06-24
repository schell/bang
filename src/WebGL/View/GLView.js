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
            subView.stage = this.stage;
            // If the view is not initialized, initialize it...
            if (this.isInitialized() && !subView.isInitialized()) {
                subView.initialize();
            }
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
            subView.stage = this.stage;
            // If the view is not initialized, initialize it...
            if (this.isIinitialized() && !subView.isInitialized()) {
                subView.initialize();
            }
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
        * Returns whether or not this view has been initialized.
        * Use this to determine whether your shaders need to be compiled,
        * or whether your vertices need to be buffered.
        * @return {boolean}
        * * **/
        GLView.prototype.isInitialized = function GLView_isInitialized() {
            return (this.mesh && this.meshBuffer);
        };
        /** * *
        * Initializes the view.
        * * **/
        GLView.prototype.initialize = function GLView_initialize() {
            this.bufferMeshData();
            // Initialize all its children...
            for (var i=0; i < this.displayList.length; i++) {
                var child = this.displayList[i];
                child.initialize();
            }
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
        * Sends the geometry to WebGL.
        * @param {Transform3d} mvMatrix The global model view matrix.
        * * **/
        GLView.prototype.sendGeometry = function GLView_sendGeometry(mvMatrix) {
            mvMatrix = mvMatrix || this.transform;
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshBuffer);
            this.stage.shader.setVertexAttribPointers();

            var mvMatUniform = this.stage.shader.uniformLocations.uMVMatrix;
            this.gl.uniformMatrix4fv(mvMatUniform, false, new Float32Array(mvMatrix.transpose()));
            
            var numPoints = this.mesh.length/this.stage.shader.numberOfComponents();
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, numPoints);  
        };
        /** * *
        * Draws the view.
        * @param {Transform3d} mvMatrix The current model view transformation matrix.
        * * **/
        GLView.prototype.draw = function GLView_draw(mvMatrix) {
            if (!this.isInitialized()) {
                return;
            }
            
            mvMatrix = mvMatrix || this.transform;
            if (mvMatrix !== this.transform) {
                mvMatrix = mvMatrix.multiply(this.transform);
            }
            
            this.sendGeometry(mvMatrix);
            
            for (var i=0; i < this.displayList.length; i++) {
                var child = this.displayList[i];
                child.draw(mvMatrix);
            }
        };
        
        return GLView;
    }
});