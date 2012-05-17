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
    dependencies : [ 'bang::Global.js' ],
    init : function initNote (m) {
        /**
         * Initializes the Note Addin
         * @param {Object} The mod modules object.
         */

        var addin = function addinNote (self) {
            /**
             * Adds Note properties to *self*.
             * @param - self Object - The object to add Note properties to.
             * @return self Note 
             */
            self =Object(self); 
            
            self.toString = function() {
                var dispatcher = (self.dispatcher || 'undefined').toString();
                var name = (self.name || 'undefined').toString();
                var body = (self.body || 'undefined').toString();
                return '[Note(dispatcher:'+dispatcher+' name:'+name+' body:'+body+')]';
            };

           safeAddin(self, 'dispatcher', undefined);
           safeAddin(self, 'name', undefined);
           safeAddin(self, 'body', undefined);
            
            return self;
        };
        
        addin.from = function Note_from (dispatcher, name, body) {
            dispatcher =ifndefInitObj(dispatcher, undefined);
            name =ifndefInit(name, undefined);
            body =ifndefInit(body, undefined);
            return addin({dispatcher:dispatcher, name:name, body:body});
        };
        
        return addin;
        
        
    }
});
