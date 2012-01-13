/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Point.js
 *    A addinion function/module for points in 2space.
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 09:48:33 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Point',
    dependencies : [ 'Global.js' ],
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
            
            // Initialize self...
            self = m.ifndefInitObj(self, m.initialObject());
            
            // Add x and y to self...
            m.safeAddin(self, 'x', 0);
            m.safeAddin(self, 'y', 0);
			
            //--------------------------------------
            //  Addins
            //--------------------------------------
 			m.safeAddin(self, 'copy', function Point_copy() {
 				/**
 				 * Returns an object that is a kind of Point.
                 * @return - Point Object
 				 */
 				return addin({x:self.x, y:self.y});
 			});
			
 			m.safeAddin(self, 'isEqualTo', function Point_isEqualTo(point) {
 				/**
 				 * Returns whether or not *point* is equal to self.
                 * @param - point Point Object
 				 */
 				return point.x == self.x && point.y == self.y;
 			});

 			m.safeAddin(self, 'distanceTo', function Point_distance(point) {
 				/**
 				 * Determines the distance to another point.
 				 * @return Number - distance
 				 */
 				var dx = point.x - self.x;
 				var dy = point.y - self.y;
 				if (dx == 0 && dy == 0) {
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
            
 			self.addToString(function Point_toString() {
 				return "[Point("+self.x+","+self.y+")]";
 			});
            
            return self;
 		};
        
        addin.from = function Point_from(x, y) {
            /**
             * Returns a Point at x,y.
             * @param - x Number - x position for the point.
             * @param - y Number - y position for the point.
             */
            x = m.ifndefInitNum(x, 0);
            y = m.ifndefInitNum(y, 0); 
            return addin({x:x,y:y})
        };
        
        return addin;
    }
});
