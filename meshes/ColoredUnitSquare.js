/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* 
* A colored square.
* Copyright (c) Schell Scivally. All rights reserved.
* 
* @author	Schell Scivally
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'ColoredUnitSquare',
    dependencies : [ 'bang3d::Geometry/Mesh.js' ],
    /** * *
    * Initializes the ColoredUnitSquare object constructor.
    * @param {function} Mesh The Mesh object constructor.
    * * **/
    init : function ColoredUnitSquareFactory (Mesh) {
        /** * *
        * Creates a colored unit square mesh.
        * @constructor
        * * **/
        function ColoredUnitSquare() {
        	Mesh.prototype.constructor.call(this,
                // positions        // colors
                1.0,  1.0,  0.0,    1.0, 1.0, 1.0, 1.0,
                -1.0, 1.0,  0.0,    0.0, 1.0, 1.0, 1.0,
                1.0,  -1.0, 0.0,    1.0, 0.0, 1.0, 1.0,
                
                -1.0, 1.0,  0.0,    0.0, 1.0, 1.0, 1.0,
                1.0,  -1.0, 0.0,    1.0, 0.0, 1.0, 1.0,
                -1.0, -1.0, 0.0,    0.0, 0.0, 1.0, 1.0
        	)
        }
        
        ColoredUnitSquare.prototype = new Mesh();

        ColoredUnitSquare.prototype.constructor = ColoredUnitSquare;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        return ColoredUnitSquare;
    }
});
