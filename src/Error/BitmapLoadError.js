/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* BitmapLoadError.js
* The BitmapLoadError Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Thu Feb  2 15:31:12 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'BitmapLoadError',
    dependencies : [ 'Error/Error.js' ],
    init : function initBitmapLoadError (m) {
        /** * *
        * Initializes the BitmapLoadError Addin
        * @param - m Object - The mod modules object.
        * * **/
        // A private reference to this Error's type...
        var _type = 'BitmapLoadError';
        
        var addin = function addinBitmapLoadError (self) {
            /** * *
            * Adds BitmapLoadError properties to *self*.
            * @param - self Object - The object to add BitmapLoadError properties to.
            * @return self BitmapLoadError Object 
            * * **/
            self = m.Object(self); 
            
            self.toString = function () {
                return '[BitmapLoadError]';
            };
            
            // Addin Error
            m.Error(self);
            
            // Set default values...
            self.type = _type;
            // The message in a bottle, yeah...
            m.safeAddin(self, 'message', 'Bitmap could not load the resource.');
            
            return self;
        };
        addin.type = _type;
        
        return addin;
        
    }
});
