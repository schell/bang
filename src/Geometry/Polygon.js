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
            
            // Addin Vector
            self = m.Vector(self);
            
            m.safeAddin(self, 'containsPoint', function Polygon_containsPoint(point) {
                /** * *
                * Returns whether or not this polygon contains *point*.
                * @returns - Boolean
                * * **/
                var x = point.x();
                var y = point.y();
                var xp = [];
                var yp = [];
                var ncomp = self.elements.length;
                var npol = ncomp/2;
                
                for (var i = 0; i < ncomp; i+=2) {
                    xp.push(self.elements[i]);
                    yp.push(self.elements[i+1]);
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
            m.safeAddin(self, 'pointAt', function Polygon_getPoint(n) {
                /** * *
                * Returns the nth (zero indexed) point in this polygon.
                * @param - n Number
                * @return - Point
                * * **/
                return m.Point({
                    elements : [
                        self.elements[n*2],
                        self.elements[n*2+1]
                    ]
                });
            });
            m.safeAddin(self, 'left', function Polygon_left() {
                /** * *
                * Returns the left-most x coordinate.
                * @return Number
                * * **/
                var x = Number.POSITIVE_INFINITY;
                for (var i = self.elements.length - 2; i >= 0; i-=2){
                    if (self.elements[i] < x) {
                        x = self.elements[i];
                    }
                }
                return x;
            });
            m.safeAddin(self, 'top', function Polygon_top() {
                /** * *
                * Returns the left-most x coordinate.
                * @return Number
                * * **/
                var y = Number.POSITIVE_INFINITY;
                for (var i = self.elements.length - 1; i >= 1; i-=2){
                    if (self.elements[i] < y) {
                        y = self.elements[i];
                    }
                }
                return y;
            });
            m.safeAddin(self, 'right', function Polygon_right() {
                /** * *
                * Returns the left-most x coordinate.
                * @return Number
                * * **/
                var x = Number.NEGATIVE_INFINITY;
                for (var i = self.elements.length - 2; i >= 0; i-=2){
                    if (self.elements[i] > x) {
                        x = self.elements[i];
                    }
                }
                return x;
            });
            m.safeAddin(self, 'bottom', function Polygon_bottom() {
                /** * *
                * Returns the left-most x coordinate.
                * @return Number
                * * **/
                var y = Number.NEGATIVE_INFINITY;
                for (var i = self.elements.length - 1; i >= 1; i-=2){
                    if (self.elements[i] > y) {
                        y = self.elements[i];
                    }
                }
                return y;
            });
            
            return self;
        };
        
        return addin;
        
    }
});

