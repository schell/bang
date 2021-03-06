/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Polygon.js
* A vector of points in 2 space.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Apr 24 18:50:08 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Polygon',
    dependencies : [ 'bang::Geometry/Vector.js' ],
    /** * *
    * Initializes the Polygon type.
    * @param {function} Vector The Vector constructor function.
    * @return {function}
    * * **/
    init : function initPolygon (Vector) {
        /** * *
        * Creates a new polygon
        * @param ...
        * @return {Polygon}
        * @constructor
        * * **/
        function Polygon() {
           Vector.apply(this, Array.prototype.slice.call(arguments));
        }
        
        Polygon.prototype = new Vector();
        
        Polygon.prototype.constructor = Polygon;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns the string representation of the polygon.
        * @return {string}
        * * **/
        Polygon.prototype.toString = function() {
            return 'Polygon['+Array.prototype.toString.call(this)+']';
        };
        /** * *
        * Returns whether or not the polygon contains the point p.
        * @param {Vector}
        * @returns {boolean}
        * @nosideeffects
        * * **/
        Polygon.prototype.containsPoint = function Polygon_containsPoint(p) {
            var x = p.x;
            var y = p.y;
            var xp = [];
            var yp = [];
            var ncomp = this.length;
            var npol = ncomp/2;
                
            for (var i = 0; i < ncomp; i+=2) {
                xp.push(this[i]);
                yp.push(this[i+1]);
            }
    
            var j = npol - 1;
            var c = false;
            for (i = 0; i < npol; j = i++) {
                if ((((yp[i] <= y) && (y < yp[j])) ||
                     ((yp[j] <= y) && (y < yp[i]))) &&
                    (x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
                        c = !c;
                }
            }
            return c;
        };
        
        return Polygon;
    }
});
