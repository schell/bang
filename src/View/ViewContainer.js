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
    dependencies : [ 'bang::Global.js', 'bang::View/View.js' ],
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
            
            m.safeAddin(self, 'tag', 'ViewContainer');
            
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
                if (m.defined(subview.parent)) {
                    subview.parent.removeSubview(subview);
                }
                _subviews.push(subview);
                // Let everyone know that this added a view...
                subview.sendNotification(m.View.WAS_ADDED_TO_VIEWCONTAINER, self);
                self.sendNotification(addin.DID_ADD_SUBVIEW, subview);
            });
            m.safeAddin(self, 'removeSubview', function ViewContainer_removeSubview(subview) {
                /** * *
                * Removes *subview* from this view's display list.
                * @param - subview View
                * * **/
                var ndx = _subviews.indexOf(subview);
                if (ndx !== -1) {
                    subview.parent = undefined;
                    _subviews.splice(ndx, 1);
                    self.sendNotification(m.ViewContainer.DID_REMOVE_SUBVIEW, subview);
                    subview.sendNotification(m.View.WAS_REMOVED_FROM_VIEWCONTAINER, self);
                }
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
        //--------------------------------------
        //  NOTIFICATIONS SENT BY THIS ADDIN
        //--------------------------------------
        var events = {
             // Sent from a ViewContainer after adding a subview, just after said subview sends WAS_ADDED_TO_VIEWCONTAINER
             DID_ADD_SUBVIEW : 'didAddSubview',
             // Sent from a ViewContainer after removing a subview, just before said subview sends WAS_REMOVED_FROM_VIEWCONTAINER
             DID_REMOVE_SUBVIEW : 'didRemoveSubview'
         };
         m.safeAddinAllPropertiesOf(addin, events);
         
         return addin;
        
    }
});
