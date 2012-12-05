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
    dependencies : [ 
        'bang3d::Geometry/Transform3d.js', 
        'bang3d::Geometry/Mesh.js', 
        'bang3d::Shaders/Shader.js', 
        'bang3d::Shaders/TexShader.js',
        'bang::Geometry/Vector.js'
    ],
    /** * *
    * Initializes the View3d object constructor.
    * @param {function} View The View constructor.
    * * **/
    init : function View3dFactory (Transform3d, Mesh, Shader, TexShader, Vector) {
        /** * *
        * Creates a new View3d. By default a View3d's mesh will be a flat triangle
        * at the origin of 3d space.
        * @param {Mesh} mesh
        * @constructor
        * * **/
        function View3d(x,y,z, mesh) {
            x = x || 0;
            y = y || 0;
            z = z || 0;
            /** * *
            * A reference to the root view.
            * This is important because the root view typically handles
            * the projection matrix.
            * @type {Stage3d}
            * * **/
            this.stage = false;
            /** * *
            * The x coordinate.
            * @type {number} x
            * * **/
            this.x = 0;
            /** * *
            * The y coordinate.
            * @type {number} y
            * * **/
            this.y = 0;
            /** * *
            * The z coordinate.
            * @type {number} z 
            * * **/
            this.z = 0;
            /** * *
            * The x scale.
            * @type {number}
            * * **/
            this.scaleX = 1;
            /** * *
            * The y scale.
            * @type {number}
            * * **/
            this.scaleY = 1;
            /** * *
            * The y scale.
            * @type {number}
            * * **/
            this.scaleZ = 1;
            /** * *
            * The rotation (in radians) about the global x axis.
            * @type {number}
            * * **/
            this.rotationX = 0;
            /** * *
            * The rotation (in radians) about the global y axis.
            * @type {number}
            * * **/
            this.rotationY = 0;
            /** * *
            * The rotation (in radians) about the global z axis.
            * @type {number}
            * * **/
            this.rotationZ = 0;
            /** * *
            * A specific shader to use for rendering.
            * @type {Shader} shader 
            * * **/
            this.shader = false;
            /** * *
            * A WebGLBuffer to hold our mesh data.
            * False by default, will bind to a buffer before the first draw
            * after a mesh has been set as this property.
            * @type {WebGLBuffer|boolean}
            * * **/
            this.meshBuffer = false;
            /** * *
            * A model mesh.
            * @type {Mesh}
            * * **/
            this.mesh = mesh || new Mesh();
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
        * Constructs and returns a transformation matrix
        * based on the current view properties.
        * * **/
        View3d.prototype.localTransform = function View3d_localTransform() {
            var transform = new Transform3d();
            transform = transform.translate(this.x, this.y, this.z);
            transform = transform.scale(this.scaleX, this.scaleY, this.scaleZ);
            transform = transform.rotate(this.rotationX, [1,0,0]);
            transform = transform.rotate(this.rotationY, [0,1,0]);
            transform = transform.rotate(this.rotationZ, [0,0,1]);
            return transform;
        };
        /** * *
        * Constructs a position vector.
        * @return {Vector} 
        * @nosideeffects
        * * **/
        View3d.prototype.position = function View3d_position() {
            return new Vector(this.x, this.y, this.z);
        };
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
            subView.stage = this.stage;
            if (!subView.shader && this.shader) {
                subView.shader = this.shader;
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
            subView.stage = this.stage;
            if (!subView.shader && this.shader) {
                subView.shader = this.shader;
            }
        };
        /** * *
        * Removes a subview.
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
            return (this.mesh && this.meshBuffer && this.shader);
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
        * Sets the shader to use for rendering the view.
        * @param {Shader} shader
        * * **/
        View3d.prototype.useShader = function View_useShader(shader) {
            this.shader = shader;
        };
        /** * *
        * Buffers the mesh and stores it in meshBuffer.
        * * **/
        View3d.prototype.bufferMeshData = function View3d_bufferMeshData() {
            this.meshBuffer = this.stage.gl.createBuffer();
            this.stage.gl.bindBuffer(this.stage.gl.ARRAY_BUFFER, this.meshBuffer);
            this.stage.gl.bufferData(this.stage.gl.ARRAY_BUFFER, new Float32Array(this.mesh), this.stage.gl.STATIC_DRAW);
        };
        /** * *
        * Sends the geometry to WebGL.
        * If you have defined your own shaders you'll have to update (override)
        * this function to draw your models in a meaningful way.
        * @param {Transform3d} mvMatrix The global model view matrix.
        * * **/
        View3d.prototype.sendGeometry = function View3d_sendGeometry(mvMatrix) {
            // Let's use this shader...
            if (!this.shader) {
                return;
            }
            this.shader.use();
            // Update the projection matrix...
            var pMatUniform = this.shader.uniformLocations.uPMatrix;
            this.stage.gl.uniformMatrix4fv(pMatUniform, false, new Float32Array(this.stage.projection.transpose()));
            
            // By default we'll check to see whether our stage's shader is 
            // one of the included ones...
            if (this.shader.constructor === TexShader) {
                this.sendGeometryTextured(mvMatrix);
            } else if (this.shader.constructor === Shader) {
                this.sendGeometryNotTextured(mvMatrix);
            }
        };
        /** * *
        * Sends the geometry to WebGL and assumes the shader is a Shader.
        * For special views or shaders, override this method.
        * @param {Transform3d} mvMatrix The global model view matrix.
        * * **/
        View3d.prototype.sendGeometryNotTextured = function View3d_sendGeometry(mvMatrix) {
            mvMatrix = mvMatrix || this.localTransform();

            this.stage.gl.bindBuffer(this.stage.gl.ARRAY_BUFFER, this.meshBuffer);
            this.shader.setVertexAttribPointers();

            var mvMatUniform = this.shader.uniformLocations.uMVMatrix;
            this.stage.gl.uniformMatrix4fv(mvMatUniform, false, new Float32Array(mvMatrix.transpose()));
            
            var numPoints = this.mesh.length/this.shader.numberOfComponents();
            this.stage.gl.drawArrays(this.stage.gl.TRIANGLES, 0, numPoints);  
        };
        /** * *
        * Sends the geometry to WebGL and assumes the shader is a TexShader.
        * For special views or shaders, override this method.
        * @param {Transform3d} mvMatrix The global model view matrix.
        * * **/
        View3d.prototype.sendGeometryTextured = function View3d_sendGeometryTextured(mvMatrix) {
            mvMatrix = mvMatrix || this.localTransform();

            this.stage.gl.bindBuffer(this.stage.gl.ARRAY_BUFFER, this.meshBuffer);
            this.shader.setVertexAttribPointers();

            this.stage.gl.activeTexture(this.stage.gl.TEXTURE0);
            this.stage.gl.bindTexture(this.stage.gl.TEXTURE_2D, this.shader.textures.currentTexture);
            this.stage.gl.uniform1i(this.shader.uniformLocations.uSampler, 0);

            var mvMatUniform = this.shader.uniformLocations.uMVMatrix;
            this.stage.gl.uniformMatrix4fv(mvMatUniform, false, new Float32Array(mvMatrix.transpose()));
            
            var numPoints = this.mesh.length/this.shader.numberOfComponents();
            this.stage.gl.drawArrays(this.stage.gl.TRIANGLES, 0, numPoints); 
        };
        /** * *
        * Draws the view.
        * @param {Transform3d} mvMatrix The current model view transformation matrix.
        * * **/
        View3d.prototype.draw = function View3d_draw(mvMatrix) {
            if (!this.isInitialized()) {
                if (this.stage) {
                    this.initialize();
                } else {
                    return;
                }
            }
            
            var localTransform = this.localTransform();
            mvMatrix = mvMatrix || localTransform;
            if (mvMatrix !== localTransform) {
                mvMatrix = mvMatrix.multiply(localTransform);
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
