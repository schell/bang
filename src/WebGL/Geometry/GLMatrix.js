/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* GLMatrix.js
* A 4x4 matrix for mesh transformations.
* /-----------------------------------------------\
* |    indices    |   elements   |     meaning    |
* |-----------------------------------------------| 
* | 0  1  2  3    | a  e  i  m   | xav xav xav  x |
* | 4  5  6  7    | b  f  j  n   | yav yav yav  y |
* | 8  9  10 11   | c  g  k  o   | zav zav zav  z |
* | 12 13 14 15   | d  h  l  p   |  _   _   _   _ |
* \-----------------------------------------------/ 
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally
* @since    Wed May 30 17:51:42 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'GLMatrix',
    dependencies : [ 'bang::Geometry/Matrix.js' ],
    /** * *
    * Initializes the GLMatrix 
    * @param {function} Matrix The Matrix constructor function.
    * * **/
    init : function initGLMatrix (Matrix) {
        
        function GLMatrix() {
            if (arguments.length) {
                this.length = 0;
                for (var i=0; i < arguments.length; i++) {
                    this.push(arguments[i]);
                }
            } else {
                this.loadIdentity();
            }
            this.length = 16;
        }
        
        GLMatrix.prototype = new Matrix();
        
        GLMatrix.prototype.constructor = GLMatrix;
        
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns the string representation of this GLMatrix.
        * @return {string}
        * * **/
        GLMatrix.prototype.toString = function GLMatrix_toString() {
            return 'GLMatrix['+Array.prototype.toString.call(this)+']';
        };
        /** * *
        * Returns a pretty string value.
        * @return {string}
        * @nosideeffects
        * * **/
        GLMatrix.prototype.toPrettyString = function GLMatrix_toPrettyString() {
            function fixed(el) {
                var s = el.toFixed(3);
                if (el >= 0) {
                    s = ' '+s;
                }
                return s;
            }
            var s = '\n' + fixed(this[0]) + ' ' + fixed(this[1]) + ' ' + fixed(this[2])  + fixed(this[3]) + '\n';
                s += fixed(this[4]) + ' ' + fixed(this[5]) + ' ' + fixed(this[6])  + fixed(this[7]) + '\n';
                s += fixed(this[8]) + ' ' + fixed(this[9]) + ' ' + fixed(this[10])  + fixed(this[11]) + '\n';
                s += fixed(this[12]) + ' ' + fixed(this[13]) + ' ' + fixed(this[14])  + fixed(this[15]) + '\n';
            return s;
        };
        /** * *
        * Returns the 'a' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.a = function GLMatrix_a() {
            return this[0];
        };
        /** * *
        * Returns the 'b' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.b = function GLMatrix_b() {
            return this[4];
        };
        /** * *
        * Returns the 'c' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.c = function GLMatrix_c() {
            return this[8];
        };
        /** * *
        * Returns the 'd' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.d = function GLMatrix_d() {
            return this[12];
        };
        /** * *
        * Returns the 'e' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.e = function GLMatrix_e() {
            return this[1];
        };
        /** * *
        * Returns the 'f' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.f = function GLMatrix_f() {
            return this[5];
        };
        /** * *
        * Returns the 'g' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.g = function GLMatrix_g() {
            return this[9];
        };
        /** * *
        * Returns the 'h' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.h = function GLMatrix_h() {
            return this[13];
        };
        /** * *
        * Returns the 'i' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.i = function GLMatrix_i() {
            return this[2];
        };
        /** * *
        * Returns the 'j' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.j = function GLMatrix_i() {
            return this[6];
        };
        /** * *
        * Returns the 'k' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.k = function GLMatrix_i() {
            return this[10];
        };
        /** * *
        * Returns the 'l' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.l = function GLMatrix_i() {
            return this[14];
        };
        /** * *
        * Returns the 'm' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.m = function GLMatrix_i() {
            return this[3];
        };
        /** * *
        * Returns the 'n' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.n = function GLMatrix_i() {
            return this[7];
        };
        /** * *
        * Returns the 'o' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.o = function GLMatrix_i() {
            return this[11];
        };
        /** * *
        * Returns the 'p' matrix component.
        * @return {number}
        * * **/
        GLMatrix.prototype.p = function GLMatrix_i() {
            return this[15];
        };
        /** * *
        * Returns the x element. 
        * If *x* is supplied as a parameter, will set the x element before returning.
        * @param {number}
        * @return {number}
        * * **/
        GLMatrix.prototype.x = function GLMatrix_x(x) {
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
        GLMatrix.prototype.y = function GLMatrix_y(y) {
            if (arguments.length) {
                this[7] = y;
            }
            return this[7];
        };
        /** * *
        * Returns the z element.
        * If *z* is supplied as a parameter, will set the z element before returning.
        * @param {number}
        * @return {number}
        * * **/
        GLMatrix.prototype.z = function GLMatrix_z(z) {
            if (arguments.length) {
                this[11] = y;
            }
            return this[11];
        };
        /** * *
        * Returns the determinate of this matrix.
        * @return {number}
        * @nosideeffects
        * * **/
        GLMatrix.prototype.determinant = function GLMatrix_determinate() {
            var a = this.a();
            var b = this.b();
            var c = this.c();
            var d = this.d();
            var e = this.e();
            var f = this.f();
            var g = this.g();
            var h = this.h();
            var i = this.i();
            return a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
        };
        /** * *
        * Returns the inverse of this matrix or false if no inverse exists.
        * @return {GLMatrix}
        * @nosideeffects
        * * **/
        GLMatrix.prototype.inverse = function GLMatrix_inverse() {
            var detM = this.determinant();
            if (detM === 0) {
                // This matrix is singular and has no inverse...
                return false;
            }
            var oneOverDet = 1 / detM;

            var a = this.a();
            var b = this.b();
            var c = this.c();
            var d = this.d();
            var e = this.e();
            var f = this.f();
            var g = this.g();
            var h = this.h();
            var i = this.i();
                
            return new GLMatrix(
                e*i - f*h, f*g - d*i, d*h - e*g,
                c*h - b*i, a*i - c*g, b*g - a*h,
                b*f - c*e, c*d - a*f, a*e - b*d
            ).map(function(el,ndx,a) {
                return el*oneOverDet;
            });
        };
        /** * *
        * Returns row n of this matrix.
        * @return {Vector}
        * @nosideeffects
        * * **/
        GLMatrix.prototype.row = function GLMatrix_row(n) {
            var elementsInRow = 3;
            var start = n*elementsInRow;
            var row = [];
            for (var i=0; i < elementsInRow; i++) {
                row.push(this[start+i]);
            }
            return row;
        };
        /** * *
        * Returns column n of this matrix.
        * @return {Array}
        * @nosideeffects
        * * **/
        GLMatrix.prototype.column = function GLMatrix_column(n) {
            var elementsInColumn = 3;
            var start = n;
            var column = [];
            for (var i=0; i < elementsInColumn; i++) {
                column.push(this[start+3*i]);
            }
            return column;
        };
        /** * *
        * Returns the identity matrix.
        * @return {GLMatrix}
        * @nosideeffects
        * * **/
        GLMatrix.prototype.identity = function GLMatrix_identity() {
            return new GLMatrix(
                1.0, 0.0, 0.0, 
                0.0, 1.0, 0.0, 
                0.0, 0.0, 1.0 
            );
        };
        /** * *
        * Loads the elements of the identity matrix.
        * * **/
        GLMatrix.prototype.loadIdentity = function GLMatrix_loadIdentity() {
            this[0] = 1;
            this[1] = 0;
            this[2] = 0;
            this[3] = 0;
            this[4] = 1;
            this[5] = 0;
            this[6] = 0;
            this[7] = 0;
            this[8] = 1;
        };
        /** * *
        * Multiplies this matrix by matrix.
        * @param {Array}
        * @return {GLMatrix}
        * @nosideeffects
        * * **/
        GLMatrix.prototype.multiply = function GLMatrix_multiply(matrix) {            
            /** * *
            * Adds a matrix element *row* and *column*.
            * @param {Array}
            * @param {Array}
            * @return {number}
            * @nosideeffects
            * * **/
            function addRowAndColumn(row, column) {
                var combo = 0;
                for (var i=0; i < row.length && i < column.length; i++) {
                    combo += row[i]*column[i];
                }
                return combo;
            }
            
            var elements = new GLMatrix();
            elements.length = 0;
                
            var resultRows = this.length/3;
            var resultCols = matrix.length/3;
            for (var i=0; i < resultRows; i++) {
                for (var j=0; j < resultCols; j++) {
                    var row = this.row(i);
                    var column;
                    if (resultCols === 1) {
                        // This is a vector we are multiplying...
                        column = matrix;
                    } else {
                        column = matrix.column(j);
                    }
                    elements.push(addRowAndColumn(row, column));
                }
            }
            return elements;
        };
        /** * *
        * Translate this matrix by x, y.
        * @param {number}
        * @param {number}
        * @return {GLMatrix}
        * @nosideeffects
        * * **/
        GLMatrix.prototype.translate = function GLMatrix_translate(x, y) {
            x = x || 0;
            y = y || 0;
            var translate = new GLMatrix(
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
        * @return {GLMatrix}
        * * **/
        GLMatrix.prototype.scale = function GLMatrix_scale(x, y) {
            x = x || 1;
            y = y || 1;
            var scale = new GLMatrix(
                x, 0, 0,
                0, y, 0,
                0, 0, 1
            );
            return this.multiply(scale);
        };
        /** * *
        * Rotates this matrix about z.
        * @param {number}
        * @return {GLMatrix}
        * * **/
        GLMatrix.prototype.rotate = function GLMatrix_rotate(radians) {
            var rotation = new GLMatrix(
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
        GLMatrix.prototype.transform2DVector = function GLMatrix_transform2DVector(vec) {
            // Make the 2-vector homogenous...
            vec = vec.copy();
            vec[2] = 1; 
            vec.length = 3;
            return this.multiply(vec).foldl(function (acc, el) {
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
        GLMatrix.prototype.transformPolygon = function GLMatrix_transformPolygon(input) {
            var polygon = new input.constructor();
            var i = 0;
            for (i; i < input.length; i+=2) {
                var x = input[i];
                var y = input[i+1];
                var shim = new Vector(x,y);
                var tvec = this.transform2DVector(shim);
                polygon[i] = tvec.x();
                polygon[i+1] = tvec.y();
            }
            polygon.length = i;
            return polygon;
        };
        
        return GLMatrix;
    }
});
