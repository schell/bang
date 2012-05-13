/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Matrix.js
* A 2D matrix for transformations.
* /---------------------------------------\
* | indices     | elements   | meaning    |
* |---------------------------------------| 
* | 0  1  2     | a  d  g    | s/r  r   x |
* | 3  4  5     | b  e  h    |  r  s/r  y |
* | 6  7  8     | c  f  i    |  0   0   s |
* |             |            |            |
* \---------------------------------------/ 
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Thu Apr 26 08:55:18 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Matrix',
    dependencies : [ 'bang::Geometry/Vector.js', 'bang::Geometry/Polygon.js' ],
    /** * *
    * Initializes the Matrix 
    * @param {Object} The mod modules object.
    * * **/
    init : function initMatrix (m) {
        
        function Matrix() {
            if (arguments.length) {
                this.length = 0;
                for (var i=0; i < arguments.length; i++) {
                    this.push(arguments[i]);
                }
            } else {
                this.loadIdentity();
            }
            this.length = 9;
        }
        
        Matrix.prototype = new m.Vector();
        
        Matrix.prototype.constructor = Matrix;
        
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns the string representation of this Matrix.
        * @return {string}
        * * **/
        Matrix.prototype.toString = function Matrix_toString() {
            return 'Matrix['+Array.prototype.toString.call(this)+']';
        };
        /** * *
        * Returns a pretty string value.
        * @return string
        * @nosideeffects
        * * **/
        Matrix.prototype.toPrettyString = function Matrix_toPrettyString() {
            function fixed(el) {
                var s = el.toFixed(3);
                if (el >= 0) {
                    s = ' '+s;
                }
                return s;
            }
            var s = '\n' + fixed(this[0]) + ' ' + fixed(this[1]) + ' ' + fixed(this[2]) + '\n';
                s += fixed(this[3]) + ' ' + fixed(this[4]) + ' ' + fixed(this[5]) + '\n';
                s += fixed(this[6]) + ' ' + fixed(this[7]) + ' ' + fixed(this[8]);
            return s;
        };
        /** * *
        * Returns the 'a' matrix component.
        * @return number
        * * **/
        Matrix.prototype.a = function Matrix_a() {
            return this[0];
        };
        /** * *
        * Returns the 'b' matrix component.
        * @return number
        * * **/
        Matrix.prototype.b = function Matrix_b() {
            return this[3];
        };
        /** * *
        * Returns the 'c' matrix component.
        * @return number
        * * **/
        Matrix.prototype.c = function Matrix_c() {
            return this[6];
        };
        /** * *
        * Returns the 'd' matrix component.
        * @return number
        * * **/
        Matrix.prototype.d = function Matrix_d() {
            return this[1];
        };
        /** * *
        * Returns the 'e' matrix component.
        * @return number
        * * **/
        Matrix.prototype.e = function Matrix_e() {
            return this[4];
        };
        /** * *
        * Returns the 'f' matrix component.
        * @return number
        * * **/
        Matrix.prototype.f = function Matrix_f() {
            return this[7];
        };
        /** * *
        * Returns the 'g' matrix component.
        * @return number
        * * **/
        Matrix.prototype.g = function Matrix_g() {
            return this[2];
        };
        /** * *
        * Returns the 'h' matrix component.
        * @return number
        * * **/
        Matrix.prototype.h = function Matrix_h() {
            return this[5];
        };
        /** * *
        * Returns the 'i' matrix component.
        * @return number
        * * **/
        Matrix.prototype.i = function Matrix_i() {
            return this[8];
        };
        /** * *
        * Returns an array consisting of the a, b, d, e, g, and h elements.
        * Used for easily setting the transform of a CanvasRenderingContext2D.
        * @return {Array.<number>}
        * * **/
        Matrix.prototype.abdegh = function Matrix_abdegh() {
            return [this.a(),this.b(),this.d(),this.e(),this.g(),this.h()];
        };
        /** * *
        * Returns the x element. 
        * If *x* is supplied as a parameter, will set the x element before returning.
        * @param number
        * @returns number
        * * **/
        Matrix.prototype.x = function Matrix_x(x) {
            if (arguments.length) {
                this[2] = x;
            }
            return this[2];
        };
        /** * *
        * Returns the y element.
        * If *y* is supplied as a parameter, will set the y element before returning.
        * @param number
        * @returns number
        * * **/
        Matrix.prototype.y = function Vector_y(y) {
            if (arguments.length) {
                this[5] = y;
            }
            return this[5];
        };
        /** * *
        * Returns the determinate of this matrix.
        * @return number
        * @nosideeffects
        * * **/
        Matrix.prototype.determinant = function Matrix_determinate() {
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
        * @return Matrix
        * @nosideeffects
        * * **/
        Matrix.prototype.inverse = function Matrix_inverse() {
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
                
            return new m.Matrix(
                e*i - f*h, f*g - d*i, d*h - e*g,
                c*h - b*i, a*i - c*g, b*g - a*h,
                b*f - c*e, c*d - a*f, a*e - b*d
            ).map(function(el,ndx,a) {
                return el*oneOverDet;
            });
        };
        /** * *
        * Returns row n of this matrix.
        * @return Vector
        * @nosideeffects
        * * **/
        Matrix.prototype.row = function Matrix_row(n) {
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
        * @return Array
        * @nosideeffects
        * * **/
        Matrix.prototype.column = function Matrix_column(n) {
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
        * @return Matrix
        * @nosideeffects
        * * **/
        Matrix.prototype.identity = function Matrix_identity() {
            return new Matrix(
                1.0, 0.0, 0.0, 
                0.0, 1.0, 0.0, 
                0.0, 0.0, 1.0 
            );
        };
        /** * *
        * Loads the elements of the identity matrix.
        * * **/
        Matrix.prototype.loadIdentity = function Matrix_loadIdentity() {
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
        * @param Array
        * @return Matrix
        * @nosideeffects
        * * **/
        Matrix.prototype.multiply = function Matrix_multiply(matrix) {            
            /** * *
            * Adds a matrix element *row* and *column*.
            * @param Array
            * @param Array
            * @return number
            * @nosideeffects
            * * **/
            function addRowAndColumn(row, column) {
                var combo = 0;
                for (var i=0; i < row.length && i < column.length; i++) {
                    combo += row[i]*column[i];
                }
                return combo;
            }
            
            var elements = new Matrix();
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
        * @param number
        * @param number
        * @return Matrix
        * @nosideeffects
        * * **/
        Matrix.prototype.translate = function Matrix_translate(x, y) {
            x = x || 0;
            y = y || 0;
            var translate = new Matrix(
                1, 0, x,
                0, 1, y,
                0, 0, 1
            );
            return this.multiply(translate);
        };
        /** * *
        * Return this matrix scaled by x, y.
        * @param number
        * @param number
        * @return Matrix
        * * **/
        Matrix.prototype.scale = function Matrix_scale(x, y) {
            x = x || 1;
            y = y || 1;
            var scale = new Matrix(
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
        Matrix.prototype.rotate = function Matrix_rotate(radians) {
            var rotation = new Matrix(
                Math.cos(radians), -Math.sin(radians), 0,
                Math.sin(radians), Math.cos(radians), 0,
                0, 0, 1
            );
            return this.multiply(rotation);
        };
        /** * *
        * Transforms a 2D vector by this matrix
        * @param Vector
        * @return Vector
        * @nosideeffects
        * * **/
        Matrix.prototype.transform2DVector = function Matrix_transform2DVector(vec) {
            // Make the 2-vector homogenous...
            vec = vec.copy();
            vec[2] = 1; 
            vec.length = 3;
            return this.multiply(vec).foldl(function (acc, el) {
                if (acc.length < 2) {
                    acc.push(el);
                }
                return acc;
            }, new m.Vector());
        };
        /** * *
        * Transforms polygon input using this matrix.
        * @param Polygon
        * @return Polygon
        * @nosideeffects
        * * **/
        Matrix.prototype.transformPolygon = function Matrix_transformPolygon(input) {
            var polygon = new input.constructor();
            var i = 0;
            for (i; i < input.length; i+=2) {
                var x = input[i];
                var y = input[i+1];
                var shim = new m.Vector(x,y);
                var tvec = this.transform2DVector(shim);
                polygon[i] = tvec.x();
                polygon[i+1] = tvec.y();
            }
            polygon.length = i;
            return polygon;
        };
        
        return Matrix;
    }
});