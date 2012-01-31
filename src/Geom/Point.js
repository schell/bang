/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Point.js
 *    A addinion function/module for points in 3space.
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 09:48:33 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Point',
    dependencies : [ 'Global.js', 'Geom/Vector.js' ],
    init : function initPoint (m) {
        /**
         * Initializes the Point function/module.
         * @param - m Object - The mod modules object
         * @return Object - The Point function/module 
         */
        
         var addin = function addinPoint(self) {
             /**
             * Adds Point properties to *self*.
             * @param - self Object - The object to add Point properties to.
             * @param - x Number - An initial x position in 2space.
             * @param - y Number - An initial y position in 2space.
             */
            
            // Initialize self (adding in Vector)...
            self = m.Vector(self);

            if (self.elements.length === 0) {
                self.elements = m.Vector.Origin().elements;
            }
            
            self.addToString(function Point_toString() {
                 return '[Point('+self.x()+','+self.y()+','+self.z()+')]';
             });
            
            //--------------------------------------
            //  Addins
            //--------------------------------------
             m.safeOverride(self, 'copy', 'vector_copy', function Point_copy() {
                 /** * *
                 * Returns an object that is a kind of Point. 
                 * @return - Point Object
                 * * **/
                 // make a copy of this Vector
                 var vCpy = self.vector_copy();
                 // addin Point props
                 return addin(vCpy);
             });
            
             m.safeAddin(self, 'distanceTo', function Point_distance(point) {
                 /**
                  * Determines the distance to another point.
                  * @return Number - distance
                  */
                 var dx = point.x() - self.x();
                 var dy = point.y() - self.y();
                 if (dx === 0 && dy === 0) {
                     return 0;
                 }
                 return Math.sqrt(dx*dx + dy*dy);
             });

             m.safeAddin(self, 'closer', function Point_close(p1, p2) {
                 /**
                  * Returns either *p1* or *p2*, whichever is closer
                  * @return point - the closer point.
                  */
                 var d1 = self.distanceTo(p1);
                 var d2 = self.distanceTo(p2);
                 if (d1 < d2) {
                     return p1;
                 }
                 return p2;
             });
            
            return self;
         };
        
        addin.from = function Point_from(x, y, z) {
            /**
             * Returns a Point at x,y.
             * @param - x Number - x position for the point.
             * @param - y Number - y position for the point.
             */
            x = m.ifndefInitNum(x, 0);
            y = m.ifndefInitNum(y, 0); 
            z = m.ifndefInitNum(z, 0); 
            return addin({
                elements : [ x, y, z ]
            });
        };
        
        return addin;
    }
});
