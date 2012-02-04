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
    dependencies : [ 'Bang/Global.js', 'Bang/View/View.js', 'Bang/Notifications.js' ],
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
            self = m.Object(self); 
            
            self.addToString(function ViewContainer_toString() {
                return '[ViewContainer]';
            });
            
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
                _subviews.push(subview);
                // Let everyone know that this added a view...
                subview.sendNotification(m.Notifications.WAS_ADDED_TO_VIEWCONTAINER, self);
                self.sendNotification(m.Notifications.DID_ADD_SUBVIEW, subview);
            });
            
            m.safeAddin(self, 'treeString', function ViewContainer_treeString(n) {
                n = n || 0;
                var s = '';
                var t = '';
                for (var i=0; i < n; i++) {
                    t += '    ';
                }
                s += t + self.toString()+'\n';
                for (i=0; i < _subviews.length; i++) {
                    var subview = _subviews[i];
                    if ('treeString' in subview) {
                        s += subview.treeString(n+1);
                    } else {
                        s += t + '    ' + subview.toString();
                    }
                }
                return s + '\n';
            });
            
            m.safeOverride(self, 'draw', 'view_draw', function ViewContainer_draw() {
                // Draw according to View.js...
                self.view_draw();
                
                // Transform here for subviews...
                self.applyTransform();
                
                for (var i=0; i < _subviews.length; i++) {
                    // Draw the subviews...
                    _subviews[i].draw();
                }
                // Restore the context...
                self.restoreTransform();
            });
            
            return self;
        };
        
        return addin;
        
    }
});
