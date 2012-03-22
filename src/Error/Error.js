/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Error.js
* The Error Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Thu Feb  2 15:27:34 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Error',
    dependencies : [ 'bang::Global.js' ],
    init : function initError (m) {
        /** * *
        * Initializes the Error Addin
        * @param - m Object - The mod modules object.
        * * **/
        // A private reference to this Error's type...
        var _type = 'Error';
        
        var addin = function addinError (self) {
            /** * *
            * Adds Error properties to *self*.
            * @param - self Object - The object to add Error properties to.
            * @return self Error Object 
            * * **/
            self = m.Object(self); 
            
            self.toString = function () {
                return '[Error]';
            };
            
            // The type of error this is...
            m.safeAddin(self, 'type', _type);
            // A message to you, rudy...
            m.safeAddin(self, 'message', 'This is a generic error.');
            // The error thrown by javascript...
            m.safeAddin(self, 'nativeError', undefined);
            
            return self;
        };
        addin.type = _type;
        
        return addin;
        
    }
});
