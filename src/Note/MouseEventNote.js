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
        * @param - m Object - The mod modules object.
        * * **/
        
        var addin = function addinMouseEventNote (self) {
            /** * *
            * Adds MouseEventNote properties to *self*.
            * @param - self Object - The object to add MouseEventNote properties to.
            * @return self MouseEventNote Object 
            * * **/
            self = m.Object(self); 
            
            m.safeAddin(self, 'tag', 'MouseEventNote');
            
            // A local point property to hold the mouse coords of the event in the target's coordinate space...
            m.safeAddin(self, 'localPoint', undefined);
            // A global point property to hold the mouse coords of the event in the target's coordinate space...
            m.safeAddin(self, 'globalPoint', undefined);
            // The view from which this note emerged...
            m.safeAddin(self, 'target', undefined);
            
            return self;
        };
        
        return addin;
        
    }
});
