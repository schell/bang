/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* ViewContainer.js
* desc
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Fri Jan 20 15:37:27 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'ViewContainer',
    dependencies : [ 'Global.js', 'View/View.js' ],
    init : function initViewContainer (m) {
        /**
         * Initializes the ViewContainer Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinViewContainer (self) {
            /**
             * Adds ViewContainer properties to *self*.
             * @param - self Object - The object to add ViewContainer properties to.
             * @return self ViewContainer Object 
             */
            self = m.ifndefInitObj(self, m.initialObject()); 
            
            // Addin View
            m.View(self);
            
            // A private array to hold this container's subviews...
            var _subviews = [];
            m.safeAddin(self, 'subviews', function ViewContainer_getSubviews() {
                /** * *
                * Returns a copy of this container's subviews.
                * @param - Array
                * * **/
                return _subviews.map(function copyView(el,ndx,a) {
                    return el;
                });
            });
            
            m.safeAddin(self, 'addSubview', function ViewContainer_addSubview(subview) {
                subview.context = self.context;
                _subviews.push(subview);
            });
            
            m.safeOverride(self, 'draw', 'view_draw', function ViewContainer_draw() {
                self.view_draw();
                for (var i=0; i < _subviews.length; i++) {
                    _subviews[i].draw();
                }
            });
            
            return self;
        };
        
        return addin;
        
    }
});
