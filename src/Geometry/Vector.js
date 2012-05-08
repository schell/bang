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
    init : function initVector (m) {
        /** * *
        * Initializes the Vector array extension.
        * @param - m Object - The mod modules object.
        * * **/
        
        function Vector() {
            this.length = arguments.length;
            for (var i=0; i < arguments.length; i++) {
                this[i] = arguments[i];
            }
        }
        
        Vector.prototype = [];
        
        Vector.prototype.constructor = Vector;
        
        Vector.prototype.toString = function Vector_toString() {
            return 'Vector['+Array.prototype.toString.call(this)+']';
        };
        
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        Vector.prototype.foldl = function Vector_foldl(f, acc) {
            /** * *
            * Folds left (starting at zero) along this array using function f, 
            * which takes an accumulator and an element and returns
            * a new accumulator value - acc is the initial accumulator
            * value. Returns the resulting accumulator.
            * @param function (accumulator, element)
            * @param object
            * @nosideeffects
            * * **/
            for (var i=0; i < this.length; i++) {
                acc = f(acc, this[i]);
            }
            return acc;
        };
        
        Vector.prototype.foldr = function Vector_foldr(f, acc) {
            /** * *
            * Folds right (starting at this.length) along this array 
            * using function f, which takes an element and an accumulator
            * and returns a new accumulator value - acc is the initial accumulator
            * value. Returns the resulting accumulator.
            * @param function (element, accumulator)
            * @param object
            * @nosideeffects
            * * **/
            for (var i = this.length - 1; i >= 0; i--){
                acc = f(this[i], acc);
            }
            return acc;
        };
        
        Vector.prototype.map = function Vector_map(f) {
            /** * *
            * Maps a function over the vector, creating a new vector
            * with the return values.
            * @param {function(*, number, Array.<*>)}
            * @return {Vector}
            * @nosideeffects
            * * **/
            var copy = new this.constructor();
            for (var i = this.length - 1; i >= 0; i--){
                copy[i] = f(this[i],i,this);
            }
            copy.length = this.length;
            return copy;
        };
        
        Vector.prototype.takeWhile = function Vector_takeWhile(f) {
            /** * *
            * Maps function f over all elements, collecting elements
            * in a new array that return true when fed to f, until f returns false.
            * @param {function(*, number): *}
            * @return {Vector}
            * @nosideeffects
            * * **/
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
        
        Vector.prototype.isEqualTo = function Vector_isEqualTo(a) {
            /** * *
            * Returns whether or not array a is equal to this.
            * @param {Vector}
            * @return {boolean}
            * @nosideeffects
            * * **/
            if (this.length !== a.length) {
                return false;
            }
            var b = this.takeWhile(function (el, ndx) {
                return el === a[ndx];
            });
            return this.length === b.length;
        };
        
        Vector.prototype.copy = function Vector_copy() {
            /** * *
            * Returns a copy of this vector.
            * @return {Vector}
            * @nosideeffects
            * * **/
            return this.takeWhile(function (el) {
                return true;
            });
        };
        
        Vector.prototype.add = function Vector_add(v) {
            /** * *
            * Returns the addition of Vector v and this.
            * @param {Vector}
            * @return {Vector}
            * @nosideeffects
            * * **/
            return this.foldl(function (acc, element) {
                acc.push(element + v[acc.length]);
                return acc;
            }, new this.constructor());
        };
        
        Vector.prototype.subtract = function Vector_subtract(v) {
            /** * *
            * Returns the subtraction of Vector v from this.
            * @param {Vector}
            * @return {Vector}
            * @nosideeffects
            * * **/
            return this.foldl(function (acc, element) {
                acc.push(element - v[acc.length]);
                return acc;
            }, new this.constructor());
        };
        
        Vector.prototype.x = function Vector_x(x) {
            /** * *
            * Gets and sets the x value.
            * @param {number}
            * @return {number}
            * * **/
            if (arguments.length) {
                this[0] = x;
            }
            return this[0];
        };
        
        Vector.prototype.y = function Vector_y(y) {
            /** * *
            * Gets and sets the y value.
            * @param {number}
            * @return {number}
            * * **/
            if (arguments.length) {
                this[1] = y;
            }
            return this[1];
        };
        
        Vector.prototype.magnitude = function Vector_magnitude() {
            /** * *
            * Returns the magnitude of this vector.
            * @return {number}
            * @nosideeffects
            * * **/
            var total = this.foldr(function (element, acc) {
                return element*element+acc;
            }, 0);
            return Math.sqrt(total);
        };
        
        Vector.prototype.normalize = function Vector_normalize() {
            /** * *
            * Returns the unit vector of this vector.
            * @return {Vector}
            * @nosideeffects
            * * **/
            var magnitude = this.magnitude();
            return this.foldr(function (element, acc) {
                acc.unshift(element/magnitude);
                return acc;
            }, new this.constructor());
        };
        
        return Vector;
    }
});