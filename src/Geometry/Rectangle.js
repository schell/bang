/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Rectangle.js
* The Rectangle type.
*
* p0-p1
* |  |
* p3-p2
*
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Apr 24 20:18:08 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Rectangle',
    dependencies : [ 'bang::Geometry/Polygon.js' ],
    init : function initRectangle (m) {
        /** * *
        * Initializes the Rectangle type.
        * @param {Object} The mod modules object.
        * * **/
        
        function Rectangle(x,y,w,h) {
            /** * *
            * Creates a new rectangle at (x,y) with width w and height h.
            * @param number
            * @param number
            * @param number
            * @param number
            * @return Rectangle
            * @nosideeffects
            * * **/
            x = x || 0;
            y = y || 0;
            w = w || 0;
            h = h || 0;
            
            this.left(x);
            this.top(y);
            this.width(w);
            this.height(h);
            this.length = 8;
        }
        
        Rectangle.prototype = new m.Polygon();
        
        Rectangle.prototype.constructor = Rectangle;
        
        Rectangle.prototype.toString = function Rectangle_toString() {
            return 'Rectangle['+this.left()+','+this.top()+','+this.width()+','+this.height()+']';
        };
        
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        Rectangle.prototype.left = function Rectangle_left(l) {
            /** * *
            * Gets and sets the left edge x value.
            * @param number
            * @return number
            ** * */
            if (typeof l === 'number') {
                this[0] = l;
                this[6] = l;
            }
            return this[0];
        };
        
        Rectangle.prototype.top = function Rectangle_top(t) {
            /** * *
            * Gets and sets the top edge y value.
            * @param number
            * @return number
            ** * */
            if (typeof t === 'number') {
                this[1] = t;
                this[3] = t;
            }
            return this[1];
        };
        
        Rectangle.prototype.right = function Rectangle_right(r) {
            /** * *
            * Gets and sets the right edge x value.
            * @param number
            * @return number
            * * **/
            if (typeof r === 'number') {
                this[2] = r;
                this[4] = r;
            }
            return this.left() + this.width();
        };

        Rectangle.prototype.bottom = function Rectangle_bottom(b) {
            /** * *
            * Gets and sets the bottom edge y value.
            * @param number
            * @return number
            * * **/
            if (typeof b === 'number') {
                this[5] = b;
                this[7] = b;
            }
            return this.top() + this.height();
        };
        
        Rectangle.prototype.width = function Rectangle_width(w) {
            /** * *
            * Gets and sets the width of this Rectangle.
            * @param number
            * @return number
            * * **/
            if (typeof w === 'number') {
                var x = this.left() + w;
                this[2] = x;
                this[4] = x;
            }
            return this[2] - this[0];
        };
        
        Rectangle.prototype.height = function Rectangle_height(h) {
            /** * *
            * Returns the height of this Rectangle
            * @param number
            * @return number
            * * **/
            if (typeof h === 'number') {
                var y = this.top() + h;
                this[5] = y;
                this[7] = y;
            }
            return this[5] - this[1];
        };
        
        Rectangle.prototype.area = function Rectangle_area () {
            /** * *
            * Returns the area (in pixels^2) of this rectangle
            * @return number
            * @nosideeffects
            * * **/
            return this.width() * this.height();
        };
        
        Rectangle.prototype.intersectsRectangle = function Rectangle_intersectsRectangle(r) {
            /** * *
            * Returns whether or not this rectangle intersects rectangle r.
            * Rectangles that share the same edge are considerend NOT intersecting.
            * @param - Rectangle
            * @return boolean
            * @nosideeffects
            * * **/
            return !(this.left() >= r.right() || 
                     r.left() >= this.right() || 
                     this.top() >= r.bottom() || 
                     r.top() >= this.bottom());
        };
            
        Rectangle.prototype.containsRectangle = function Rectangle_contains(r) {
            /** * *
            * Returns whether or not this rectangle contains rectangle r.
            * If rectangle r is equal it is considered contained within this rectangle (and visa versa).
            * @param Rectangle
            * @return boolean
            * @nosideeffects
            * * **/
            return this.left() <= r.left() && this.top() <= r.top() && this.right() >= r.right() && this.bottom() >= r.bottom();
        };
        
        Rectangle.prototype.intersectionWith = function Rectangle_intersectionWith(r) {
            /** * *
            * Returns the intersection of this rectangle with rectangle r. If the rectangles
            * Returns false if r does not intersect.
            * @param {Rectangle}
            * @return {Rectangle|false}
            * * **/
            if (this.intersectsRectangle(r)) {
                return new m.Rectangle();
            }
            return false;
        };
        /** * *
        * Returns whether or not this rectangle contains point.
        * @param {Vector}
        * @return {boolean}
        * * **/
        Rectangle.prototype.containsPoint = function Rectangle_containsPoint(point) {
            return (this.left() <= point.x() && this.right() >= point.x() &&
                this.top() <= point.y() && this.bottom() >= point.y());
        };
        /** * *
        * Returns a polygon clipped by this rectangle using a Sutherland-Hodgeman Algorithm.
        * https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm
        * http://www.aftermath.net/articles/clippoly/index.html
        * @param {Polygon}
        * @return {Polygon}
        * * **/
        Rectangle.prototype.clipPolygon = function Rectangle_clipPolygon(polygon) {
            var CP_LEFT = 0;
            var CP_RIGHT = 1;
            var CP_TOP = 2;
            var CP_BOTTOM = 3;
            
            function cp_inside(p, r, side) {
                switch(side) {
                    case CP_LEFT:
                        return p.x() >= r.left();
                    case CP_RIGHT:
                        return p.x() <= r.right();
                    case CP_TOP:
                        return p.y() >= r.top();
                    case CP_BOTTOM:
                        return p.y() <= r.bottom();
                }
            }
            
            function cp_intersect(p, q, r, side) {
                function isfinite(n) {
                    return Math.abs(n) !== Number.POSITIVE_INFINITY;
                }
                
                var t = new m.Vector(0, 0);
                var a, b;

                /* find slope and intercept of segment pq */
                a = ( q.y() - p.y() ) / ( q.x() - p.x() );
                b = p.y() - p.x() * a;

                switch(side) {
                    case CP_LEFT:
                        t.x(r.left());
                        t.y(t.x() * a + b);
                        break;
                    case CP_RIGHT:
                        t.x(r.right());
                        t.y(t.x() * a + b);
                        break;
                    case CP_TOP:
                        t.y(r.top());
                        t.x(isfinite(a) ? ( t.y() - b ) / a : p.x());
                        break;
                    case CP_BOTTOM:
                        t.y(r.bottom());
                        t.x(isfinite(a) ? ( t.y() - b ) / a : p.x());
                        break;
                }

                return t;
            }
            
            function cp_clipplane(vec, r, side) {
                var n, i, j=0, s, p, out, intersection;
                
                n = vec.length/2;
                out = new m.Polygon();
                s = vec.pointAt(n-1);
                
                for(i = 0 ; i < n; i++ ) {
                    p = vec.pointAt(i);

                    if( cp_inside( p, r, side ) ) {
                        // Point p is inside...
                        if( !cp_inside( s, r, side ) ) {
                            // p is inside and s is outside
                            intersection = cp_intersect( p, s, r, side );
                            if (!intersection.isEqualTo(p)) {
                                // We don't want doubles in our output set...
                                out.push(intersection[0]);
                                out.push(intersection[1]);
                            }
                        }
                        out.push(p[0]);
                        out.push(p[1]);
                    } else if( cp_inside( s, r, side ) ) {
                        // s is inside and p is outside
                        intersection = cp_intersect( p, s, r, side );
                        out.push(intersection[0]);
                        out.push(intersection[1]);
                    }
                    s = p;
                }
                return out;
            }
            
            function clippoly(poly, r) {
                poly = cp_clipplane(poly, r, CP_LEFT);
                poly = cp_clipplane(poly, r, CP_RIGHT);
                poly = cp_clipplane(poly, r, CP_TOP);
                poly = cp_clipplane(poly, r, CP_BOTTOM);
                return poly;
            }
            
            return clippoly(polygon, this);
        };
        
        Rectangle.reduceRectangles = function Rectangle_reduceRectangles(rectangles) {
            /** * *
            * Returns a new set of rectangles that do not intersect, that occupy the
            * same space as the original.
            * @param Array
            * @return Array
            * @nosideeffects
            * * **/
            function bundleRectangles(rectangles) {
                /** * *
                * Bundles and sorts rectangles by vertical edges.
                * @param Array
                * @nosideeffects
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
                var newScan = new m.Rectangle(e.x, el.top(), 0, el.height());
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
                                    intersected = new m.Rectangle(e.x, t, 0, b - t);
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
                                                // We don't want to compare a scan to itthis...
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
        
        return Rectangle;
    }
});