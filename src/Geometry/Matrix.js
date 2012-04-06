/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Matrix.js
* The Matrix Addin
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
* @author   Schell Scivally
* @since    Wed Jan 25 09:59:05 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Matrix',
    dependencies : [ 'bang::Global.js', 'bang::Geometry/Vector.js' ],
    init : function initMatrix (m) {
        /**
         * Initializes the Matrix Addin
         * @param - m Object - The mod modules object.
         */
        var addin = function addinMatrix (self) {
            /**
             * Adds Matrix properties to *self*.
             * @param - self Object - The object to add Matrix properties to.
             * @return self Matrix Object 
             */
            var defined = m.defined(self);
            self = m.Object(self); 
            
            m.safeAddin(self, 'tag', 'Matrix');
            
            // Addin Vector
            m.Vector(self);
            
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            m.safeOverride(self, 'copy', 'vector_copy', function Matrix_copy() {
                /** * *
                * Returns a copy of this matrix.
                * @return - Matrix
                * * **/
                var vector = self.vector_copy();
                addin(vector);
                return vector;
            });
            m.safeAddin(self, 'toPrettyString', function Matrix_toPrettyString() {
                /** * *
                * Returns a pretty string value.
                * @returns - String
                * * **/
                function fixed(el) {
                    var s = el.toFixed(3);
                    if (el >= 0) {
                        s = ' '+s;
                    }
                    return s;
                }
                var s = '\n' + fixed(self.elements[0]) + ' ' + fixed(self.elements[1]) + ' ' + fixed(self.elements[2]) + '\n';
                s += fixed(self.elements[3]) + ' ' + fixed(self.elements[4]) + ' ' + fixed(self.elements[5]) + '\n';
                s += fixed(self.elements[6]) + ' ' + fixed(self.elements[7]) + ' ' + fixed(self.elements[8]);
                return s;
            });
            m.safeAddin(self, 'a', function Matrix_a() {
                /** * *
                * Returns the 'a' matrix component.
                * @returns - Number
                * * **/
                return self.elements[0];
            });
            m.safeAddin(self, 'b', function Matrix_b() {
                /** * *
                * Returns the 'b' matrix component.
                * @returns - Number
                * * **/
                return self.elements[3];
            });
            m.safeAddin(self, 'c', function Matrix_c() {
                /** * *
                * Returns the 'c' matrix component.
                * @returns - Number
                * * **/
                return self.elements[6];
            });
            m.safeAddin(self, 'd', function Matrix_d() {
                /** * *
                * Returns the 'd' matrix component.
                * @returns - Number
                * * **/
                return self.elements[1];
            });
            m.safeAddin(self, 'e', function Matrix_e() {
                /** * *
                * Returns the 'e' matrix component.
                * @returns - Number
                * * **/
                return self.elements[4];
            });
            m.safeAddin(self, 'f', function Matrix_f() {
                /** * *
                * Returns the 'f' matrix component.
                * @returns - Number
                * * **/
                return self.elements[7];
            });
            m.safeAddin(self, 'g', function Matrix_g() {
                /** * *
                * Returns the 'g' matrix component.
                * @returns - Number
                * * **/
                return self.elements[2];
            });
            m.safeAddin(self, 'h', function Matrix_h() {
                /** * *
                * Returns the 'h' matrix component.
                * @returns - Number
                * * **/
                return self.elements[5];
            });
            m.safeAddin(self, 'i', function Matrix_i() {
                /** * *
                * Returns the 'i' matrix component.
                * @returns - Number
                * * **/
                return self.elements[8];
            });
            m.safeOverride(self, 'x', 'vector_x', function Vector_x(x) {
                /** * *
                * Returns the x element. 
                * If *x* is supplied as a parameter, will set the x element before returning.
                * @param - x Number
                * @returns - x Number
                * * **/
                if (arguments.length) {
                    self.elements[2] = x;
                }
                return self.elements[2];
            });
            m.safeOverride(self, 'y', 'vector_y', function Vector_y(y) {
                /** * *
                * Returns the y element.
                * If *y* is supplied as a parameter, will set the y element before returning.
                * @param - y Number
                * @returns - y Number
                * * **/
                if (arguments.length) {
                    self.elements[5] = y;
                }
                return self.elements[5];
            });
            m.safeAddin(self, 'loadIdentity', function Matrix_loadIdentity() {
                /** * *
                * Loads the identity projection/transformation matrix.
                * * **/
                self.elements = addin.identityElements();
                return self;
            });
            m.safeAddin(self, 'determinant', function Matrix_determinate() {
                /** * *
                * Returns the determinate of this matrix.
                * @return - Number
                * * **/
                var a = self.a();
                var b = self.b();
                var c = self.c();
                var d = self.d();
                var e = self.e();
                var f = self.f();
                var g = self.g();
                var h = self.h();
                var i = self.i();
                return a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
            });
            m.safeAddin(self, 'inverse', function Matrix_inverse() {
                /** * *
                * Returns the inverse of this matrix or false if no inverse exists.
                * @return - Matrix
                * * **/
                var detM = self.determinant();
                if (detM === 0) {
                    // This matrix is singular and has no inverse...
                    return false;
                }
                var oneOverDet = 1 / detM;

                var a = self.a();
                var b = self.b();
                var c = self.c();
                var d = self.d();
                var e = self.e();
                var f = self.f();
                var g = self.g();
                var h = self.h();
                var i = self.i();
                
                return m.Matrix({
                    elements : [
                        e*i - f*h, f*g - d*i, d*h - e*g,
                        c*h - b*i, a*i - c*g, b*g - a*h,
                        b*f - c*e, c*d - a*f, a*e - b*d
                    ].map(function(el,ndx,a) {
                        return el*oneOverDet;
                    })
                });
            });
            m.safeAddin(self, 'column', function Matrix_column(n) {
                /** * *
                * Returns column *n* in this matrix.
                * @return - Array
                * * **/
                return addin.getColumn(self.elements, n);
            });
            m.safeAddin(self, 'row', function Matrix_row(n) {
                /** * *
                * Returns row *n* in this matrix.
                * @return - Array
                * * **/
                return addin.getRow(self.elements, n);
            });
            m.safeOverride(self, 'multiply', 'vector_multiply', function Matrix_multiply(matrix) {
                /** * *
                * Multiplies this matrix by another.
                * @param - matrix Matrix
                * * **/
                self.elements = addin.multiplyElements(self.elements, matrix.elements);
                
                return self;
            });
            m.safeAddin(self, 'translate', function Matrix_translate(x, y) {
                /** * *
                * Translate this matrix by x, y.
                * @param - x Number
                * @param - y Number
                * @return - self Matrix
                * * **/
               self.elements = addin.translateElements(self.elements, x, y);
                return self;
            });
            m.safeAddin(self, 'scale', function Matrix_scale(x, y) {
                /** * *
                * Scale this matrix by x, y.
                * @param - x Number
                * @param - y Number
                * @return - self Matrix
                * * **/
                self.elements = addin.scaleElements(self.elements, x, y);
                return self;
            });
            m.safeAddin(self, 'rotate', function Matrix_rotate(angleDegrees) {
                /** * *
                * Rotates this matrix *angleDegrees* about z.
                * @param - angleDegrees Number
                * @return - self Matrix
                * * **/
                self.elements = addin.rotateElements(self.elements, angleDegrees);
                return self;
            });
            m.safeAddin(self, 'transform2DVector', function Matrix_transform2DVector(vec) {
                /** * *
                * Transforms a 2D vector by this matrix
                * * **/
                // Make the 2-vector homogenous...
                vec.elements[2] = 1; 
                var mat = self.copy();
                mat.multiply(vec);
                mat.elements.length = 2;
                vec.elements = mat.elements;
                return vec;
            });
            m.safeAddin(self, 'transformPolygon', function Matrix_transformPolygon(poly) {
                /** * *
                * Transforms *poly*.
                * @param - poly Polygon
                * @return - poly Polygon
                * * **/
                var elements = [];
                for (var i=0; i < poly.elements.length; i+=2) {
                    var x = poly.elements[i];
                    var y = poly.elements[i+1];
                    var shim = {elements:[x,y]};
                    var tvec = self.transform2DVector(shim);
                    elements = elements.concat(tvec.elements);
                }
                poly.elements = elements;
                return poly;
            });
            
            
            if (!defined) {
                self.loadIdentity();
            }
            return self;
        };
        
        addin.getRow = function Matrix_row(a, n) {
            /** * *
            * Returns row *n* matrix elements *a*.
            * @param - Array
            * @return - Array
            * * **/
            var elementsInRow = 3;
            var start = n*elementsInRow;
            var row = [];
            for (var i=0; i < elementsInRow; i++) {
                row.push(a[start+i]);
            }
            return row;
        };
        
        addin.getColumn = function Matrix_column(a, n) {
            /** * *
            * Returns column *n* of matrix *a*.
            * @return - Array
            * * **/
            var elementsInColumn = 3;
            var start = n;
            var column = [];
            for (var i=0; i < elementsInColumn; i++) {
                column.push(a[start+3*i]);
            }
            return column;
        };
        
        addin.addRowAndColumn = function Matrix_addRowAndColumn(row, column) {
            /** * *
            * Adds a matrix element *row* and *column*.
            * @param row Array
            * @param column Array
            * @return Array
            * * **/
            var combo = 0;
            for (var i=0; i < row.length && i < column.length; i++) {
                combo += row[i]*column[i];
            }
            return combo;
        };
        
        addin.identityElements = function identityMatrixElements() {
            return [
                1.0, 0.0, 0.0, 
                0.0, 1.0, 0.0, 
                0.0, 0.0, 1.0 
            ];
        }
        
        addin.multiplyElements = function multiplyMatrixElements(a, b) {
            /** * *
            * Multiplies matrix elements *a* by *b*.
            * @param a Array
            * @param b Array
            * @return Array
            * * **/
            var elements = [];
                
            var resultRows = a.length/3;
            var resultCols = b.length/3;
            for (var i=0; i < resultRows; i++) {
                for (var j=0; j < resultCols; j++) {
                    var row = addin.getRow(a, i);
                    var column;
                    if (resultCols === 1) {
                        // This is a vector we are multiplying...
                        column = b;
                    } else {
                        column = addin.getColumn(b, j); // bj - haha
                    }
                    elements.push(addin.addRowAndColumn(row, column));
                }
            }
            return elements;
        };
        
        addin.translateElements = function translateMatrixElements(elements, x, y) {
            /** * *
            * Translate this matrix by x, y.
            * @param - x Number
            * @param - y Number
            * @return - self Matrix
            * * **/
            x = m.ifndefInitNum(x, 0);
            y = m.ifndefInitNum(y, 0);
            var transElements = [
                1, 0, x,
                0, 1, y,
                0, 0, 1
            ];
            return addin.multiplyElements(elements, transElements);
        };
        
        addin.scaleElements = function scaleMatrixElements(elements, x, y) {
            /** * *
            * Scale this matrix by x, y.
            * @param - x Number
            * @param - y Number
            * @return - self Matrix
            * * **/
            x = x || 1;
            y = y || 1;
            var scaleElements = [
                x, 0, 0,
                0, y, 0,
                0, 0, 1
            ];
            return addin.multiplyElements(elements, scaleElements);
        };
        addin.rotateElements = function rotateMatrixElements(elements, angleDegrees) {
            /** * *
            * Rotates this matrix *angleDegrees* about z.
            * @param - angleDegrees Number
            * @return - self Matrix
            * * **/
            // Invert theta (matrix rotation is counter-clockwise)...
            angleDegrees = angleDegrees || 0;
            // Convert to radians
            var radians = angleDegrees*m.Geometry.ONE_DEGREE;    
                
            var rotationElements = [
                Math.cos(radians), -Math.sin(radians), 0,
                Math.sin(radians), Math.cos(radians), 0,
                0, 0, 1
            ];
            return addin.multiplyElements(elements, rotationElements);
        };
        
        return addin;
    }
});

