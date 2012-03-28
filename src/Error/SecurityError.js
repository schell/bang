/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* SecurityError.js
* The SecurityError Addin.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Thu Feb  2 15:37:15 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'SecurityError',
    dependencies : [ 'bang::Error/Error.js' ],
    init : function initSecurityError (m) {
        /** * *
        * Initializes the SecurityError Addin
        * @param - m Object - The mod modules object.
        * * **/
        // A private reference to this Error's type...
        var _type = 'SecurityError';
        
        var addin = function addinSecurityError (self) {
            /** * *
            * Adds SecurityError properties to *self*.
            * @param - self Object - The object to add SecurityError properties to.
            * @return self SecurityError Object 
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
