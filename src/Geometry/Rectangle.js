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
    dependencies : [ 'bang::Geometry/Polygon.js', 'bang::Geometry/Point.js', 'bang::Geometry/Size.js' ],
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
            
            if (self.elements.length === 0) {
                self.elements = addin.from(0, 0, 0, 0).elements;
            }
            //--------------------------------------
            //  FUNCTIONS
            //--------------------------------------
            m.safeOverride(self, 'copy', 'polygon_copy', function Rectangle_copy() {
                /**
                 * Returns a copy of self.
                 * @return - Rectangle
                 */
                var r = self.polygon_copy();
                addin(r);
                return r;
            });
            m.safeOverride(self, 'left', 'polygon_left', function Rectangle_left (l) {
                /** * *
                * Gets and sets the left edge x value.
                * @param - Number
                * @return - Number
                ** * */
                if (typeof l === 'number') {
                    self.elements[0] = l;
                    self.elements[6] = l;
                }
                return self.elements[0];
            });

            m.safeOverride(self, 'top', 'polygon_top', function Rectangle_top (t) {
                /** * *
                * Gets and sets the top edge y value.
                * @param - Number
                * @return - Number
                ** * */
                if (typeof t === 'number') {
                    self.elements[1] = t;
                    self.elements[3] = t;
                }
                return self.elements[1];
            });
            m.safeAddin(self, 'origin', function Rectangle_origin() {
                /** * *
                * Returns a Point at the upper left of the rectangle.
                * @return - Point
                * * **/
                return m.Point.from(self.left(), self.top());
            });
            m.safeAddin(self, 'width', function Rectangle_width(w) {
                /** * *
                * Gets and sets the width of this Rectangle.
                * @param - Number
                * @return - Number
                * * **/
                if (typeof w === 'number') {
                    var x = self.left() + w;
                    self.elements[2] = x;
                    self.elements[4] = x;
                }
                return self.elements[2] - self.elements[0];
            });
            m.safeAddin(self, 'height', function Rectangle_height(h) {
                /** * *
                * Returns the height of this Rectangle
                * @param - Number
                * @return - Number
                * * **/
                if (typeof h === 'number') {
                    var y = self.top() + h;
                    self.elements[5] = y;
                    self.elements[7] = y;
                }
                return self.elements[5] - self.elements[1];
            });
            
            self.toString = function Rectangle_toString () {
                return '[Rectangle(x:'+self.left()+' y:'+self.top()+' w:'+self.width()+' h:'+self.height()+')]';
            };

            m.safeOverride(self, 'right', 'polygon_right', function Rectangle_right (r) {
                /** * *
                * Gets and sets the right edge x value.
                * @param - Number
                * @return - Number
                * * **/
                if (typeof r === 'number') {
                    self.elements[2] = r;
                    self.elements[4] = r;
                }
                return self.left() + self.width();
            });

            m.safeOverride(self, 'bottom', 'polygon_bottom', function Rectangle_bottom (b) {
                /** * *
                * Gets and sets the bottom edge y value.
                * @param - Number
                * @return - Number
                * * **/
                if (typeof b === 'number') {
                    self.elements[5] = b;
                    self.elements[7] = b;
                }
                return self.top() + self.height();
            });
            
            m.safeAddin(self, 'area', function Rectangle_area () {
                /**
                 * Returns the area (in pixels^2) of this rectangle
                 * @return - Number
                 */
                return self.width() * self.height();
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
                cutObj.verticallyAt.push(self.width());
                cutObj.horizontallyAt.unshift(0);
                cutObj.horizontallyAt.push(self.height());
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
            
            m.safeAddin(self, 'intersectsRectangle', function Rectangle_intersects(r) {
                /** * *
                * Returns whether or not this rectangle intersects rectangle r.
                * Rectangles that share the same edge are considerend NOT intersecting.
                * @param - Rectangle
                * @return Boolean
                * * **/
                return !(self.left() >= r.right() || 
                         r.left() >= self.right() || 
                         self.top() >= r.bottom() || 
                         r.top() >= self.bottom());
            });
            
            m.safeAddin(self, 'containsRectangle', function Rectangle_contains(r) {
                /** * *
                * Returns whether or not this rectangle contains rectangle r.
                * If rectangle r is equal it is considered contained within this rectangle (and visa versa).
                * @param - Rectangle
                * @return Boolean
                * * **/
                return self.left() <= r.left() && self.top() <= r.top() && self.right() >= r.right() && self.bottom() >= r.bottom();
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
                elements : [
                    x,   y,
                    x+w, y,
                    x+w, y+h,
                    x,   y+h
                ]
            });
        };
        
        addin.fromTwoPoints = function Rectangle_fromTwoPoints(p1, p2) {
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
        
        addin.reduceRectangles = function Rectangle_reduceRectangles(rectangles) {
            /** * *
            * Returns a new set of rectangles that do not intersect, that occupy the
            * same space as the original.
            * @return Array
            * * **/
            function bundleRectangles(rectangles) {
                /** * *
                * Bundles and sorts rectangles by vertical edges.
                * @param Array
                * * **/
                var output = [];
                for (var i=0; i < rectangles.length; i++) {
                    var rect = rectangles[i];
                    output.push({
                        id : i,
                        type : 's',
                        x : rect.left(),
                        intersections : [],
                        rectangle : rect
                    });
                    output.push({
                        id : i,
                        type : 'e',
                        x : rect.right(),
                        intersections : [],
                        rectangle : rect
                    });
                }
                function compareX(n1, n2) {
                    var diff = n1.x - n2.x;
                    if (diff === 0) {
                        return n1.top - n2.top;
                    }
                    return diff;
                }
                output.sort(compareX);
                return output;
            }
                    
            // We're going to need this function during end events...
            function mapIntersectionToScan(el) {
                var newScan = m.Rectangle.from(e.x, el.top(), 0, el.height());
                newScan.intersects = [el];
                return newScan;
            }
                        
            var input = rectangles.slice();
            var events = bundleRectangles(input);
            var current = [];
            var scans = [];
            var output = [];
            var i,j,k,l,scan,currentRect;
                        
            for (i=0; i < events.length; i++) {
                var e = events[i];
                            
                // Update the current scans...
                for (j=0; j < scans.length; j++) {
                    scan = scans[j];
                    scan.right(e.x);
                }
                            
                if (e.type === 's') {
                    var contained = false;
                    for (j=0; j < current.length; j++) {
                        currentRect = current[j];
                        if (currentRect.containsRectangle(e.rectangle)) {
                            contained = true;
                            break;
                        }
                    }
                    if (!contained) {
                        // This event should start a new rectangle (at some point)...
                        current.push(e.rectangle);
                        var intersected = false;
                        for (j=0; j < scans.length; j++) {
                            scan = scans[j];
                            if (!(e.rectangle.top() >= scan.bottom() || scan.top() >= e.rectangle.bottom())) {
                                // The scan and event intersect in y...
                                if ((e.rectangle.top() >= scan.top() && e.rectangle.bottom() <= scan.bottom())) {
                                    // This scan contains the event's rectangle, so we don't need to make a new scan
                                    // but we will need to know that it intersects...
                                    scan.intersects.push(e.rectangle);
                                    contained = true;
                                    continue;
                                }
                                // We have to check if it has a width, if not, it was added by an earlier intersection
                                // during this event...
                                if (scan.width()) {
                                    // This scan was from an earlier event, so output a rectangle...
                                    output.push(scan);
                                }
                                // Replace this scan with a scan that represents the intersection...
                                var t = Math.min(e.rectangle.top(), scan.top());
                                var b = Math.max(e.rectangle.bottom(), scan.bottom());
                                if (intersected) {
                                    // We've already created one intersection, so group it with this one...
                                    intersected.top(Math.min(intersected.top(), t));
                                    intersected.bottom(Math.max(intersected.bottom(), b));
                                    intersected.intersects = intersected.intersects.concat(scan.intersects);
                                } else {
                                    intersected = m.Rectangle.from(e.x, t, 0, b - t);
                                    intersected.intersects = scan.intersects.concat([e.rectangle]);
                                }
                                // Get rid of the current scan...
                                scans.splice(j--, 1);
                            }
                        }
                        if (!contained) {
                            // This rectangle is not contained by a current scan either...
                            if (!intersected) {
                                // This event starts a new non-overlapping rectangle...
                                var r = e.rectangle.copy();
                                r.intersects = [e.rectangle];
                                scans.push(r);
                            } else {
                                scans.push(intersected);
                            }
                        }
                    }
                } else {
                    // This is an end event...
                    for (j=0; j < current.length; j++) {
                        currentRect = current[j];
                        if (currentRect.isEqualTo(e.rectangle)) {
                            current.splice(j, 1);
                            break;
                        }
                    }
                    
                    for (j=0; j < scans.length; j++) {
                        scan = scans[j];
                        // Find the scan that intersects this end event...
                        if (scan.intersects.length === 1 && scan.top() === e.rectangle.top() && scan.bottom() === e.rectangle.bottom()) {
                            // This end event corresponds specifically to this scan, so output it...
                            output.push(scan);
                            scans.splice(j--, 1);
                        } else {
                            // We're going to have to break this scan up into subscans...
                            var ndx = scan.intersects.indexOf(e.rectangle);
                            if (ndx !== -1) {
                                // Output the scan, because we have to change it...
                                output.push(scan);
                                // Remove this rectangle from the intersecting scan...
                                scan.intersects.splice(ndx, 1);
                                // Remove the scan from our scans...
                                scans.splice(j, 1);
                                if (scan.intersects.length) {
                                    // Make some new scans to replace the old one...
                                    var newScans = scan.intersects.map(mapIntersectionToScan);
                                    // Iterate through the new scans and collect them together if they overlap...
                                    var newScanNdx = 0;
                                    while (newScans.length > 1 && newScanNdx < newScans.length) {
                                        var intersection = newScans[newScanNdx++];
                                        for (l=0; l < newScans.length; l++) {
                                            if (l === newScanNdx-1) {
                                                // We don't want to compare a scan to itself...
                                                continue;
                                            }
                                            var newScan = newScans[l];
                                            if (!(newScan.top() > intersection.bottom() || intersection.top() > newScan.bottom())) {
                                                // The two overlap, so absorb the intersection scan into this scan...
                                                intersection.top(Math.min(newScan.top(), intersection.top()));
                                                intersection.bottom(Math.max(newScan.bottom(), intersection.bottom()));
                                                intersection.intersects = newScan.intersects.concat(intersection.intersects);
                                                // Now we have to test this scan against the others again, since it has changed...
                                                newScans.splice(l, 1);
                                                newScanNdx = 0;
                                                break;
                                            }
                                        }
                                    }
                                    // Add the new scans to scans...
                                    scans = scans.concat(newScans);
                                }
                                break;
                            }
                        }
                    }
                }
            }
            // Concat the remaining scans in there...
            return output.concat(scans);
        };
        
        return addin;
    }
});
