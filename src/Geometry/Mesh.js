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
    * @param 
    * * **/
    init : function MeshFactory () {
        /** * *
        * 
        * @constructor
        * * **/
        function Mesh() {
            
        }
        
        Mesh.prototype = {};
        
        Mesh.prototype.constructor = Mesh;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        
        
        return Mesh;
    }
});