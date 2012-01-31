/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Stage.js
* The Stage Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Sat Jan 21 17:38:39 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Stage',
    dependencies : [ 'View/ViewContainer.js' ],
    init : function initStage (m) {
        /**
         * Initializes the Stage Addin
         * @param - m Object - The mod modules object.
         */
        
        var addin = function addinStage (self) {
            /**
             * Adds Stage properties to *self*.
             * @param - self Object - The object to add Stage properties to.
             * @return self Stage Object 
             */
            self = m.Object(self); 
            
            self.addToString(function Stage_toString() {
                return '[Stage]';
            });
            
            // Addin ViewContainer
            m.ViewContainer(self);
            
            // Some default values
            self.hitArea = m.Rectangle.from(0, 0, 500, 500);
            
            m.safeAddin(self, 'canvas', function Stage_initCanvas() {
                var canvas = document.createElement('canvas');
                canvas.width = self.hitArea.size().width();
                canvas.height = self.hitArea.size().height();
                canvas.id = 'Stage_'+Math.random().toString().substr(2);
                self.context = canvas.getContext('2d');
                return canvas;
            }());
            
            m.safeOverride(self, 'draw', 'viewContainer_draw', function Stage_draw() {
                // Send out a global hitArea tick notification...
                self.sendNotification(m.Notifications.FRAME_TICK);
                // Clear the stage...
                self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
                // Draw the stage...
                self.viewContainer_draw();
            });
            
            m.safeAddin(self, 'context', undefined);
            
            m.safeAddin(self, 'setParentElement', function Stage_setContainerDiv(id) {
                /** * *
                * Sets the div id of the Stage's parent container.
                * @param - id String - The id of the div that will contain the stage.
                * * **/
                var parent = document.getElementById(id.toString());
                if (!parent) {
                    throw new Error('Could not find html element '+id.toString());
                }
                parent.appendChild(self.canvas);
            });

            // set up drawing
            m.animateWithFunction(self.draw);
            
            return self;
        };
        
        return addin;
        
    }
});
