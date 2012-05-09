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
            var children = [];
            for (var i=0; i < this.displayList.length; i++) {
                var child = this.displayList[i];
                children.push(child);
                while (child.parent) {
                    children = children.concat(child.displayList);
                }
            }
            return children;
        };
        /** * *
        * Draws this stage and its subviews into the given context.
        * @param {CanvasRenderingContext2D}
        * * **/
        Stage.prototype.draw = function Stage_draw(context) {
            context.clearRect(0, 0, this.width, this.height);
            m.View.prototype.draw.call(this, context);
        };
        /** * *
        * Redraws portions of this view and its subviews that have changed
        * since the last draw or redraw into the given context.
        * @param {CanvasRenderingContext2D}
        * * **/
        Stage.prototype.redraw = function Stage_redraw(context) {
            
        };
        
        return Stage;
    }
});
