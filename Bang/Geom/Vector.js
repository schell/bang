/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Vector.js
* The Vector Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed Jan 25 10:02:52 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Vector',
    dependencies : [  ],
    init : function initVector (m) {
        /**
         * Initializes the Vector Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinVector (self) {
            /**
             * Adds Vector properties to *self*.
             * @param - self Object - The object to add Vector properties to.
             * @return self Vector Object 
             */
            self = m.Object(self); 
            //--------------------------------------
            //  PROPERTIES
            //--------------------------------------
            /** * *
            * An array for holding our vector elements.
            * @var Array
            * * **/
            m.safeAddin(self, 'elements', []);
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            m.safeAddin(self, 'isEqualTo', function Vector_isEqualTo(vec) {
                /** * *
                * Returns whether or not *vec* is equal to self.
                * @param - vec Vector
                * @returns - Boolean
                * * **/
                if (self.elements.length !== vec.elements.length) {
                    return false;
                }
                for (var i = self.elements.length - 1; i >= 0; i--){
                    if (self.elements[i] !== vec.elements[i]) {
                        return false;
                    }
                }
                return true;
            });
            
            m.safeAddin(self, 'copy', function Vector_copy() {
                /** * *
                * Returns a copy of this vector.
                * * **/
                var vec = addin();
                for (var i=0; i < self.elements.length; i++) {
                    vec.elements.push(self.elements[i]);
                }
                return vec;
            });
            m.safeAddin(self, 'add', function Vector_add(vec) {
                /** * *
                * Adds *vec* to this vector.
                * @param - vec Vector
                * * **/
                var n = vecWithMinElements(self, vec).elements.length;
                for (var i=0; i < n; i++) {
                    self.elements[i] += vec[i];
                }
            });
            
            m.safeAddin(self, 'subtract', function Vector_subtract(vec) {
                /** * *
                * Subtracts *vec* from this vector.
                * @param - vec Vector
                * * **/
                var n = vecWithMinElements(self, vec).elements.length;
                for (var i=0; i < n; i++) {
                    self.elements[i] -= vec.elements[i];
                }
            });
            
            m.safeAddin(self, 'multiply', function Vector_multiply(vec) {
                /** * *
                * Multiplies this vector by *vec*.
                * @param - vec Vector    
                * * **/
                var n = vecWithMinElements(self, vec).elements.length;
                for (var i=0; i < n; i++) {
                    self.elements[i] *= vec.elements[i];
                }
            });
            
            m.safeAddin(self, 'divide', function Vector_divide(vec) {
                /** * *
                * Divides this vector by *vec*.
                * @param - vector Vector
                * * **/
                var n = vecWithMinElements(self, vec).elements.length;
                for (var i=0; i < n; i++) {
                    self.elements[i] /= vec.elements[i];
                }
            });
            
            m.safeAddin(self, 'magnitude', function Vector_magnitude() {
                /** * *
                * Returns the magnitude of this vector.
                * @returns - Number
                * * **/
                var sqSum = 0;
                for (var i=0; i < self.elements.length; i++) {
                    sqSum += self.elements[i]*self.elements[i];
                }
                return Math.sqrt(sqSum);
            });
            
            m.safeAddin(self, 'normalized', function Vector_normalized() {
                /** * *
                * Returns a normalized copy of this vector.
                * @returns - Vector
                * * **/
                var norm = self.copy();
                var mag = self.magnitude();
                for (var i=0; i < norm.elements.length; i++) {
                    norm.elements[i] /= mag;
                }
                return norm;
            });
            m.safeAddin(self, 'x', function Vector_x(x) {
                /** * *
                * Returns the x element. 
                * If *x* is supplied as a parameter, will set the x element before returning.
                * @param - x Number
                * @returns - x Number
                * * **/
                if (arguments.length) {
                    self.elements[0] = x;
                }
                return self.elements[0];
            });
            m.safeAddin(self, 'y', function Vector_y(y) {
                /** * *
                * Returns the y element.
                * If *y* is supplied as a parameter, will set the y element before returning.
                * @param - y Number
                * @returns - y Number
                * * **/
                if (arguments.length) {
                    self.elements[1] = y;
                }
                return self.elements[1];
            });
            m.safeAddin(self, 'z', function Vector_z(z) {
                /** * *
                * Returns the z element.
                * If *z* is supplied as a parameter, will set the z element before returning.
                * @param - z Number
                * @returns - z Number
                * * **/
                if (arguments.length) {
                    self.elements[2] = z;
                }
                return self.elements[2];
            });
            //--------------------------------------
            //  HELPERS
            //--------------------------------------
            function vecWithMinElements(vec1, vec2) {
                /** * *
                * Returns the vector with the least number of elements.
                * * **/
                return vec1.elements.length < vec2.elements.length ? vec1 : vec2;
            }
            //--------------------------------------
            //  STRING
            //--------------------------------------
            self.addToString(function() {
                var s = '[Vector(';
                for (var i=0; i < self.elements.length; i++) {
                    s += self.elements[i].toFixed(3);
                    if (i !== self.elements.length-1) {
                        s += ', ';
                    }
                }
                s+=')]';
                return s;
            });
            return self;
        };
        addin.from = function Vector_from(x, y, z) {
            /** * *
            * Returns a 3-space vector <x,y,z>
            * * **/
            x = m.ifndefInitNum(x, 0);
            y = m.ifndefInitNum(y, 0);
            z = m.ifndefInitNum(z, 0);
            
            return addin({
                elements : [x, y, z]
            });
        }
        addin.Origin = function Vector_Origin() {
            /** * *
            * Returns the origin point in 3-space.
            * @returns - Vector
            * * **/
            return addin({
                elements : [0.0, 0.0, 0.0]
            });
        };
        addin.X = function Vector_X() {
            /** * *
            * Returns the X axis Vector.
            * @returns - Vector
            * * **/
            return addin({
                elements : [ 1.0, 0.0, 0.0]
            });
        };
        addin.Y = function Vector_Y() {
            /** * *
            * Returns the Y axis Vector.
            * @returns - Vector
            * * **/
            return addin({
                elements : [ 0.0, 1.0, 0.0]
            });
        };
        addin.Z = function Vector_Z() {
            /** * *
            * Returns the Z axis Vector.
            * @returns - Vector
            * * **/
            return addin({
                elements : [ 0.0, 0.0, 1.0]
            });
        };
        
        return addin;
        
    }
});