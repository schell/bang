/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Stage.js
* The Stage Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Sat Jan 21 17:38:39 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Stage',
    dependencies : [ 'bang::View/View.js' ],
    /** * *
    * Initializes Stage type
    * @param {Object} 
    * @return {function(number, number)}
    * * **/
    init : function initStage (m) {
        /** * *
        * Creates a new Stage view object.
        * @param {number=}
        * @param {number=}
        * * **/
        function Stage(width, height) {
            m.View.call(this, 0, 0, width, height);
            
            /** * *
            * A flattened version of the display list at its last
            * clean state. Compiled after the last draw. Mostly used
            * to map children to their previous boundaries.
            * @type {Array.<View>}
            * * **/
            this.cleanViews = [];
            /** * *
            * A list of objects that store the clean state of a view.
            * @type {Array.<Object>}
            * * **/
            this.viewPackages = [];
            /** * *
            * A list of rectangular areas that were redrawn during the last redraw.
            * @type {Array.<Rectangle>}
            * * **/
            this.redraws = [];
        }
        
        Stage.prototype = new m.View();
        
        Stage.prototype.constructor = Stage;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns a flattened list of all this view's subviews.
        * @return {Array.<View>}
        * * **/
        Stage.prototype.children = function Stage_children() {
            var children = [this];
            for (var i=0; i < children.length; i++) {
                var child = children[i];
                if (child.displayList.length) {
                    // Splice the child's displayList into children
                    // after child, so its children will be checked
                    // next...
                    Array.prototype.splice.apply(children, [i+1, 0].concat(child.displayList));
                }
            }
            return children;
        };
        /** * *
        * A list of View properties that affect its boundaries.
        * @type {Array.<string>}
        * * **/
        var boundaryProperties = [
            'x',
            'y',
            'scaleX',
            'scaleY',
            'rotation',
            'alpha'
        ];
        /** * *
        * Packages a view and its current (hopefully clean) state.
        * @param {View}
        * @return {Object}
        * * **/
        function packageView(view) {
            var pkg = {};
            // Copy all those properties that may affect the views
            // boundaries, so we can check them at the next redraw...
            for (var i=0; i < boundaryProperties.length; i++) {
                var property = boundaryProperties[i];
                pkg[property] = view[property];
            }
            pkg.transform = view.globalTransform();
            
            // Get the containing boundary of this view...
            // The view may be rotated, and we want a rectangle
            // that contains the transformed boundary...
            var polygon = pkg.transform.transformPolygon(view.localBoundary());
            var r = new m.Rectangle(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY);
            r.right(Number.NEGATIVE_INFINITY);
            r.bottom(Number.NEGATIVE_INFINITY);
            for (var j=0; j < polygon.length; j+=2) {
                var x = polygon[j];
                var y = polygon[j+1];
                if (x < r.left()) {
                    r.left(x);
                }
                if (x > r.right()) {
                    r.right(x);
                }
                if (y < r.top()) {
                    r.top(y);
                }
                if (y > r.bottom()) {
                    r.bottom(y);
                }
            }
            pkg.boundary = r;
            pkg.view = view;
            
            return pkg;
        }
        /** * *
        * Draws this stage and its subviews into the given context.
        * @param {CanvasRenderingContext2D}
        * * **/
        Stage.prototype.draw = function Stage_draw(context) {
            context = context || this.context;
            
            context.save();
            // Clear the entire stage...
            context.clearRect(0, 0, this.width, this.height);
            // Get the flattened list of children (which includes this stage)
            var children = this.children();
            var viewPackages = [];
            for (var i=0; i < children.length; i++) {
                var viewPackage = packageView(children[i]);
                var view = viewPackage.view;
                var transform = viewPackage.transform;
                // Update the context's transformation...
                context.setTransform.apply(context, transform.abdegh());
                // Draw dem pixels!
                context.drawImage(view.canvas, 0, 0);
                // These pipes......are CLEEAAAN!!!
                view.isDirty = false;
                viewPackages.push(viewPackage);
            }
            context.restore();
            // Update our drawing properties...
            this.cleanViews = children;
            this.viewPackages = viewPackages;
            this.isDirty = false;
        };
        /** * *
        * Redraws portions of this view and its subviews that have changed
        * since the last draw or redraw into the given context.
        * @param {CanvasRenderingContext2D}
        * * **/
        Stage.prototype.redraw = function Stage_redraw(context) {
            context = context || this.context;
            
            if (this.isDirty || this.viewPackages.length <= 1) {
                // Just draw the whole thing over again...
                return this.draw(context);
            }
            
            // Get our new flattened display list...
            var children = this.children();
            var redraws = [];
            var viewPackages = [];
            var i,j,view;
            for (i=0; i < children.length; i++) {
                view = children[i];
                var pkg = packageView(view);
                // Get the ndx of the view in the display list from the last clean state...
                var ndx = this.cleanViews.indexOf(view);
                if (ndx === -1 || view.isDirty) {
                    // This is either a new view that has just been added
                    // or the view's context was drawn into using an aliased function...
                    redraws.push(pkg.boundary);
                } else if (!view.isDirty) {
                    var lastPkg = this.viewPackages[ndx];
                    // Check to see if any view properties have changed...
                    for (j=0; j < boundaryProperties.length; j++) {
                        var property = boundaryProperties[j];
                        if (view[property] !== lastPkg[property]) {
                            // Push the old boundary and the new boundary up...
                            redraws.push(lastPkg.boundary);
                            redraws.push(pkg.boundary);
                        }
                    }
                }
                // Now that we've collected our dirty rectangles, let's update the view
                // and store our new package...
                view.isDirty = false;
                viewPackages.push(pkg);
            }    
            
            // Update the stage's draw properties...
            this.viewPackages = viewPackages;
            this.redraws = m.Rectangle.reduceRectangles(redraws);
            
            // Now go through and actually do some drawing!
            context.save();
            for (i=0; i < this.redraws.length; i++) {
                var r = this.redraws[i];
                // Clear the draw area...
                context.clearRect(r.x(),r.y(),r.width(),r.height());
                // This can be greatly improved by storing
                // views in a quadtree and doing a query for a list
                // of views affected by each redraw rectangle, but
                // for now we're just brute forcing and running through
                // the entire list...
                for (j=0; j < this.viewPackages.length; j++) {
                    viewPkg = this.viewPackages[j];
                    view = viewPkg.view;
                    if (viewPkg.boundary.intersectsRectangle(r)) {
                        // A portion of this rectangle needs to be redrawn...
                        // Get the redraw rectangle in the view's local coords...
                        var lr = view.vectorToLocal(r);
                        // Clip the redraw polygon (cuz it could be a rotated rectangle)...
                        var redrawPoly = view.localBoundary().clipPolygon(lr);
                        if (redrawPoly.length <= 2) {
                            // This is not a polygon...
                            continue;
                        }
                        // Apply the global transform to the drawing context, so now
                        // we're in this view's local coordinates, which match our
                        // redraw polygon...
                        context.setTransform.apply(context, viewPkg.transform.abdegh());
                        // Create a pattern for this view so we can draw the polygon path...
                        var pattern = this.context.createPattern(view.canvas, 'no-repeat');
                        // Draw the polygon!
                        context.fillStyle = pattern;
                        context.beginPath();
                        context.moveTo(redrawPoly[0], redrawPoly[1]);
                        for (var k=2; k < redrawPoly.length; k+=2) {
                            context.lineTo(redrawPoly[k], redrawPoly[k+1]);
                        }
                        context.closePath();
                        context.fill();
                    }
                }
            }
            context.restore();
            
            this.isDirty = false;
        };
        
        return Stage;
    }
});
