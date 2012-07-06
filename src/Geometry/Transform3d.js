/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Transform3d.js
* A 4x4 transformation matrix for 3d space.
*
* /-----------------------------------------------\
* |    indices    |   elements   |     meaning    |
* |-----------------------------------------------| 
* | 0  1  2  3    | a  e  i  m   | xav xav xav  x |
* | 4  5  6  7    | b  f  j  n   | yav yav yav  y |
* | 8  9  10 11   | c  g  k  o   | zav zav zav  z |
* | 12 13 14 15   | d  h  l  p   |  _   _   _   _ |
* \-----------------------------------------------/
*
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Sat Jun  9 12:46:07 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Transform3d',
    dependencies : [ 'bang::Geometry/Matrix.js' ],
    /** * *
    * Initializes the Transform3d object constructor.
    * @param {function} Matrix The Matrix object constructor.
    * * **/
    init : function Transform3dFactory (Matrix) {
        /** * *
        * Creates a new Transform3d instance.
        * @inherits Transform3d
        * @constructor
        * * **/
        function Transform3d() {
            var args = Array.prototype.slice.call(arguments);
            if (typeof args[0] !== 'object') {
                args.unshift([4,4]);
            }
            Matrix.prototype.constructor.apply(this, args);
        }
        
        Transform3d.prototype = new Matrix([4,4]);
        
        Transform3d.prototype.constructor = Transform3d;
        //--------------------------------------
        //  CLASS METHODS
        //--------------------------------------
        /** * *
        * Creates a frustum projection matrix.
        * @param {number} left The left side of the frustum.
        * @param {number} right The right side of the frustum.
        * @param {number} top The top side of the frustum.
        * @param {number} bottom The bottom side of the frustum.
        * @param {number} znear The near side of the frustum.
        * @param {number} zfar The far side of the frustum.
        * @return {Transform3d}
        * @nosideeffects
        * * **/
        Transform3d.frustum = function Transform3d_frustum(left, right, bottom, top, znear, zfar) {
            var x = 2*znear/(right-left);
            var y = 2*znear/(top-bottom);
            var a = (right+left)/(right-left);
            var b = (top+bottom)/(top-bottom);
            var c = -(zfar+znear)/(zfar-znear);
            var d = -2*zfar*znear/(zfar-znear);
            return new Transform3d(
                x, 0, a, 0,
                0, y, b, 0,
                0, 0, c, d,
                0, 0, -1,0
            );
        };
        /** * *
        * Creates a perspective projection matrix.
        * @param {number} fovy The y axis field of view, in degrees.
        * @param {number} aspect The aspect ratio
        * @type {Transform3d}
        * * **/
        Transform3d.perspective = function Transform3d_perspective(fovy, aspect, near, far) {
            var top = near * Math.tan(fovy * Math.PI / 360.0);
            var bottom = -top;
            var left = bottom * aspect;
            var right = top * aspect;
            
            return Transform3d.frustum(left, right, bottom, top, near, far);
        };
        /** * *
        * Creates an orthographic projection matrix.
        * @param {number} left The left side of the frustum.
        * @param {number} right The right side of the frustum.
        * @param {number} top The top side of the frustum.
        * @param {number} bottom The bottom side of the frustum.
        * @param {number} near The near side of the frustum.
        * @param {number} far The far side of the frustum.
        * @return {Transform3d}
        * @nosideeffects
        * * **/
        Transform3d.ortho = function Transform3d_ortho(left, right, top, bottom, near, far) {
            return new Transform3d(
                2/(right-left), 0, 0, -(right+left)/(right-left),
                0, 2/(top-bottom), 0, -(top+bottom)/(top-bottom),
                0, 0, -2/(far-near), -(far+near)/(far-near),
                0, 0, 0, 1
            );
        };
        /** * *
        * Creats a projection matrix looking at a specific location.
        * * **/
        Transform3d.prototype.lookAt = function Transform3d_lookAt(eyex, eyey, eyez, x, y, z, upx, upy, upz) {
            
        };
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns the x element. 
        * If *x* is supplied as a parameter, will set the x element before returning.
        * @param {number}
        * @return {number}
        * * **/
        Transform3d.prototype.x = function Transform3d_x(x) {
            if (arguments.length) {
                this[3] = x;
            }
            return this[3];
        };
        /** * *
        * Returns the y element.
        * If *y* is supplied as a parameter, will set the y element before returning.
        * @param {number}
        * @return {number}
        * * **/
        Transform3d.prototype.y = function Transform3d_y(y) {
            if (arguments.length) {
                this[7] = y;
            }
            return this[7];
        };
        /** * *
        * Returns the z element.
        * If *z* is supplied as a parameter, will set the z element before returning.
        * @param {number}
        * @returns {number}
        * * **/
        Transform3d.prototype.z = function Transform3d_y(y) {
            if (arguments.length) {
                this[11] = y;
            }
            return this[11];
        };
        /** * *
        * Translate this matrix by x, y and z.
        * @param {number} x 
        * @param {number} y 
        * @param {number} z
        * @return {Transform3d}
        * @nosideeffects
        * * **/
        Transform3d.prototype.translate = function Transform3d_translate(x, y, z) {
            x = x || 0;
            y = y || 0;
            z = z || 0;
            var translate = new Transform3d(
                1, 0, 0, x,
                0, 1, 0, y,
                0, 0, 1, z,
                0, 0, 0, 1
            );
            return this.multiply(translate);
        };
        /** * *
        * Return this matrix scaled by x, y, z.
        * @param {number} x
        * @param {number} y
        * @param {number} z
        * @return {Transform3d}
        * * **/
        Transform3d.prototype.scale = function Transform3d_scale(x, y, z) {
            x = typeof x === 'number' ? x : 1;
            y = typeof y === 'number' ? y : 1;
            z = typeof z === 'number' ? z : 1;
            var scale = new Transform3d(
                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1
            );
            return this.multiply(scale);
        };
        /** * *
        * Rotates this matrix about a vector.
        * @param {number} radians The amount of the rotation in radians.
        * @param {Vector} vec3d The vector to rotate around.
        * @return {Transform3d}
        * * **/
        Transform3d.prototype.rotate = function Matrix_rotate(radians, vec3d) {
            // If no vector is given, rotate about z.
            vec3d = vec3d || new Vector(0, 0, 1);
            var x = vec3d[0]*radians;
            var y = vec3d[1]*radians;
            var z = vec3d[2]*radians;
            var cos = Math.cos;
            var sin = Math.sin;
            var rotation = new Transform3d(
                cos(y)*cos(z), -cos(x)*sin(z)+sin(x)*sin(y)*sin(z),  sin(x)*sin(z) + cos(x)*sin(y)*cos(z), 0,
                cos(y)*sin(z),  cos(x)*cos(z)+sin(x)*sin(y)*sin(z), -sin(x)*cos(z) + cos(x)*sin(y)*sin(z), 0,
                      -sin(y),                       sin(x)*cos(y),                         cos(x)*cos(y), 0,
                            0,                                   0,                                     0, 1 
            );
            return this.multiply(rotation);
        };
        /** * *
        * Transforms a 2D vector by this matrix
        * @param {Vector}
        * @return {Vector}
        * @nosideeffects
        * * **/
        Transform3d.prototype.transformVector = function Transform3d_transformVector(vec) {
            // Make the 2-vector a homogenous 1x4 matrix...
            var mat = new Matrix([1,4], vec[0], vec[1], vec[2], 1);
            var mult = this.multiply(mat);
            return mult.foldl(function (acc, el) {
                if (acc.length < 2) {
                    acc.push(el);
                }
                return acc;
            }, new Vector());
        };
        /** * *
        * Transforms a mesh using this matrix.
        * @param {Mesh}
        * @return {Mesh}
        * @nosideeffects
        * * **/
        Transform3d.prototype.transformMesh = function Transform3d_transformMesh(input) {
            var polygon = new input.constructor();
            var i = 0;
            for (i; i < input.length; i+=3) {
                var x = input[i];
                var y = input[i+1];
                var z = input[i+2];
                var shim = new Vector(x,y);
                var tvec = this.transformVector(shim);
                polygon[i] = tvec[0];
                polygon[i+1] = tvec[1];
                polygon[i+2] = tvec[2];
            }
            polygon.length = i;
            return polygon;
        };
        //--------------------------------------
        //  DIRECTIONAL VECTORS
        //--------------------------------------
        /** * *
        * Returns the out vector.
        * @return {Vector}
        * * **/
        Transform3d.prototype.out = function Transform3d_out() {
            var out = this.row(2);
            out.pop();
            return out;
        };
        /** * *
        * Returns the up vector.
        * @return {Vector}
        * * **/
        Transform3d.prototype.up = function Transform3d_up() {
            var up = this.row(1);
            up.pop();
            return up;
        };
        /** * *
        * Returns the right vector.
        * @return {Vector}
        * * **/
        Transform3d.prototype.right = function Transform3d_right() {
            var right = this.row(0);
            right.pop();
            return right;
        };
        
        return Transform3d;
    }
});