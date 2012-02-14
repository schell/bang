/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Ease.js
* The Ease Addin - used for tweening.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Jan 31 09:27:44 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Ease',
    dependencies : [ 'Bang/Global.js' ],
    init : function initEase (m) {
        /** * *
        * Initializes the Ease Addin
        * @param - m Object - The mod modules object.
        * * **/
        
        var addin = function addinEase (self) {
            /** * *
            * Adds Ease properties to *self*.
            * @param - self Object - The object to add Ease properties to.
            * @return self Ease Object 
            * * **/
            self = m.Object(self); 
            
            m.safeAddin(self, 'tag', 'Ease');
            //--------------------------------------
            //  EASING EQUATIONS
            //  by Robert Penner (http://www.gizma.com/easing/)
            //--------------------------------------
            m.safeAddin(self, 'linear', function Ease_linear(t, b, c, d) {
                /** * *
                * Simple linear interpolation.
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                return c*t/d + b;
            });
            m.safeAddin(self, 'easeInQuad', function Ease_easeInQuad(t, b, c, d) {
                /** * *
                * Quadratic interpolation easing in from zero velocity.
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d;
                return c*t*t + b;
            });
            m.safeAddin(self, 'easeOutQuad', function Ease_easeOutQuad(t, b, c, d) {
                /** * *
                * Quadratic interpolation easing out to zero velocity.
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d;
                return -c * t*(t-2) + b;
            });
            m.safeAddin(self, 'easeInOutQuad', function Ease_easeInOutQuad(t, b, c, d) {
                /** * *
                * Acceleration until halfway, then deceleration.
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;         
            });
            m.safeAddin(self, 'easeInCubic', function Ease_easeInCubic(t, b, c, d) {
                /** * *
                * Accelerating from zero velocity.
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d;
                return c*t*t*t + b;         
            });
            m.safeAddin(self, 'easeOutCubic', function Ease_easeOutCubic(t, b, c, d) {
                /** * *
                * Decelerating to zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d;
                t--;
                return c*(t*t*t + 1) + b;         
            });
            m.safeAddin(self, 'easeInOutCubic', function Ease_easeInOutCubic(t, b, c, d) {
                /** * *
                * Accelerating halfway, decelerating halfway.
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            });
            m.safeAddin(self, 'easeInQuart', function Ease_easeInQuart(t, b, c, d) {
                /** * *
                * Quartic easing in - accelerating from zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d;
                return c*t*t*t*t + b;         
            });
            m.safeAddin(self, 'easeOutQuart', function Ease_easeOutQuart(t, b, c, d) {
                /** * *
                * Quartic easing out - decelerating to zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d;
                t--;
                return -c * (t*t*t*t - 1) + b;         
            });
            m.safeAddin(self, 'easeInOutQuart', function Ease_easeInOutQuart(t, b, c, d) {
                /** * *
                * Quartic easing in/out - acceleration until halfway, then deceleration
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d/2;
                if (t < 1) return c/2*t*t*t*t + b;
                t -= 2;
                return -c/2 * (t*t*t*t - 2) + b;         
            });
            m.safeAddin(self, 'easeInQuint', function Ease_easeInQuint(t, b, c, d) {
                /** * *
                * Quintic easing in - accelerating from zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d;
                return c*t*t*t*t*t + b;          
            });
            m.safeAddin(self, 'easeOutQuint', function Ease_easeOutQuint(t, b, c, d) {
                /** * *
                * Quintic easing out - decelerating to zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d;
                t--;
                return c*(t*t*t*t*t + 1) + b;            
            });
            m.safeAddin(self, 'easeInOutQuint', function Ease_easeInOutQuint(t, b, c, d) {
                /** * *
                * Quintic easing in/out - acceleration until halfway, then deceleration
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d/2;
                if (t < 1) return c/2*t*t*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t*t*t + 2) + b;         
            });
            m.safeAddin(self, 'easeInSine', function Ease_easeInSine(t, b, c, d) {
                /** * *
                * Sinusoidal easing in - accelerating from zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;         
            });
            m.safeAddin(self, 'easeOutSine', function Ease_easeOutSine(t, b, c, d) {
                /** * *
                * Sinusoidal easing out - decelerating to zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                return c * Math.sin(t/d * (Math.PI/2)) + b;         
            });
            m.safeAddin(self, 'easeInOutSine', function Ease_easeInOutSine(t, b, c, d) {
                /** * *
                * Sinusoidal easing in/out - accelerating until halfway, then decelerating
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;           
            });
            m.safeAddin(self, 'easeInExpo', function Ease_easeInExpo(t, b, c, d) {
                /** * *
                * Exponential easing in - accelerating from zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                return c * Math.pow( 2, 10 * (t/d - 1) ) + b;         
            });
            m.safeAddin(self, 'easeOutExpo', function Ease_easeOutExpo(t, b, c, d) {
                /** * *
                * Exponential easing out - decelerating to zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;         
            });
            m.safeAddin(self, 'easeInOutExpo', function Ease_easeInOutExpo(t, b, c, d) {
                /** * *
                * Exponential easing in/out - accelerating until halfway, then decelerating
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d/2;
                if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
                t--;
                return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;         
            });
            m.safeAddin(self, 'easeInCirc', function Ease_easeInCirc(t, b, c, d) {
                /** * *
                * Circular easing in - accelerating from zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d;
                return -c * (Math.sqrt(1 - t*t) - 1) + b;         
            });
            m.safeAddin(self, 'easeOutCirc', function Ease_easeOutCirc(t, b, c, d) {
                /** * *
                * Circular easing out - decelerating to zero velocity
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d;
                t--;
                return c * Math.sqrt(1 - t*t) + b;         
            });
            m.safeAddin(self, 'easeInOutCirc', function Ease_easeInOutCirc(t, b, c, d) {
                /** * *
                * Circular easing in/out - acceleration until halfway, then deceleration
                * @param - t Number (current time)
                * @param - b Number (start value)
                * @param - c Number (change in value)
                * @param - d Number (duration)
                * @returns - Number (new value)
                * * **/
                t /= d/2;
                if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                t -= 2;
                return c/2 * (Math.sqrt(1 - t*t) + 1) + b;         
            });
            //--------------------------------------
            //  PROPERTIES
            //--------------------------------------
            // The target of interpolation...
            m.safeAddin(self, 'target', {});
            // The properties on target of which to interpolate to...
            m.safeAddin(self, 'properties', {});
            //--------------------------------------
            //  SPECIAL PROPERTIES
            //--------------------------------------
            // The equation to use for interpolation...
            m.safeAddin(self, 'equation',  'easeInOutQuad');
            m.safeAddin(self, 'onUpdate', function Ease_onUpdate(params) {
                /** * *
                * The default function to execute on update of interpolation.
                * * **/
            });
            // The parameters to be supplied to onUpdate...
            m.safeAddin(self, 'onUpdateParams', []);
            m.safeAddin(self, 'onComplete', function Ease_onComplete(params) {
                /** * *
                * The default function to execute on completion of interpolation.
                * * **/
            });
            // The parameters to be supplied to onComplete...
            m.safeAddin(self, 'onCompleteParams', []);
            // A private variable for keeping track of animation ids
            var _animation = {};
            //--------------------------------------
            //  USE
            //--------------------------------------
            m.safeAddin(self, 'cancel', function Ease_cancel() {
                /** * *
                * Cancels the interpolation. Tweening stops where it is.
                * * **/
                m.cancelAnimation(_animation);
            });
            m.safeAddin(self, 'finish', function Ease_finish() {
                /** * *
                * Cancels the interpolation, sets all properties to their finished state.
                * Calls the onComplete function.
                * * **/
                // Cancel...
                self.cancel();
                // Set final values...
                for (var key in self.properties) {
                    if (key in self.target) {
                        if (typeof self.target[key] === 'function') {
                            // Apply the setter function...
                            self.target[key](self.properties[key]);
                        } else {
                            self.target[key] = self.properties[key];
                        }
                    }
                }
                // Call onComplete...
                self.onComplete.apply(null, self.onCompleteParams);
            });
            m.safeAddin(self, 'interpolate', function Ease_interpolate() {
                /** * *
                * Starts interpolation.
                * * **/
                var start = Date.now();
                var time = 0;
                var duration = self.duration;
                var target = self.target;
                var equation = self.equation in self ? self[self.equation] : self.easeInOutQuad;
                // Get the delta of the properties we're interpolating...
                var deltaProperties = {};
                var fromProperties = {};
                // Save the type of property...
                var propertyTypeIsFunction = {};
                
                for (var key in self.properties) {
                    if (key in target) {
                        var from, to;
                        if (typeof target[key] === 'function') {
                            // This property is a getter/setter, so use it as a function...
                            propertyTypeIsFunction[key] = true;
                            from = target[key]();
                        } else {
                            propertyTypeIsFunction[key] = false;
                            from = target[key];
                        }
                        to = self.properties[key];
                        
                        var change = to - from;
                        fromProperties[key] = from; 
                        deltaProperties[key] = change;   
                    } else {
                        console.warn(key, 'is not in target',target.toString());
                    }
                }
                var interpolation = function () {
                    time = Date.now() - start;
                    if (time >= duration) {
                        self.finish();
                    } else {
                        for (var key in fromProperties) {
                            var from = fromProperties[key];
                            var delta = deltaProperties[key];
                            var current = equation(time, from, delta, duration);
                            if (propertyTypeIsFunction[key]) {
                                target[key](current);
                            } else {
                                target[key] = current;
                            }
                            // Update...
                            self.onUpdate.apply(null, self.onUpdateParams);
                        }
                    }
                };
                // Start and store our animation...
                _animation = m.requestAnimation(interpolation);
            });
            return self;
        };
        
        return addin;
    }
});
