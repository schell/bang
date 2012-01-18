/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Note.js
 *    The Note Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Fri Jan 13 17:12:59 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Note',
    dependencies : [ 'Global.js' ],
    init : function initNote (m) {
        /**
         * Initializes the Note Addin
         * @param - m Object - The mod modules object.
         */

        var addin = function addinNote (self) {
            /**
             * Adds Note properties to *self*.
             * @param - self Object - The object to add Note properties to.
             * @return self Note 
             */
            self = m.ifndefInitObj(self, m.initialObject()); 

            m.safeAddin(self, 'dispatcher', undefined);
            m.safeAddin(self, 'name', undefined);
            m.safeAddin(self, 'body', undefined);
            
            self.addToString(function () {
                return '[Note dispatcher:'+dispatcher.toString()+' name:'+self.name+' body:'+body+']';
            });
            
            return self;
        };
        
        addin.from = function Note_from (dispatcher, name, body) {
            dispatcher = m.ifndefInitObj(dispatcher, undefined);
            name = m.ifndefInit(name, undefined);
            body = m.ifndefInit(body, undefined);
            return addin({dispatcher:dispatcher, name:name, body:body});
        };
        
        return addin;
        
        
    }
});
