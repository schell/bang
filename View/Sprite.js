/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Sprite.js
* The Sprite Addin (for animated bitmaps)
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Sun Feb  5 19:39:44 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Sprite',
    dependencies : [ 'Bang/Global.js', 'Bang/View/Bitmap.js' ],
    init : function initSprite (m) {
        /** * *
        * Initializes the Sprite Addin
        * @param - m Object - The mod modules object.
        * * **/
        
        var addin = function addinSprite (self) {
            /** * *
            * Adds Sprite properties to *self*.
            * @param - self Object - The object to add Sprite properties to.
            * @return self Sprite Object 
            * * **/
            self = m.Object(self); 
            
            self.toString = function() {
                return '[Sprite]';
            };
            
            // Addin Bitmap...
            m.Bitmap(self);
            
            //--------------------------------------
            //  PRIVATE
            //--------------------------------------
            // The first time the first frame was drawn...
            var _startTime = 0;
            // The current frame...
            var _currentFrame = 0;
            //--------------------------------------
            //  PUBLIC
            //--------------------------------------
            // An array to hold our animation frames...
            m.safeAddin(self, 'frames', []);
            // A number representing the speed of animation...
            m.safeAddin(self, 'millisecondsPerFrame', 1000/12);
            m.safeAddin(self, 'currentFrame', function Sprite_currentFrame(time) {
                /** * *
                * Returns the current frame of the Sprite given a specific time.
                * @param - time Number
                * @returns - Number
                * * **/
                if (!_startTime) {
                    _startTime = time;
                }
                
                var endWait = _startTime + self.millisecondsPerFrame;
                if (time > endWait) {
                    var framesForward = Math.floor((time - endWait) / self.millisecondsPerFrame);
                    _currentFrame = (++_currentFrame + framesForward) % self.frames.length;

                    if (framesForward) {
                        _startTime = time;
                    } else {
                        _startTime = endWait;
                    }
                }
                
                return _currentFrame;
            });
            m.safeOverride(self, 'draw', 'bitmap_draw', function Sprite_draw() {
                /** * *
                * Draws this Sprite into its context.
                * * **/
                var frame;
                if ('image' in self && self.frames.length) {
                    self.applyTransform();
                    
                    frame = self.frames[self.currentFrame(Date.now())];
					
                    var fx = frame.x();
					var fy = frame.y();
					var dw = frame.width();
					var dh = frame.height();
                    
                    self.context.drawImage(self.image, fx, fy, dw, dh, 0, 0, dw, dh);
                    
                    self.restoreTransform();
                }
                self.view_draw();
            });
            
            
            return self;
        };
        
        return addin;
        
    }
});
