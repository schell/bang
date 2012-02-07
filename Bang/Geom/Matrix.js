/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Matrix.js
* The Matrix Addin
* /---------------------------------------\
* | indices     | elements   | meaning    |
* |---------------------------------------| 
* | 0  1  2  3  | a  c  0  0 | s  0  0  0 |
* | 4  5  6  7  | b  d  0  0 | 0  s  0  0 |
* | 8  9  10 11 | 0  0  1  0 | 0  0  s  0 |
* | 12 13 14 15 | x  y  z  1 | x  y  z  1 |
* \---------------------------------------/ 
* (http://math.stackexchange.com/questions/336/why-are-3d-transformation-matrices-4x4-instead-of-3x3#343)
*
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed Jan 25 09:59:05 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Matrix',
    dependencies : [ 'Bang/Geometry.js', 'Bang/Notifications.js' ],
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
            
            // Addin Dispatcher
            m.Dispatcher(self);
            
            //--------------------------------------
            //  METHODS
            //--------------------------------------
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
                var s = '\n' + fixed(self.elements[0]) + ' ' + fixed(self.elements[1]) + ' ' + fixed(self.elements[2]) + ' ' + fixed(self.elements[3]) + '\n';
                s += fixed(self.elements[4]) + ' ' + fixed(self.elements[5]) + ' ' + fixed(self.elements[6]) + ' ' + fixed(self.elements[7]) + '\n';
                s += fixed(self.elements[8]) + ' ' + fixed(self.elements[9]) + ' ' + fixed(self.elements[10]) + ' ' + fixed(self.elements[11]) + '\n';
                s += fixed(self.elements[12]) + ' ' + fixed(self.elements[13]) + ' ' + fixed(self.elements[14]) + ' ' + fixed(self.elements[15]);
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
                return self.elements[4];
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
                return self.elements[5];
            });
            m.safeOverride(self, 'x', 'vector_x', function Matrix_x(x) {
                /** * *
                * Returns the 'x' matrix component. Optionally sets the x component
                * if *x* is supplied.
                * @param - x Number
                * @returns - Number
                * * **/
                self.elements[12] = m.ifndefInitNum(x, self.elements[12]);
                return self.elements[12];
            });
            m.safeOverride(self, 'y', 'vector_y', function Matrix_y(y) {
                /** * *
                * Returns the 'y' matrix component. Optionally sets the y component
                * if *y* is supplied.
                * @param - y Number
                * @returns - Number
                * * **/
                self.elements[13] = m.ifndefInitNum(y, self.elements[13]);
                return self.elements[13];
            });
            m.safeOverride(self, 'z', 'vector_z', function Matrix_z(z) {
                /** * *
                * Returns the 'z' matrix component. Optionally sets the z component
                * if *z* is supplied.
                * @param - z Number
                * @returns - Number
                * * **/
                self.elements[14] = m.ifndefInitNum(z, self.elements[14]);
                return self.elements[14];
            });
            m.safeAddin(self, 'scaleX', function Matrix_scaleX(x) {
                /** * *
                * Getter/setter for the x scale component.
                * @param - x Number
                * @returns - Number
                * * **/
                self.elements[0] = m.ifndefInitNum(x, self.elements[0]);
                return self.elements[0];
            });
            m.safeAddin(self, 'scaleY', function Matrix_scaleY(y) {
                /** * *
                * Getter/setter for the x scale component.
                * @param - x Number
                * @returns - Number
                * * **/
                self.elements[5] = m.ifndefInitNum(y, self.elements[5]);
                return self.elements[5];
            });
            m.safeAddin(self, 'scaleZ', function Matrix_scaleZ(z) {
                /** * *
                * Getter/setter for the z scale component.
                * @param - z Number
                * @returns - Number
                * * **/
                self.elements[10] = m.ifndefInitNum(z, self.elements[10]);
                return self.elements[10];
            });
            m.safeAddin(self, 'loadIdentity', function Matrix_loadIdentity() {
                /** * *
                * Loads the identity projection/transformation matrix.
                * * **/
                self.elements = [
                    1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0
                ];
                return self;
            });
            m.safeAddin(self, 'loadOrtho', function Matrix_name(left, right, top, bottom, far, near) {
                /** * *
                * Loads a parallel projection matrix.
                * * **/
                var a,b,c,x,y,z;
                a = 2.0/(right-left);
                b = 2.0/(top-bottom);
                c = -2.0/(far-near);
                x = -(right+left)/(right-left);
                y = -(top+bottom)/(top-bottom);
                z = -(far+near)/(far-near);
                
                self.elements = [
                    a  , 0.0, 0.0,   x,
                    0.0,   b, 0.0,   y,
                    0.0, 0.0,   c,   z,
                    0.0, 0.0, 0.0, 1.0
                ];
                return self;
            });
            m.safeOverride(self, 'multiply', 'vector_multiply', function Matrix_multiply(matrix) {
                /** * *
                * Multiplies this matrix by *matrix*.
                * @param - matrix Matrix
                * * **/
                var elements = [];
                for (var i = 0; i < 4; i++) {
                    elements[i*4+0] = (self.elements[i*4+0] * matrix.elements[0*4+0]) +
                    (self.elements[i*4+1] * matrix.elements[1*4+0]) +
                    (self.elements[i*4+2] * matrix.elements[2*4+0]) +
                    (self.elements[i*4+3] * matrix.elements[3*4+0]);
                                    
                    elements[i*4+1] = (self.elements[i*4+0 ] * matrix.elements[0*4+1]) + 
                    (self.elements[i*4+1] * matrix.elements[1*4+1]) +
                    (self.elements[i*4+2] * matrix.elements[2*4+1]) +
                    (self.elements[i*4+3] * matrix.elements[3*4+1]);
                                    
                    elements[i*4+2] = (self.elements[i*4+0 ] * matrix.elements[0*4+2]) + 
                    (self.elements[i*4+1] * matrix.elements[1*4+2]) +
                    (self.elements[i*4+2] * matrix.elements[2*4+2]) +
                    (self.elements[i*4+3] * matrix.elements[3*4+2]);
                                    
                    elements[i*4+3] = (self.elements[i*4+0 ] * matrix.elements[0*4+3]) + 
                    (self.elements[i*4+1] * matrix.elements[1*4+3]) +
                    (self.elements[i*4+2] * matrix.elements[2*4+3]) +
                    (self.elements[i*4+3] * matrix.elements[3*4+3]);
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

