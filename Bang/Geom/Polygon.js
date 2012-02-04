/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Polygon.js
* The Polygon Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Jan 24 16:25:28 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Polygon',
    dependencies : [  ],
    init : function initPolygon (m) {
        /**
         * Initializes the Polygon Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinPolygon (self) {
            /**
             * Adds Polygon properties to *self*.
             * @param - self Object - The object to add Polygon properties to.
             * @return self Polygon Object 
             */
            self = m.Object(self); 
            
            m.safeAddin(self, 'points', []);
            
            m.safeAddin(self, 'copy', function Polygon_copy() {
                /** * *
                * Returns a copy of this polygon.
                * @returns - Polygon
                * * **/
                var copy = addin();
                for (var i=0; i < self.points.length; i++) {
                    var point = self.points[i];
                    var cp = point.copy();
                    copy.points.push(cp);
                }
                return copy;
            });
            
            m.safeAddin(self, 'containsPoint', function Polygon_containsPoint(point) {
                /** * *
                * Returns whether or not this polygon contains *point*.
                * @returns - Boolean
                * * **/
                var x = point.x();
                var y = point.y();
                var xp = [];
                var yp = [];
                var npol = self.points.length;
                
                for (var i = 0; i < npol; i++) {
                    var vertex = self.points[i];
                    xp.push(vertex.x());
                    yp.push(vertex.y());
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
            });
            
            return self;
        };
        
        return addin;
        
    }
});

