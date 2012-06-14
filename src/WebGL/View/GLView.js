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
    dependencies : [ 'bang::Geometry/Transform3d.js', 'bang::Geometry/Mesh.js', 'bang::WebGL/Shaders/Program.js' ],
    /** * *
    * Initializes the GLView object constructor.
    * @param {function} View The View constructor.
    * * **/
    init : function GLViewFactory (Transform3d, Mesh, Program) {
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
            * @type {Program|boolean}
            * * **/
            this.program = this.gl ? new Program(this.gl) : false;
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
            if (!subView.program) {
                subView.program = this.program;
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
            if (!subView.program) {
                subView.program = this.program;
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
        };
        /** * *
        * Draws the view.
        * * **/
        GLView.prototype.draw = function GLView_draw(parentMatrix) {
            if (!this.meshBuffer && this.mesh) {
                this.meshBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh), this.gl.STATIC_DRAW);
            }
            
            var floatSize = 4;
            var components = 3/*position*/ + 4/*color*/;
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshBuffer);
            this.gl.vertexAttribPointer(this.program.shaderAttributeLocations.aVertex, 3, this.gl.FLOAT, false, components*floatSize, 0);
            this.gl.vertexAttribPointer(this.program.shaderAttributeLocations.aColor, 4, this.gl.FLOAT, false, components*floatSize, 3*floatSize);
            
            var mvMatUniform = this.gl.getUniformLocation(this.program.id, 'uMVMatrix');
            var transform = parentMatrix ? parentMatrix.multiply(this.transform) : this.transform;
            this.gl.uniformMatrix4fv(mvMatUniform, false, new Float32Array(transform.transpose()));
            
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.mesh.length/7);
            
            for (var i=0; i < this.displayList.length; i++) {
                var child = this.displayList[i];
                child.draw(transform);
            }
        };
        
        return GLView;
    }
});