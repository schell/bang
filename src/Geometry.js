/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Geometry.js
 *    The Geom Addin (mostly just for pulling in scripts from Geom)
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 18:59:51 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Geometry',
    dependencies : [ 'bang::Global.js', 'bang::Geom/Point.js', 'bang::Geom/Polygon.js', 'bang::Geom/Rectangle.js', 'bang::Geom/Vector.js', 'bang::Geom/Matrix.js' ],
    init : function initGeom (m) {
        /**
         * Imports geometry addins and exports some math constants.
         * @param - m Object - The mod modules object.
         */
        return {
            TAO : 6.28318531,
            ONE_DEGREE : 0.0174532925
        };
        
    }
});
