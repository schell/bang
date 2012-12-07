/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Vector.js
* The vector addin.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Apr 24 12:32:51 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Vector',
    dependencies : [ ],
    /** * *
    * Initializes the Vector array extension.
    * @return {function(...)}
    * * **/
    init : function initVector () {
        /** * *
        * Creates a new instance of vector.
        * * **/
        function Vector() {
            this.length = arguments.length;
            for (var i=0; i < arguments.length; i++) {
                this[i] = arguments[i];
            }
        }
        
        Vector.prototype = [];
        
        Vector.prototype.constructor = Vector;
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the x property.
        * The first element of the vector.
        * @returns {number} 
        * * **/
        Vector.prototype.__defineGetter__('x', function Vector_getx() {
            return this[0]; 
        });
        /** * *
        * Sets the x property.
        * Sets the first element of the vector.
        * @param {number} x
        * * **/
        Vector.prototype.__defineSetter__('x', function Vector_setx(x) {
            this[0] = x;
        });
        /** * *
        * Gets the y property.
        * The second element of the vector.
        * @returns {number} 
        * * **/
        Vector.prototype.__defineGetter__('y', function Vector_gety() {
            return this[1]; 
        });
        /** * *
        * Sets the y property.
        * Sets the first element of the vector.
        * @param {number} y
        * * **/
        Vector.prototype.__defineSetter__('y', function Vector_sety(y) {
            this[1] = y;
        });
        /** * *
         * Gets the magnitude property.
         * 
         * @returns {number} 
         * * **/
        Vector.prototype.__defineGetter__('magnitude', function Vector_getmagnitude() {
            var total = this.foldr(function (element, acc) {
                return element*element+acc;
            }, 0);
            return Math.sqrt(total);
        });
        /** * *
        * Gets the normalize property.
        * The unit vector of this vector.
        * @returns {Vector} 
        * * **/
        Vector.prototype.__defineGetter__('normalize', function Vector_getnormalize() {
            var magnitude = this.magnitude;
            return this.foldr(function (element, acc) {
                acc.unshift(element/magnitude);
                return acc;
            }, new this.constructor());
        });
        /** * *
        * Gets the unitVector property.
        * An alias of normalize.
        * @returns {Vector} 
        * * **/
        Vector.prototype.__defineGetter__('unitVector', function Vector_getunitVector() {
            return this.normalize;
        });
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns the string representation of the Vector.
        * @return {string}
        * * **/
        Vector.prototype.toString = function Vector_toString() {
            return 'Vector('+Array.prototype.toString.call(this)+')';
        };
        /** * *
        * Folds left (starting at zero) along the vector using function f, 
        * which takes an accumulator and an element and returns
        * a new accumulator value - acc is the initial accumulator
        * value. Returns the resulting accumulator.
        * @param function (accumulator, element)
        * @param object
        * @nosideeffects
        * * **/
        Vector.prototype.foldl = function Vector_foldl(f, acc) {
            for (var i=0; i < this.length; i++) {
                acc = f(acc, this[i]);
            }
            return acc;
        };
        /** * *
        * Folds right (starting at this.length) along the vector 
        * using function f, which takes an element and an accumulator
        * and returns a new accumulator value - acc is the initial accumulator
        * value. Returns the resulting accumulator.
        * @param function (element, accumulator)
        * @param object
        * @nosideeffects
        * * **/
        Vector.prototype.foldr = function Vector_foldr(f, acc) {
            for (var i = this.length - 1; i >= 0; i--){
                acc = f(this[i], acc);
            }
            return acc;
        };
        /** * *
        * Maps a function over the vector, creating a new vector
        * with the return values.
        * @param {function(*, number, Array.<*>)}
        * @return {Vector}
        * @nosideeffects
        * * **/
        Vector.prototype.map = function Vector_map(f) {
            var copy = new this.constructor();
            for (var i = this.length - 1; i >= 0; i--){
                copy[i] = f(this[i],i,this);
            }
            copy.length = this.length;
            return copy;
        };
        /** * *
        * Maps function f over all elements, collecting elements
        * in a new array that return true when fed to f, until f returns false.
        * @param {function(*, number): *}
        * @return {Vector}
        * @nosideeffects
        * * **/
        Vector.prototype.takeWhile = function Vector_takeWhile(f) {
            var a = new this.constructor();
            var i = 0;
            for (i; i < this.length; i++) {
                var element = this[i];
                if (f(element, i)) {
                    a[i] = this[i];
                } else {
                    break;
                }
            }
            a.length = i;
            return a;
        };
        /** * *
        * Returns whether or not array a is equal to this.
        * @param {Vector}
        * @return {boolean}
        * @nosideeffects
        * * **/
        Vector.prototype.isEqualTo = function Vector_isEqualTo(a) {
            if (this.length !== a.length) {
                return false;
            }
            var b = this.takeWhile(function (el, ndx) {
                return el === a[ndx];
            });
            return this.length === b.length;
        };
        /** * *
        * Returns a copy of this vector.
        * @return {Vector}
        * @nosideeffects
        * * **/
        Vector.prototype.copy = function Vector_copy() {
            return this.takeWhile(function (el) {
                return true;
            });
        };
        /** * *
        * Returns the addition of Vector v and this.
        * @param {Vector}
        * @return {Vector}
        * @nosideeffects
        * * **/
        Vector.prototype.add = function Vector_add(v) {
            return this.foldl(function (acc, element) {
                acc.push(element + v[acc.length]);
                return acc;
            }, new this.constructor());
        };
        /** * *
        * Returns the subtraction of Vector v from this.
        * @param {Vector}
        * @return {Vector}
        * @nosideeffects
        * * **/
        Vector.prototype.subtract = function Vector_subtract(v) {
            return this.foldl(function (acc, element) {
                acc.push(element - v[acc.length]);
                return acc;
            }, new this.constructor());
        };
        /** * *
        * Returns the point at a given index. Zero indexed.
        * For example, pointAt(1) would return the second point.
        * A point is considered two contigious elements in the vector.
        * @param {number}
        * @return {Vector}
        * * **/
        Vector.prototype.pointAt = function Vector_pointAt(n) {
            var ndx = 2*n;
            return new Vector(this[ndx], this[ndx+1]);
        };
        /** * *
        * Returns the intersection point of two lines or false
        * if they do not intersect.
        * @param {Vector}
        * @param {Vector}
        * @return {Vector|false}
        * * **/
        Vector.lineIntersection = function Vector_lineIntersection(vec1, vec2) {
            var p1 = vec1.pointAt(0);
            var p2 = vec1.pointAt(1);
            var p3 = vec2.pointAt(0);
            var p4 = vec2.pointAt(1);
            /** * *
            * Returns the equation of a line segment formed by p1->p2.
            * @return {Object}
            * * **/
            function getLineEquation(p1, p2) {
                // y = mx + b
                // b = y - mx
                // x = (y - b) / m
                var m = (p2.y - p1.y) / (p2.x - p1.x);
                var b = p2.y - m*p2.x;
                return {
                    // slope, rise over run...
                    m : m,
                    b : b,
                    xAty : function(y) {
                        return (y - b) / m;
                    },
                    yAtx : function(x) {
                        return m*x + b;
                    }
                };
            }
                
            var e1,e2,x,y;
            e1 = getLineEquation(p1, p2);
            e2 = getLineEquation(p3, p4);
                
            if (e1.m === e2.m) {
                // These lines are co-linear and do not intersect...
                return false;
            } else if (Math.abs(e1.m) === Number.POSITIVE_INFINITY) {
                x = p2.x;
                y = e2.yAtx(x);
            } else if (Math.abs(e2.m) === Number.POSITIVE_INFINITY) {
                x = p4.x;
                y = e1.yAtx(x);
            } else {
                x = e2.b / (e1.m + e1.b - e2.m);
                y = e2.yAtx(x);
            }
            return new Vector(x, y);
        };
        
        return Vector;
    }
});
