/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Mesh.js
* A vector of points in 3 space.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Sat Jun  9 14:34:13 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Mesh',
    dependencies : [ 'bang::Geometry/Vector.js' ],
    /** * *
    * Initializes the Mesh object constructor.
    * @param {function} Vector The Vector constructor function.
    * * **/
    init : function MeshFactory (Vector) {
        /** * *
        * Creates a new mesh.
        * @constructor
        * * **/
        function Mesh() {
            var args = Array.prototype.slice.call(arguments);
            Vector.prototype.constructor.apply(this, args);
        }
        
        Mesh.prototype = new Vector();
        
        Mesh.prototype.constructor = Mesh;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        
        
        return Mesh;
    }
});