/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* BitmapSecurityError.js
* The BitmapSecurityError Addin.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Thu Feb  2 15:37:15 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'BitmapSecurityError',
    dependencies : [ 'Bang/Error/Error.js' ],
    init : function initBitmapSecurityError (m) {
        /** * *
        * Initializes the BitmapSecurityError Addin
        * @param - m Object - The mod modules object.
        * * **/
        // A private reference to this Error's type...
        var _type = 'BitmapSecurityError';
        
        var addin = function addinBitmapSecurityError (self) {
            /** * *
            * Adds BitmapSecurityError properties to *self*.
            * @param - self Object - The object to add BitmapSecurityError properties to.
            * @return self BitmapSecurityError Object 
            * * **/
            self = m.Object(self); 
            
            // Addin Error
            m.Error(self);
            
            self.type = _type;
            m.safeAddin(self, 'message', 'Bitmap encountered a security error while loading.');
            
            return self;
        };
        addin.type = _type;
        
        return addin;
        
    }
});
