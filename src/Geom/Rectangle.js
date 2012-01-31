/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Rectangle.js
 * The Rectangle Addin
 * 
 * p0-p1
 * |  |
 * p3-p2
 * Copyright (c) 2012 Schel Scivally. All rights reserved.
 * 
 * @author    Schell Scivally
 * @since    Thu Jan 12 13:07:30 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Rectangle',
    dependencies : [ 'Geom/Polygon.js', 'Geom/Point.js', 'Geom/Size.js' ],
    init : function initRectangle (m) {
        /**
         * Initializes the Rectangle Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinRectangle (self) {
            /**
             * Adds Rectangle properties to *self*.
             * @param - self Object - The object to add Rectangle properties to.
             * @return self Rectangle 
             */
            // Addin Polygon
            self = m.Polygon(self); 
            
            if (self.points.length === 0) {
                self.points = addin.from(0, 0, 0, 0).points;
            }
            //--------------------------------------
            //  FUNCTIONS
            //--------------------------------------
            m.safeAddin(self, 'origin', function Rectangle_origin() {
                /** * *
                * Returns the origin of the Rectangle.
                * @returns - Point
                * * **/
                return self.points[0].copy();
            });
            m.safeAddin(self, 'size', function Rectangle_size() {
                /** * *
                * Returns the size of the Rectangle.
                * @returns - Size
                * * **/
                var tl = self.origin();
                var br = self.points[2];
                var w = br.x() - tl.x();
                var h = br.y() - tl.y();
                return m.Size.from(w, h);
            });
            m.safeAddin(self, 'isEqualTo', function Rectangle_isEqualTo (rectangle) {
                /**
                 * Returns whether or not *rectangle* is equal to self.
                 * @param - rectangle Rectangle
                 * @return - Boolean
                 */
                return self.origin().isEqualTo(rectangle.origin()) && self.size().isEqualTo(rectangle.size());
            });
            m.safeOverride(self, 'copy', 'polygon_copy', function Rectangle_copy() {
                /**
                 * Returns a copy of self.
                 * @return - Rectangle
                 */
                var r = self.polygon_copy();
                addin(r);
                return r;
            });

            m.safeAddin(self, 'left', function Rectangle_left () {
                /**
                 * Returns the left edge x value.
                 * @return - Number
                 */
                return self.origin().x();
            });

            m.safeAddin(self, 'top', function Rectangle_top () {
                /**
                 * Returns the top edge y value.
                 * @return - Number
                 */
                return self.origin().y();
            });
            
            self.addToString(function Rectangle_toString () {
                return '[Rectangle(x:'+self.left()+' y:'+self.top()+' w:'+self.size().width()+' h:'+self.size().height()+')]';
            });

            m.safeAddin(self, 'right', function Rectangle_right () {
                /**
                 * Returns the right edge x value.
                 * @return - Number
                 */
                return self.points[1].x();
            });

            m.safeAddin(self, 'bottom', function Rectangle_bottom () {
                /**
                 * Returns the bottom edge y value.
                 * @return - Number
                 */
                return self.points[2].y();
            });
            
            m.safeAddin(self, 'area', function Rectangle_area () {
                /**
                 * Returns the area (in pixels^2) of this rectangle
                 * @return - Number
                 */
                return self.size().width() * self.size().height();
            });

            m.safeAddin(self, 'union', function Rectangle_union (rectangle) {
                /**
                 * Returns a rectangle that is a union between *self* and *rectangle*.
                 * @param - rectangle Rectangle - a rectangle to add to self.
                 * @return - Rectangle
                 */
                var left = Math.min(self.left(), rectangle.left());
                var top = Math.min(self.top(), rectangle.top());
                var width = Math.max(self.right(), rectangle.right()) - left;
                var height = Math.max(self.bottom(), rectangle.bottom()) - top;
                
                return addin.from(left, top, width, height);
            });

            m.safeAddin(self, 'section', function Rectangle_section (cutObj) {
                /**
                 * Sections self into sub-rectangles, cut vertically at
                 * x-positions listed in *cutObj.verticallyAt* and y-positions
                 * listed in *cutObj.horizontallyAt*
                 * 
                 * @param cutObj - an object, {
                 *     verticallyAt : [],
                 *     horizontallyAt : []
                 * }
                 * @return - Array - An array of rectangles representing the resulting sections.
                 */
                cutObj = m.ifndefInitObj(cutObj, {
                    verticallyAt : [],
                    horizontallyAt : []
                });
                cutObj.verticallyAt.unshift(0);
                cutObj.verticallyAt.push(self.size().width());
                cutObj.horizontallyAt.unshift(0);
                cutObj.horizontallyAt.push(self.size().height());
                var verticals = (cutObj.verticallyAt.length - 1);
                var horizontals = (cutObj.horizontallyAt.length - 1);
                var sections = [];
                var x, y, w, h;
                for (var j = 0; j < horizontals; j++) {
                    for (var i = 0; i < verticals; i++) {
                        x = self.left() + cutObj.verticallyAt[i];
                        y = self.top() + cutObj.horizontallyAt[j];
                        w = cutObj.verticallyAt[i+1] - cutObj.verticallyAt[i];
                        h = cutObj.horizontallyAt[j+1] - cutObj.horizontallyAt[j];
                        var section = addin.from(x, y, w, h);
                        sections.push(section);
                    }
                }
                return sections;
            });

            return self;
        };
        
        addin.from = function Rectangle_from (x, y, w, h) {
            /** * *
            * Returns a new Rectangle with dimensions *x*,*y*,*w*,*h*.
            * @param - x Number - The x position.
            * @param - y Number - The y position.
            * @param - w Number - The width.
            * @param - h Number - The height
            * @return - Rectangle
            ** * */
            x = m.ifndefInitNum(x, 0);
            y = m.ifndefInitNum(y, 0);
            w = m.ifndefInitNum(w, 0);
            h = m.ifndefInitNum(h, 0);
             
            return addin({
                points : [
                    m.Point.from(x, y),
                    m.Point.from(x+w, y),
                    m.Point.from(x+w, y+h),
                    m.Point.from(x, y+h)
                ]
            });
        };
        
        addin.fromTwoPoints = function Rectangle_fromTwoPoints (p1, p2) {
            /**
             * Creates a Rectangle using two points as opposing corners of the rectangle.
             * @param - p1 Point - The first point defining the rectangle.
             * @param - p2 Point - The second point defining the rectangle.
             * @return - Rectangle
             */
            p1 = m.ifndefInitObj(p1, m.Point());
            p2 = m.ifndefInitObj(p2, m.Point());
            
            var x, y, w, h;
            x = 0;
            y = 0;
            w = 0;
            h = 0;
            if (p1.x() < p2.x()) {
                x = p1.x();
                w = p2.x() - p1.x();
            } else {
                x = p2.x();
                w = p1.x() - p2.x();
            }
            if (p1.y() < p2.y()) {
                y = p1.y();
                h = p2.y() - p1.y();
            } else {
                y = p2.y();
                h = p1.y() - p2.y();
            }
            
            return addin.from(x, y, w, h);
        };
        
        return addin;
        
    }
});
