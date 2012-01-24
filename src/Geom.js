/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Geom.js
 *    The Geom Addin (mostly just for pulling in scripts from Geom/*)
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 18:59:51 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Geom',
    dependencies : [ 'Global.js', 'Geom/Point.js', 'Geom/Rectangle.js', 'Geom/Size.js' ],
    init : function initGeom (m) {
        /**
         * Initializes the Geom Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinGeom (self) {
            /**
             * Adds Geom properties to *self*.
             * @param - self Object - The object to add Geom properties to.
             * @return self Geom Object 
             */
            self = m.Object(self); 
            
            return self;
        };
        
        return addin;
        
    }
});
