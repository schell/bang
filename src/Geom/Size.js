/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Size.js
* The Size Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Mon Jan 30 17:02:51 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Size',
    dependencies : [ 'bang::Geom/Point.js' ],
    init : function initSize (m) {
        /**
         * Initializes the Size Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinSize(self) {
            /**
             * Adds Size properties to *self*.
             * A convenience Addin that aliases the Point Addin.
             * @param - self Object - The object to add Size properties to.
             * @return self Size Object 
             */
            self = m.Point(self); 
            
            m.safeAddin(self, 'width', self.x);
            m.safeAddin(self, 'height', self.y);
            
            return self;
        };
        addin.from = function Size_from(w, h) {
            /** * *
            * Returns a size with width=*w* and height=*h*.
            * @returns - Size
            * * **/
            w = m.ifndefInitNum(w, 0);
            h = m.ifndefInitNum(h, 0);
            var s = addin();
            s.width(w);
            s.height(h);
            return s;
        };
        
        return addin;
        
    }
});
