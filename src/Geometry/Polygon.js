/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Polygon.js
* The polygon type.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Apr 24 18:50:08 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Polygon',
    dependencies : [ 'bang::Geometry/Vector.js' ],
    init : function initPolygon (m) {
        /** * *
        * Initializes the Polygon type.
        * @param object
        * * **/
        
        function Polygon() {
            var v = Object.create(Polygon.prototype);
            v.length = 0;
            for (var i=0; i < arguments.length; i++) {
                v.push(arguments[i]);
            }
            return v;
        }
        
        Polygon.prototype = m.Vector();
        
        Polygon.prototype.constructor = Polygon;
        
        Polygon.prototype.toString = function() {
            return 'Polygon['+Array.prototype.toString.call(this)+']';
        };
        
        Polygon.prototype.containsPoint = function Polygon_containsPoint(p) {
            /** * *
            * Returns whether or not this polygon contains the point p.
            * @param Vector
            * @returns boolean
            * @nosideeffects
            * * **/
            var x = p[0];
            var y = p[1];
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