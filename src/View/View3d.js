/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* View3d.js
* A View in 3d space. 
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed May 30 16:08:45 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'View3d',
    dependencies : [ 'bang::Geometry/Transform3d.js', 'bang::Geometry/Mesh.js', 'bang::Shaders/TexShader.js' ],
    /** * *
    * Initializes the View3d object constructor.
    * @param {function} View The View constructor.
    * * **/
    init : function View3dFactory (Transform3d, Mesh, TexShader) {
        /** * *
        * Creates a new View3d. By default a View3d's mesh will be a flat triangle
        * at the origin of 3d space.
        * @param {Mesh} mesh
        * @constructor
        * * **/
        function View3d(gl, mesh) {
            /** * *
            * The WebGLRenderingContext that this view renders into.
            * @type {WebGLRenderingContext}
            * * **/
            this.gl = gl;
            /** * *
            * A reference to the root view.
            * This is important because the root view typically handles
            * the projection matrix.
            * @type {Stage3d}
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
            * @type {Array.<View3d>}
            * * **/
            this.displayList = [];
        }
        
        View3d.prototype = {};
        
        View3d.prototype.constructor = View3d;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Adds a subview to this view.
        * @param {View3d}
        * * **/
        View3d.prototype.addView = function View3d_addView(subView) {
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
        * @param {View3d}
        * @param {number}
        * * **/
        View3d.prototype.addViewAt = function View3d_addViewAt(subView, insertNdx) {
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
        * @param {View3d}
        * * **/
        View3d.prototype.removeView = function View3d_removeView(subView) {
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
        View3d.prototype.isInitialized = function View3d_isInitialized() {
            return (this.mesh && this.meshBuffer);
        };
        /** * *
        * Initializes the view.
        * * **/
        View3d.prototype.initialize = function View3d_initialize() {
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
        View3d.prototype.bufferMeshData = function View3d_bufferMeshData() {
            this.meshBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh), this.gl.STATIC_DRAW);
        };
        /** * *
        * Sends the geometry to WebGL.
        * If you have defined your own shaders you'll have to update (override)
        * this function to draw your models in a meaningful way.
        * @param {Transform3d} mvMatrix The global model view matrix.
        * * **/
        View3d.prototype.sendGeometry = function View3d_sendGeometry(mvMatrix) {
            // By default we'll check to see whether our stage's shader is 
            // one of the included ones...
            if (TexShader.prototype.isPrototypeOf(this.stage.shader)) {
                this.sendGeometryTextured(mvMatrix);
            } else if (Shader.prototype.isPrototypeOf(this.stage.shader)) {
                this.sendGeometryNotTextured(mvMatrix);
            }
        };
        /** * *
        * Sends the geometry to WebGL and assumes the shader is a Shader.
        * For special views or shaders, override this method.
        * @param {Transform3d} mvMatrix The global model view matrix.
        * * **/
        View3d.prototype.sendGeometryNotTextured = function View3d_sendGeometry(mvMatrix) {
            mvMatrix = mvMatrix || this.transform;
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshBuffer);
            this.stage.shader.setVertexAttribPointers();

            var mvMatUniform = this.stage.shader.uniformLocations.uMVMatrix;
            this.gl.uniformMatrix4fv(mvMatUniform, false, new Float32Array(mvMatrix.transpose()));
            
            var numPoints = this.mesh.length/this.stage.shader.numberOfComponents();
            this.gl.drawArrays(this.gl.TRIANGLES, 0, numPoints);  
        };
        /** * *
        * Sends the geometry to WebGL and assumes the shader is a TexShader.
        * For special views or shaders, override this method.
        * @param {Transform3d} mvMatrix The global model view matrix.
        * * **/
        View3d.prototype.sendGeometryTextured = function View3d_sendGeometryTextured(mvMatrix) {
            mvMatrix = mvMatrix || this.transform;

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshBuffer);
            this.shader.setVertexAttribPointers();

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.shader.textures.currentTexture);
            this.gl.uniform1i(this.shader.uniformLocations.uSampler, 0);

            var mvMatUniform = this.shader.uniformLocations.uMVMatrix;
            this.gl.uniformMatrix4fv(mvMatUniform, false, new Float32Array(mvMatrix.transpose()));
            
            var numPoints = this.mesh.length/this.shader.numberOfComponents();
            this.gl.drawArrays(this.gl.TRIANGLES, 0, numPoints); 
        };
        /** * *
        * Draws the view.
        * @param {Transform3d} mvMatrix The current model view transformation matrix.
        * * **/
        View3d.prototype.draw = function View3d_draw(mvMatrix) {
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
        
        return View3d;
    }
});