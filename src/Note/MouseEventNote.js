/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* MouseEventNote.js
* The MouseEventNote Addin.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Mon Feb 13 20:42:41 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'MouseEventNote',
    dependencies : [ ],
    init : function initMouseEventNote (m) {
        /** * *
        * Initializes the MouseEventNote Addin
        * @param {Object} The mod modules object.
        * * **/
        
        var addin = function addinMouseEventNote (self) {
            /** * *
            * Adds MouseEventNote properties to *self*.
            * @param - self Object - The object to add MouseEventNote properties to.
            * @return self MouseEventNote Object 
            * * **/
            self =Object(self); 
            
           safeAddin(self, 'tag', 'MouseEventNote');
            
            // A local point property to hold the mouse coords of the event in the target's coordinate space...
           safeAddin(self, 'localPoint', undefined);
            // A global point property to hold the mouse coords of the event in the target's coordinate space...
           safeAddin(self, 'globalPoint', undefined);
            // The view from which this note emerged...
           safeAddin(self, 'target', undefined);
            
            return self;
        };
        
        return addin;
        
    }
});
