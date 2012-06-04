/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Matrix.js
* A 3x3 matrix for transformations.
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
    dependencies : [ 'bang::Geometry/Vector.js' ],
    /** * *
    * Initializes the Matrix 
    * @param {function} Vector The Vector constructor function.
    * * **/
    init : function initMatrix (Vector) {
        /** * *
        * Creates a new Matrix object. You can optionally provide the number 
        * of rows and columns as an array, and the elements as numbers.
        * @type {Array=} rowsAndColumns The number of rows and columns. (optional)
        * @type {...number=} elements The matrix elements. (optional)
        * * **/
        function Matrix() {
            var args = Array.prototype.slice.call(arguments);
            var numberOfRowsAndColumns = [0,0];
            if (typeof args[0] === 'object') {
                numberOfRowsAndColumns = args.shift();
            } else if (args.length) {
                var sqrtLen = Math.sqrt(args.length);
                numberOfRowsAndColumns = [sqrtLen, sqrtLen];
            }
            /** * *
            * The number of columns.
            * @type {number}
            * * **/
            this.numColumns = numberOfRowsAndColumns[0];
            /** * *
            * The number of rows.
            * @type {number}
            * * **/
            this.numRows = numberOfRowsAndColumns[1];

            this.length = this.numRows*this.numColumns;
            
            if (args.length) {
                this.length = 0;
                for (var i=0; i < args.length; i++) {
                    this.push(args[i]);
                }
            } else if (this.length === 0) {
                this.length = 9;
                this.numColumns = 3;
                this.numRows = 3;
                this.loadIdentity();
            }
        }
        
        Matrix.prototype = new Vector();
        
        Matrix.prototype.constructor = Matrix;
        //--------------------------------------
        //  CLASS METHODS
        //--------------------------------------
        /** * *
        * Returns the determinant of a given 2x2 matrix.
        * @param {Vector}
        * @return {number}
        * @nosideeffects
        * * **/
        Matrix.det2x2 = function Matrix_det2x2(matrix) {
            if (matrix.length !== 4) {
                throw new Error('Matrix must be 2x2.');
            }
            var a = matrix[0];
            var b = matrix[1];
            var c = matrix[2];
            var d = matrix[3];
            return a*d - b*c;
        };
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
        * Returns row n of this matrix.
        * @return Vector
        * @nosideeffects
        * * **/
        Matrix.prototype.row = function Matrix_row(n) {
            var elementsInRow = this.numColumns;
            var start = n*elementsInRow;
            var row = new Vector();
            for (var i=0; i < elementsInRow; i++) {
                row.push(this[start+i]);
            }
            return row;
        };
        /** * *
        * Returns column n of this matrix.
        * @return {Vector}
        * @nosideeffects
        * * **/
        Matrix.prototype.column = function Matrix_column(n) {
            var elementsInColumn = this.numRows;
            var start = n;
            var column = new Vector();
            for (var i=0; i < elementsInColumn; i++) {
                column.push(this[start+this.numRows*i]);
            }
            return column;
        };
        /** * *
        * Returns the identity matrix.
        * @return Matrix
        * @nosideeffects
        * * **/
        Matrix.prototype.identity = function Matrix_identity() {
            var m = new Matrix().loadIdentity();
            return m;
        };
        /** * *
        * Loads the elements of the identity matrix. Returns itself.
        * @return {Matrix}
        * * **/
        Matrix.prototype.loadIdentity = function Matrix_loadIdentity() {
            if (this.numColumns !== this.numRows) {
                // This is not a square matrix and does not have an identity...
                throw new Error('Matrix must be square (nxn) to have an identity.');
            }
            this.length = this.numColumns*this.numRows;
            
            for (var i=0; i < this.length; i++) {
                this[i] = (i%(this.numRows+1)) === 0 ? 1 : 0;
            }
            
            return this;
        };
        /** * *
        * Returns a new matrix with row x and column y deleted.
        * Calling this on a 4x4 matrix will return a 3x3 matrix.
        * @param {number} c The column to delete
        * @param {number} r The row to delete
        * @return {Matrix}
        * @nosideeffects
        * * **/
        Matrix.prototype.deleteRowAndColumnAt = function Matrix_deleteRowAndColumnAt(c, r) {
            var alias = this;
            /** * *
            * Returns whether the given index is in a given row.
            * @param {number} ndx The index.
            * @param {number} row The row.
            * @return {boolean}
            * @nosideeffects
            * * **/
            function isIndexInRow(ndx, row) {
                var startNdx = alias.numColumns*row;
                var endNdx = startNdx + alias.numColumns;
                return startNdx <= ndx && ndx < endNdx;
            }
            /** * *
            * Returns whether the given index is in a given column.
            * @param {number} ndx The index.
            * @param {number} col The column.
            * @return {boolean}
            * @nosideeffects
            * * **/
            function isIndexInColumn(ndx, col) {
                return (ndx - col)%alias.numColumns === 0;
            }
            var matrix = new Matrix([this.numRows-1, this.numColumns-1]);
            for (var ndx=0,i=0; ndx < this.length; ndx++) {
                if (isIndexInRow(ndx, r) || isIndexInColumn(ndx, c)) {
                    continue;
                }
                matrix[i++] = this[ndx];
            }
            return matrix;
        };
        /** * *
        * Returns the minor for an element at row x and column y.
        * @param {number} x The row.
        * @param {number} y The column.
        * @return {number} The minor for the element.
        * * **/
        Matrix.prototype.minorAt = function Matrix_minorAt(x, y) {
            var ndx = y*this.numColumns + x;
            if (this[ndx] === 0) {
                return 0;
            }
            
            var minorMatrix = this.deleteRowAndColumnAt(x, y);
            return minorMatrix.determinant();
        };
        /** * *
        * Returns the cofactor for an element at row x and column y.
        * @param {number} x The row.
        * @param {number} y The column.
        * @return {number} The cofactor for the element.
        * * **/
        Matrix.prototype.cofactorAt = function Matrix_cofactorAt(x, y) {
            var ndx = y*this.numColumns + x;
            var sign = ((ndx%2) ? -1 : 1);
            if (this.numColumns%2 === 0) {
                sign *= (y%2 ? -1 : 1);
            }
            return this.minorAt(x, y)*sign;
        };
        /** * *
        * Returns the determinant of the matrix.
        * @return {number}
        * @nosideeffects
        * * **/
        Matrix.prototype.determinant = function Matrix_determinate() {
            if (this.length === 1) {
                return this[0];
            }
            if (this.numColumns === 2 && this.numRows === 2) {
                return Matrix.det2x2(this);
            }
            
            var alias = this;
            var ndx = 0;
            return this.row(0).foldl(function(acc,el) {
                // Accumulate the product of the element and its cofactor...
                return acc + (el*alias.cofactorAt(ndx++, 0));
            }, 0);
        };
        /** * *
        * Returns the transpose of the matrix.
        * @return {Matrix}
        * * **/
        Matrix.prototype.transpose = function Matrix_transpose() {
            var transpose = this.copy();
            for (var i=0; i < this.numColumns; i++) {
                for (var j=0; j < this.numRows; j++) {
                    var thisNdx = i*this.numColumns + j;
                    var transNdx = j*this.numColumns + i;
                    transpose[transNdx] = this[thisNdx];
                }
            }
            return transpose;
        };
        /** * *
        * Returns the matrix of cofactors.
        * @return {Matrix}
        * * **/
        Matrix.prototype.cofactors = function Matrix_cofactors() {
            var cofactors = this.copy();
            for (var i=0; i < this.numColumns; i++) {
                for (var j=0; j < this.numRows; j++) {
                    var ndx = j*this.numColumns + i;
                    cofactors[ndx] = this.cofactorAt(i, j);
                }
            }
            return cofactors;
        };
        /** * *
        * Returns the inverse of this matrix or false if no inverse exists.
        * @return {Matrix}
        * @nosideeffects
        * * **/
        Matrix.prototype.inverse = function Matrix_inverse() {
            var detM = this.determinant();
            if (detM === 0) {
                // This matrix is singular and has no inverse...
                return false;
            }
            var oneOverDet = 1 / detM;
            // Get the matrix of cofactors...
            var cofactors = this.cofactors();
            // Get the adjoint matrix by transposing the matrix of cofactors...
            var adjoint = cofactors.transpose();
            // Divide the adjoint by the determinant...
            for (var i=0; i < adjoint.length; i++) {
                adjoint[i] *= oneOverDet;
            }
            return adjoint;
        };
        /** * *
        * Multiplies this matrix by matrix.
        * @param Array
        * @return Matrix
        * @nosideeffects
        * * **/
        Matrix.prototype.multiply = function Matrix_multiply(matrix) {   
            if (this.numColumns !== matrix.numRows) {
                throw new Error('The number of columns in first matrix must equal the number of rows in the second.');
            }         
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
                
            var resultRows = this.numColumns;
            var resultCols = matrix.numRows;
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
            elements.numRows = resultRows;
            elements.numColumns = resultCols;
            elements.length = resultRows*resultCols;
            
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
            }, new Vector());
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
                var shim = new Vector(x,y);
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