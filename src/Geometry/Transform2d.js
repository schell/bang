/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Transform2d.js
* A two dimensional transformation matrix (3x3).
*
* /---------------------------------------\
* | indices     | elements   | meaning    |
* |---------------------------------------| 
* | 0  1  2     | a  d  g    | s/r  r   x |
* | 3  4  5     | b  e  h    |  r  s/r  y |
* | 6  7  8     | c  f  i    |  0   0   s |
* |             |            |            |
* \---------------------------------------/ 
*
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Fri Jun  8 19:26:02 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Transform2d',
    dependencies : [ 'bang::Geometry/Matrix.js' ],
    /** * *
    * Initializes the Transform2d object constructor.
    * @param {function} Matrix The Matrix object constructor.
    * * **/
    init : function Transform2dFactory (Matrix) {
        /** * *
        * Creates new instances of Transform2d.
        * @inherits Matrix
        * @constructor
        * * **/
        function Transform2d() {
            var args = Array.prototype.slice.call(arguments);
            Matrix.prototype.constructor.apply(this, args);
        }
        
        Transform2d.prototype = new Matrix([3,3]);
        
        Transform2d.prototype.constructor = Transform2d;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * The string representation of the transform.
        * @return {string}
        * * **/
        Transform2d.prototype.toString = function Transform2d_toString() {
            return Matrix.prototype.toString.call(this).replace('Matrix', 'Transform2d');
        };
        /** * *
        * Returns the 'a' matrix component.
        * @return {number}
        * * **/
        Transform2d.prototype.a = function Transform2d_a() {
            return this[0];
        };
        /** * *
        * Returns the 'b' matrix component.
        * @return {number}
        * * **/
        Transform2d.prototype.b = function Transform2d_b() {
            return this[3];
        };
        /** * *
        * Returns the 'c' matrix component.
        * @return {number}
        * * **/
        Transform2d.prototype.c = function Transform2d_c() {
            return this[6];
        };
        /** * *
        * Returns the 'd' matrix component.
        * @return {number}
        * * **/
        Transform2d.prototype.d = function Transform2d_d() {
            return this[1];
        };
        /** * *
        * Returns the 'e' matrix component.
        * @return {number}
        * * **/
        Transform2d.prototype.e = function Transform2d_e() {
            return this[4];
        };
        /** * *
        * Returns the 'f' matrix component.
        * @return {number}
        * * **/
        Transform2d.prototype.f = function Transform2d_f() {
            return this[7];
        };
        /** * *
        * Returns the 'g' matrix component.
        * @return {number}
        * * **/
        Transform2d.prototype.g = function Transform2d_g() {
            return this[2];
        };
        /** * *
        * Returns the 'h' matrix component.
        * @return {number}
        * * **/
        Transform2d.prototype.h = function Transform2d_h() {
            return this[5];
        };
        /** * *
        * Returns the 'i' matrix component.
        * @return {number}
        * * **/
        Transform2d.prototype.i = function Transform2d_i() {
            return this[8];
        };
        /** * *
        * Returns an array consisting of the a, b, d, e, g, and h elements.
        * Used for easily setting the transform of a CanvasRenderingContext2D.
        * @return {Array.<number>}
        * * **/
        Transform2d.prototype.abdegh = function Transform2d_abdegh() {
            return [this.a(),this.b(),this.d(),this.e(),this.g(),this.h()];
        };
        /** * *
        * Returns the x element. 
        * If *x* is supplied as a parameter, will set the x element before returning.
        * @param {number}
        * @returns number
        * * **/
        Transform2d.prototype.x = function Transform2d_x(x) {
            if (arguments.length) {
                this[2] = x;
            }
            return this[2];
        };
        /** * *
        * Returns the y element.
        * If *y* is supplied as a parameter, will set the y element before returning.
        * @param {number}
        * @returns number
        * * **/
        Transform2d.prototype.y = function Transform2d_y(y) {
            if (arguments.length) {
                this[5] = y;
            }
            return this[5];
        };
        /** * *
        * Translate this matrix by x, y.
        * @param {number}
        * @param {number}
        * @return {Matrix}
        * @nosideeffects
        * * **/
        Transform2d.prototype.translate = function Transform2d_translate(x, y) {
            x = x || 0;
            y = y || 0;
            var translate = new Transform2d(
                1, 0, x,
                0, 1, y,
                0, 0, 1
            );
            return this.multiply(translate);
        };
        /** * *
        * Return this matrix scaled by x, y.
        * @param {number}
        * @param {number}
        * @return {Matrix}
        * * **/
        Transform2d.prototype.scale = function Transform2d_scale(x, y) {
            x = x || 1;
            y = y || 1;
            var scale = new Transform2d(
                x, 0, 0,
                0, y, 0,
                0, 0, 1
            );
            return this.multiply(scale);
        };
        /** * *
        * Rotates this matrix about z.
        * @param {number}
        * @return {Matrix}
        * * **/
        Transform2d.prototype.rotate = function Matrix_rotate(radians) {
            var rotation = new Transform2d(
                Math.cos(radians), -Math.sin(radians), 0,
                Math.sin(radians), Math.cos(radians), 0,
                0, 0, 1
            );
            return this.multiply(rotation);
        };
        /** * *
        * Transforms a 2D vector by this matrix
        * @param {Vector}
        * @return {Vector}
        * @nosideeffects
        * * **/
        Transform2d.prototype.transformVector = function Transform2d_transformVector(vec) {
            // Make the 2-vector a homogenous 1x3 matrix...
            var mat = new Matrix([1,3], vec[0], vec[1], 1);
            var mult = this.multiply(mat);
            return mult.foldl(function (acc, el) {
                if (acc.length < 2) {
                    acc.push(el);
                }
                return acc;
            }, new Vector());
        };
        /** * *
        * Transforms polygon input using this matrix.
        * @param {Polygon}
        * @return {Polygon}
        * @nosideeffects
        * * **/
        Transform2d.prototype.transformPolygon = function Transform2d_transformPolygon(input) {
            var polygon = new input.constructor();
            var i = 0;
            for (i; i < input.length; i+=2) {
                var x = input[i];
                var y = input[i+1];
                var shim = new Vector(x,y);
                var tvec = this.transformVector(shim);
                polygon[i] = tvec.x();
                polygon[i+1] = tvec.y();
            }
            polygon.length = i;
            return polygon;
        };
        
        return Transform2d;
    }
});