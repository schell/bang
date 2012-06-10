/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* GLView.js
* A View in 3d space. 
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed May 30 16:08:45 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'GLView',
    dependencies : [ 'bang::View/View.js' ],
    /** * *
    * Initializes the GLView object constructor.
    * @param {function} View The View constructor.
    * * **/
    init : function GLViewFactory (View) {
        /** * *
        * Creates a new GLView. By default a GLView's mesh will be a flat triangle
        * at the origin of 3d space. The GLView's context property is used as the texture 
        * of the object, so you can draw directly into the view, using the view's local
        * coordinates.
        * @param {Mesh} mesh
        * @constructor
        * * **/
        function GLView(x, y, z, mesh) {
            this.mesh = mesh || new Mesh(
                0, 0, 0,
                1, 0, 0,
                0, 1, 0
            );
        }
        
        GLView.prototype = {};
        
        GLView.prototype.constructor = GLView;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        
        
        return GLView;
    }
});