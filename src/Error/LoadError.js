/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* LoadError.js
* The LoadError Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Thu Feb  2 15:31:12 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'LoadError',
    dependencies : [ 'bang::Error/Error.js' ],
    init : function initLoadError (m) {
        /** * *
        * Initializes the LoadError Addin
        * @param - m Object - The mod modules object.
        * * **/
        // A private reference to this Error's type...
        var _type = 'LoadError';
        
        var addin = function addinLoadError (self) {
            /** * *
            * Adds LoadError properties to *self*.
            * @param - self Object - The object to add LoadError properties to.
            * @return self LoadError Object 
            * * **/
            self = m.Object(self); 
            
            self.toString = function () {
                return '[LoadError]';
            };
            
            // Addin Error
            m.Error(self);
            
            // Set default values...
            self.type = _type;
            // The message in a bottle, yeah...
            m.safeAddin(self, 'message', 'Could not load the resource.');
            
            return self;
        };
        addin.type = _type;
        
        return addin;
        
    }
});
