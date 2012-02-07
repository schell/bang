/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Matrix.js
* The Matrix Addin
* /---------------------------------------\
* | indices     | elements   | meaning    |
* |---------------------------------------| 
* | 0  1  2     | a  c  0    | s  0  0    |
* | 3  4  5     | b  d  0    | 0  s  0    |
* | 6  7  8     | 0  0  1    | x  y  s    |
* |             |            |            |
* \---------------------------------------/ 
*
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed Jan 25 09:59:05 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Matrix',
    dependencies : [ 'Bang/Geometry.js' ],
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
            
            self.addToString(function () {
                return '[Matrix]';
            });
            
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
                return self.elements[1];
            });
            m.safeAddin(self, 'd', function Matrix_d() {
                /** * *
                * Returns the 'd' matrix component.
                * @returns - Number
                * * **/
                return self.elements[4];
            });
            m.safeAddin(self, 'loadIdentity', function Matrix_loadIdentity() {
                /** * *
                * Loads the identity projection/transformation matrix.
                * * **/
                self.elements = [
                    1.0, 0.0, 0.0, 
                    0.0, 1.0, 0.0, 
                    0.0, 0.0, 1.0 
                ];
                return self;
            });
            m.safeAddin(self, 'column', function Matrix_column(n) {
                /** * *
                * Returns column *n* in this matrix.
                * @return - Array
                * * **/
                var elementsInColumn = 3;
                var start = n;
                var column = [];
                for (var i=0; i < elementsInColumn; i++) {
                    column.push(self.elements[start+3*i]);
                }
                return column;
            });
            m.safeAddin(self, 'row', function Matrix_row(n) {
                /** * *
                * Returns row *n* in this matrix.
                * @return - Array
                * * **/
                var elementsInRow = 3;
                var start = n*elementsInRow;
                var row = [];
                for (var i=0; i < elementsInRow; i++) {
                    row.push(self.elements[start+i]);
                }
                return row;
            });
            m.safeOverride(self, 'multiply', 'vector_multiply', function Matrix_multiply(matrix) {
                /** * *
                * Multiplies this matrix by another.
                * @param - matrix Matrix
                * * **/
                function addRowAndColumn(row, column) {
                    var combo = 0;
                    for (var i=0; i < row.length && i < column.length; i++) {
                        combo += row[i]*column[i];
                    }
                    return combo;
                }
                
                var elements = [];
                
                for (var i=0; i < 3; i++) {
                    for (var j=0; j < 3; j++) {
                        var row = self.row(i);
                        var column = matrix.column(j);
                        elements.push(addRowAndColumn(row, column));
                    }
                }
                
                self.elements = elements;
                
                return self;
            });
            m.safeAddin(self, 'scale', function Matrix_scale(sx, sy, sz) {
                /** * *
                * Scales this matrix by *sx* in x, *sy* in y and *sz* in z.
                * @param - sx Number
                * @param - sy Number
                * @param - sz Number
                * * **/
                sx = m.ifndefInitNum(sx, 1.0);
                sy = m.ifndefInitNum(sy, 1.0);
                sz = m.ifndefInitNum(sz, 1.0);
                
                self.elements[0*4+0] *= sx;
                self.elements[0*4+1] *= sx;
                self.elements[0*4+2] *= sx;
                self.elements[0*4+3] *= sx;
                
                self.elements[1*4+0] *= sy;
                self.elements[1*4+1] *= sy;
                self.elements[1*4+2] *= sy;
                self.elements[1*4+3] *= sy;
                
                self.elements[2*4+0] *= sz;
                self.elements[2*4+1] *= sz;
                self.elements[2*4+2] *= sz;
                self.elements[2*4+3] *= sz;
                return self;
            });
            
            m.safeAddin(self, 'translate', function Matrix_translate(x, y, z) {
                /** * *
                * Translates this matrix along vector (x,y,z).
                * @param - x Number
                * @param - y Number
                * @param - z Number
                * * **/
                x = m.ifndefInitNum(x, 0);
                y = m.ifndefInitNum(y, 0);
                z = m.ifndefInitNum(z, 0);
            
                self.elements[3*4+0] += (self.elements[0*4+0] * x + self.elements[1*4+0] * y + self.elements[2*4+0] * z);
                self.elements[3*4+1] += (self.elements[0*4+1] * x + self.elements[1*4+1] * y + self.elements[2*4+1] * z);
                self.elements[3*4+2] += (self.elements[0*4+2] * x + self.elements[1*4+2] * y + self.elements[2*4+2] * z);
                self.elements[3*4+3] += (self.elements[0*4+3] * x + self.elements[1*4+3] * y + self.elements[2*4+3] * z);
                return self;
            });

            m.safeAddin(self, 'rotate', function Matrix_rotate(angle, aroundV) {
                /** * *
                * Rotates this matrix *angle* degrees around *aboutVector*
                * @param - angle Number 
                * @param - aroundV Vector
                * * **/
                aroundV = aroundV || m.Vector.Z();
                
                var x,y,z;
                x = aroundV.x();
                y = aroundV.y();
                z = aroundV.z();
            
                var sinAngle, cosAngle;
                sinAngle = Math.sin(angle * m.Geometry.ONE_DEGREE);
                cosAngle = Math.cos(angle * m.Geometry.ONE_DEGREE);
            
                var mag = Math.sqrt(x*x + y*y + z*z);
                if (mag > 0) {
                    var xx, yy, zz, xy, yz, zx, xs, ys, zs;
                    var oneMinusCos;
        
                    x /= mag;
                    y /= mag;
                    z /= mag;
        
                    xx = x * x;
                    yy = y * y;
                    zz = z * z;
                    xy = x * y;
                    yz = y * z;
                    zx = z * x;
                    xs = x * sinAngle;
                    ys = y * sinAngle;
                    zs = z * sinAngle;
                    oneMinusCos = 1.0 - cosAngle;
        
                    var rotationMatrix = addin();
        
                    rotationMatrix.elements[0*4+0] = (oneMinusCos * xx) + cosAngle;
                    rotationMatrix.elements[0*4+1] = (oneMinusCos * xy) + zs;
                    rotationMatrix.elements[0*4+2] = (oneMinusCos * zx) - ys;
                    rotationMatrix.elements[0*4+3] = 0.0;
        
                    rotationMatrix.elements[1*4+0] = (oneMinusCos * xy) - zs;
                    rotationMatrix.elements[1*4+1] = (oneMinusCos * yy) + cosAngle;
                    rotationMatrix.elements[1*4+2] = (oneMinusCos * yz) + xs;
                    rotationMatrix.elements[1*4+3] = 0.0;
        
                    rotationMatrix.elements[2*4+0] = (oneMinusCos * zx) + ys;
                    rotationMatrix.elements[2*4+1] = (oneMinusCos * yz) - xs;
                    rotationMatrix.elements[2*4+2] = (oneMinusCos * zz) + cosAngle;
                    rotationMatrix.elements[2*4+3] = 0.0;
        
                    rotationMatrix.elements[3*4+0] = 0.0; 
                    rotationMatrix.elements[3*4+1] = 0.0;
                    rotationMatrix.elements[3*4+2] = 0.0; 
                    rotationMatrix.elements[3*4+3] = 1.0;
        
                    self.multiply(rotationMatrix);
                }
                return self;
            });
            
            m.safeAddin(self, 'translateVector', function Matrix_translateVector(vector) {
                /** * *
                * Convenience method that translates along *vector*
                * * **/
                self.translate(vector.x(),vector.y(),vector.z());
                return self;
            });
            m.safeAddin(self, 'right', function Matrix_right() {
                /** * *
                * Returns the vector corresponding to the right direction of this projection matrix.
                * @returns - Vector
                * * **/
                return Vector({
                    elements : [
                        self.elements[0],
                        self.elements[4],
                        self.elements[8]
                    ]
                });
            });
            m.safeAddin(self, 'up', function Matrix_up() {
                /** * *
                * Returns a vector corresponding to the up direction with respect to this projection matrix.
                * @returns - Vector
                * * **/
                return Vector({
                    elements : [
                        self.elements[1],
                        self.elements[5],
                        self.elements[9]
                    ]
                });
            });
            m.safeAddin(self, 'out', function Matrix_out() {
                /** * *
                * Returns a vector corresponding to the up direction with respect to this projection matrix.
                * @returns - Vector
                * * **/
                return Vector({
                    elements : [
                        self.elements[2],
                        self.elements[6],
                        self.elements[10]
                    ]
                });
            });
            m.safeAddin(self, 'transformVector', function Matrix_transformVector(vec) {
                /** * *
                * Returns a copy of a 3D vector *vec* transformed by this transformation matrix.
                * @param - vec Vector
                * @
                * * **/
                var vecMat = addin();
                vecMat.translateVector(vec);
                vecMat.multiply(self);
                return m.Vector({
                    elements : [
                        vecMat.x(),
                        vecMat.y(),
                        vecMat.z()
                    ]
                });
            });
            
            
            if (!defined) {
                self.loadIdentity();
            }
            return self;
        };
        
        return addin;
    }
});

