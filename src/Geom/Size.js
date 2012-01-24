/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Size.js
 *    The Size Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 12:26:02 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Size',
    dependencies : [ 'Global.js' ],
    init : function initSize (m) {
        /**
         * Initializes the Size Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinSize (self) {
            /**
             * Adds Size properties to *self*.
             * @param - self Object - The object to add Size properties to.
             * @return self Size Object 
             */
            self = m.Object(self); 
            
            self.addToString(function Size_toString() {
                return '[Size('+self.width+','+self.height+')]';
            });
            
            m.safeAddin(self, 'width', 0);
            m.safeAddin(self, 'height', 0);
            
            m.safeAddin(self, 'isEqualTo', function Size_isEqualTo (size) {
                /**
                 * Determines whether or not *size* is equal to self.
                 * @return - Boolean
                 */
                return size.width == self.width && size.height == size.height;
            });
            
            m.safeAddin(self, 'copy', function Size_copy () {
                return addin.from(self.width, self.height);
            });
            
            return self;
        };
        
        addin.from = function Size_from(w, h) {
            /**
             * Returns a copy of self.
             * @return - Size
             */
            m.ifndefInitNum(w, 0);
            m.ifndefInitNum(h, 0);
            return addin({width:w,height:h});
        };
        
        addin.from = function Size_from (w, h) {
            /**
             * Returns a Size with width *w* and height *h*.
             * @param - w Number
             * @param - h Number
             */
            w = m.ifndefInitNum(w, 0);
            h = m.ifndefInitNum(h, 0);
            return addin({width:w, height:h});
        }
        
        return addin;
    }
});