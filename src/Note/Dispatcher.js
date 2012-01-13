/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    Dispatcher.js
 *    The Dispatcher Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 18:33:06 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/  
mod({
    name : 'Dispatcher',
    dependencies : [ 'Global.js', 'Note/NoteCenter.js' ],
    init : function initDispatcher (m) {
        /**
         * Initializes the Dispatcher Addin
         * @param - m Object - The mod modules object.
         */
        
        // A private, module-level NoteCenter instance for dispatching events.
        //var eventCenter = NoteCenter();
        
        var addin = function addinDispatcher (self) {
            /**
             * Adds Dispatcher properties to *self*.
             * @param - self Object - The object to add Dispatcher properties to.
             * @return self Dispatcher Object 
             */
            self = m.ifndefInitObj(self, m.initialObject()); 
            
            m.safeAddin(self, 'listen', function Dispatcher_listen (event, callback, eatsNote) {
/*                event = ifndefInitObj(event, Note());
                callback = ifndefIniObj(event)
                var observer = Observer({event:event,focus:self,callback:callback});
                eventCenter.addObserver(observer);*/
            });
            
            return self;
        };
        
        return addin;
        
    }
});
