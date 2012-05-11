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
            * @type {Array.<object>}
            * * **/
            this.viewPackages = [];
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
        * @return {object}
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
            context.save();
            // Clear the entire stage...
            context.clearRect(0, 0, this.width, this.height);
            // Get the flattened list of children (which includes this stage)
            var children = this.children();
            // Just make whole new clean views and view packages...
            this.cleanViews = children;
            this.viewPackages = [];
            for (var i=0; i < children.length; i++) {
                var viewPackage = packageView(children[i]);
                var view = viewPackage.view;
                var transform = viewPackage.transform;
                // Update the context's transformation...
                context.setTransform(transform.a(), transform.b(), transform.d(), transform.e(), transform.g(), transform.h());
                // Draw dem pixels!
                context.drawImage(view.canvas, 0, 0);
                // These pipes......are CLEEAAAN!!!
                view.isDirty = false;
                this.viewPackages.push(viewPackage);
            }
            context.restore();
        };
        /** * *
        * Redraws portions of this view and its subviews that have changed
        * since the last draw or redraw into the given context.
        * @param {CanvasRenderingContext2D}
        * * **/
        Stage.prototype.redraw = function Stage_redraw(context) {
            if (this.isDirty) {
                // Just draw the whole thing over again...
                return this.draw(context);
            }
        };
        
        return Stage;
    }
});
