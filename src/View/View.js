/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    View.js
 *    The View Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Mon Jan 16 12:31:02 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'View',
    dependencies : [ 'Global.js', 'Note/Dispatcher.js', 'Note/Listener.js', 'Geom/Rectangle.js' ],
    init : function initView(m) {
        /**
         * Initializes the View Addin
         * @param - m Object - The mod modules object.
         */     
        
        var addin = function addinView(self) {
            /**
             * Adds View properties to *self*.
             * @param - self Object - The object to add View properties to.
             * @return self View Object 
             */
            self = m.ifndefInitObj(self, m.initialObject()); 
            
            // Addin properties of Listener
            m.Listener(self);
            
            // Addin properties of Dispatcher
            m.Dispatcher(self);
            
            // A Rectangle specifying the hit area of this object
            m.safeAddin(self, 'frame', m.Rectangle());
            
            // A reference to the canvas context
            m.safeAddin(self, 'context', undefined);
            
            // A reference to this view's parent container...
            m.safeAddin(self, 'parent', undefined);
            
            // The rotation of this view
            m.safeAddin(self, 'rotation', 0);
            
            // An array to hold draw functions
            m.safeAddin(self, 'drawQueue', []);
            
            m.safeAddin(self, 'draw', function View_draw() {
                for (var i=0; i < self.drawQueue.length; i++) {
                    var drawFunc = self.drawQueue[i];
                    drawFunc();
                }
            });
            
            self.addToString(function View_toString() {
                return '[View]';
            });
            
            return self;
        };
        
        return addin;
        
    }
});
