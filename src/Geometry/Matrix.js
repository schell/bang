/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Matrix.js
*
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
            } else {
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
        * Returns a copy of this matrix.
        * @return {Matrix}
        * @nosideeffects
        * * **/
        Matrix.prototype.copy = function Matrix_copy() {
            var copy = Vector.prototype.copy.call(this);
            copy.numRows = this.numRows;
            copy.numColumns = this.numColumns;
            return copy;
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
            var m = new this.constructor().loadIdentity();
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
            
            var elements = new this.constructor();
            elements.length = 0;
                
            var resultRows = this.numRows;
            var resultCols = matrix.numColumns;
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
        
        return Matrix;
    }
});