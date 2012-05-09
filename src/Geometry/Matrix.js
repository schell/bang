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
    init : function initMatrix (m) {
        /** * *
        * Initializes the Matrix 
        * @param - m Object - The mod modules object.
        * * **/
        
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
        
        Matrix.prototype.toString = function Matrix_toString() {
            return 'Matrix['+Array.prototype.toString.call(this)+']';
        };
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        Matrix.prototype.toPrettyString = function Matrix_toPrettyString() {
            /** * *
            * Returns a pretty string value.
            * @return string
            * @nosideeffects
            * * **/
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
        Matrix.prototype.a = function Matrix_a() {
            /** * *
            * Returns the 'a' matrix component.
            * @return number
            * * **/
            return this[0];
        };
        Matrix.prototype.b = function Matrix_b() {
            /** * *
            * Returns the 'b' matrix component.
            * @return number
            * * **/
            return this[3];
        };
        Matrix.prototype.c = function Matrix_c() {
            /** * *
            * Returns the 'c' matrix component.
            * @return number
            * * **/
            return this[6];
        };
        Matrix.prototype.d = function Matrix_d() {
            /** * *
            * Returns the 'd' matrix component.
            * @return number
            * * **/
            return this[1];
        };
        Matrix.prototype.e = function Matrix_e() {
            /** * *
            * Returns the 'e' matrix component.
            * @return number
            * * **/
            return this[4];
        };
        Matrix.prototype.f = function Matrix_f() {
            /** * *
            * Returns the 'f' matrix component.
            * @return number
            * * **/
            return this[7];
        };
        Matrix.prototype.g = function Matrix_g() {
            /** * *
            * Returns the 'g' matrix component.
            * @return number
            * * **/
            return this[2];
        };
        Matrix.prototype.h = function Matrix_h() {
            /** * *
            * Returns the 'h' matrix component.
            * @return number
            * * **/
            return this[5];
        };
        Matrix.prototype.i = function Matrix_i() {
            /** * *
            * Returns the 'i' matrix component.
            * @return number
            * * **/
            return this[8];
        };
        Matrix.prototype.x = function Matrix_x(x) {
            /** * *
            * Returns the x element. 
            * If *x* is supplied as a parameter, will set the x element before returning.
            * @param number
            * @returns number
            * * **/
            if (arguments.length) {
                this[2] = x;
            }
            return this[2];
        };
        Matrix.prototype.y = function Vector_y(y) {
            /** * *
            * Returns the y element.
            * If *y* is supplied as a parameter, will set the y element before returning.
            * @param number
            * @returns number
            * * **/
            if (arguments.length) {
                this[5] = y;
            }
            return this[5];
        };
        
        Matrix.prototype.determinant = function Matrix_determinate() {
            /** * *
            * Returns the determinate of this matrix.
            * @return number
            * @nosideeffects
            * * **/
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
        
        Matrix.prototype.inverse = function Matrix_inverse() {
            /** * *
            * Returns the inverse of this matrix or false if no inverse exists.
            * @return Matrix
            * @nosideeffects
            * * **/
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
        
        Matrix.prototype.row = function Matrix_row(n) {
            /** * *
            * Returns row n of this matrix.
            * @return Vector
            * @nosideeffects
            * * **/
            var elementsInRow = 3;
            var start = n*elementsInRow;
            var row = [];
            for (var i=0; i < elementsInRow; i++) {
                row.push(this[start+i]);
            }
            return row;
        };
        
        Matrix.prototype.column = function Matrix_column(n) {
            /** * *
            * Returns column n of this matrix.
            * @return Array
            * @nosideeffects
            * * **/
            var elementsInColumn = 3;
            var start = n;
            var column = [];
            for (var i=0; i < elementsInColumn; i++) {
                column.push(this[start+3*i]);
            }
            return column;
        };
        
        Matrix.prototype.identity = function Matrix_identity() {
            /** * *
            * Returns the identity matrix.
            * @return Matrix
            * @nosideeffects
            * * **/
            return new Matrix(
                1.0, 0.0, 0.0, 
                0.0, 1.0, 0.0, 
                0.0, 0.0, 1.0 
            );
        };
        
        Matrix.prototype.loadIdentity = function Matrix_loadIdentity() {
            /** * *
            * Loads the elements of the identity matrix.
            * * **/
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
        
        Matrix.prototype.multiply = function Matrix_multiply(matrix) {
            /** * *
            * Multiplies this matrix by matrix.
            * @param Array
            * @return Matrix
            * @nosideeffects
            * * **/
            function addRowAndColumn(row, column) {
                /** * *
                * Adds a matrix element *row* and *column*.
                * @param Array
                * @param Array
                * @return number
                * @nosideeffects
                * * **/
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
        
        Matrix.prototype.translate = function Matrix_translate(x, y) {
            /** * *
            * Translate this matrix by x, y.
            * @param number
            * @param number
            * @return Matrix
            * @nosideeffects
            * * **/
            x = x || 0;
            y = y || 0;
            var translate = new Matrix(
                1, 0, x,
                0, 1, y,
                0, 0, 1
            );
            return this.multiply(translate);
        };
        
        Matrix.prototype.scale = function Matrix_scale(x, y) {
            /** * *
            * Return this matrix scaled by x, y.
            * @param number
            * @param number
            * @return Matrix
            * * **/
            x = x || 1;
            y = y || 1;
            var scale = new Matrix(
                x, 0, 0,
                0, y, 0,
                0, 0, 1
            );
            return this.multiply(scale);
        };
        
        Matrix.prototype.rotate = function Matrix_rotate(radians) {
            /** * *
            * Rotates this matrix about z.
            * @param {number}
            * @return {Matrix}
            * * **/    
            var rotation = new Matrix(
                Math.cos(radians), -Math.sin(radians), 0,
                Math.sin(radians), Math.cos(radians), 0,
                0, 0, 1
            );
            return this.multiply(rotation);
        };
        
        Matrix.prototype.transform2DVector = function Matrix_transform2DVector(vec) {
            /** * *
            * Transforms a 2D vector by this matrix
            * @param Vector
            * @return Vector
            * @nosideeffects
            * * **/
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
        
        Matrix.prototype.transformPolygon = function Matrix_transformPolygon(input) {
            /** * *
            * Transforms polygon input using this matrix.
            * @param Polygon
            * @return Polygon
            * @nosideeffects
            * * **/
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