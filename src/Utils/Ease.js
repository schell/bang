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
    dependencies : [ 'bang::Utils/Task.js', 'bang::Utils/Animation.js' ],
    /** * *
    * Initializes the Ease constructor.
    * @return {function} The Ease object constructor.
    * * **/
    init : function initEase (Task, Animation) {
        /** * *
        * Creates a new Ease object.
        * @param {Object} config The configuration object. Its properties are any number of those of an Ease object.
        * @return {Ease}
        * * **/
        function Ease (config) {
            // Create a set of defaults for every tween...
            var defaultConfig = {
                target : {},
                duration : 1000,
                delay : 0,
                equation : Ease.linear,
                properties : {},
                onUpdate : function(){},
                onUpdateParams : [],
                onComplete : function(){},
                onCompleteParams : []
            };
            config = config || defaultConfig;
            for (var key in defaultConfig) {
                if (!(key in config)) {
                    // Inherit defaults if no override exists...
                    config[key] = defaultConfig[key];
                }
                // Set the mixed properties on this...
                this[key] = config[key];
            }
            
            this.interpolation = {};
        }
        
        Ease.prototype = new Task();
        
        Ease.prototype.constructor = Ease;
        //--------------------------------------
        //  STATIC PROPERTIES
        //--------------------------------------
        /** * *
        * An animation scheduler.
        * @type {Animation}
        * * **/
        Ease.timer = new Animation();
        //--------------------------------------
        //  STATIC EASING EQUATIONS [by Robert Penner (http://www.gizma.com/easing/)]
        //--------------------------------------
        /** * *
        * Simple linear interpolation.
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.linear =function Ease_linear(t, b, c, d) {
            return c*t/d + b;
        };
        /** * *
        * Quadratic interpolation easing in from zero velocity.
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInQuad =function Ease_easeInQuad(t, b, c, d) {
            t /= d;
            return c*t*t + b;
        };
        /** * *
        * Quadratic interpolation easing out to zero velocity.
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeOutQuad =function Ease_easeOutQuad(t, b, c, d) {
            t /= d;
            return -c * t*(t-2) + b;
        };
        /** * *
        * Acceleration until halfway, then deceleration.
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInOutQuad =function Ease_easeInOutQuad(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;         
        };
        /** * *
        * Accelerating from zero velocity.
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInCubic =function Ease_easeInCubic(t, b, c, d) {
            t /= d;
            return c*t*t*t + b;         
        };
        /** * *
        * Decelerating to zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeOutCubic =function Ease_easeOutCubic(t, b, c, d) {
            t /= d;
            t--;
            return c*(t*t*t + 1) + b;         
        };
        /** * *
        * Accelerating halfway, decelerating halfway.
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInOutCubic =function Ease_easeInOutCubic(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t*t + b;
            t -= 2;
            return c/2*(t*t*t + 2) + b;
        };
        /** * *
        * Quartic easing in - accelerating from zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInQuart =function Ease_easeInQuart(t, b, c, d) {
            t /= d;
            return c*t*t*t*t + b;         
        };
        /** * *
        * Quartic easing out - decelerating to zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeOutQuart =function Ease_easeOutQuart(t, b, c, d) {
            t /= d;
            t--;
            return -c * (t*t*t*t - 1) + b;         
        };
        /** * *
        * Quartic easing in/out - acceleration until halfway, then deceleration
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInOutQuart =function Ease_easeInOutQuart(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t*t*t + b;
            t -= 2;
            return -c/2 * (t*t*t*t - 2) + b;         
        };
        /** * *
        * Quintic easing in - accelerating from zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInQuint =function Ease_easeInQuint(t, b, c, d) {
            t /= d;
            return c*t*t*t*t*t + b;          
        };
        /** * *
        * Quintic easing out - decelerating to zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeOutQuint =function Ease_easeOutQuint(t, b, c, d) {
            t /= d;
            t--;
            return c*(t*t*t*t*t + 1) + b;            
        };
        /** * *
        * Quintic easing in/out - acceleration until halfway, then deceleration
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInOutQuint =function Ease_easeInOutQuint(t, b, c, d) {
            t /= d/2;
            if (t < 1) {
                return c/2*t*t*t*t*t + b;
            }
            t -= 2;
            return c/2*(t*t*t*t*t + 2) + b;         
        };
        /** * *
        * Sinusoidal easing in - accelerating from zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInSine =function Ease_easeInSine(t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;         
        };
        /** * *
        * Sinusoidal easing out - decelerating to zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeOutSine =function Ease_easeOutSine(t, b, c, d) {
           return c * Math.sin(t/d * (Math.PI/2)) + b;         
        };
        /** * *
        * Sinusoidal easing in/out - accelerating until halfway, then decelerating
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInOutSine =function Ease_easeInOutSine(t, b, c, d) {
           return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;           
        };
        /** * *
        * Exponential easing in - accelerating from zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInExpo =function Ease_easeInExpo(t, b, c, d) {
           return c * Math.pow( 2, 10 * (t/d - 1) ) + b;         
        };
        /** * *
        * Exponential easing out - decelerating to zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeOutExpo =function Ease_easeOutExpo(t, b, c, d) {
           return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;         
        };
        /** * *
        * Exponential easing in/out - accelerating until halfway, then decelerating
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInOutExpo =function Ease_easeInOutExpo(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
            t--;
            return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;         
        };
        /** * *
        * Circular easing in - accelerating from zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInCirc =function Ease_easeInCirc(t, b, c, d) {
            t /= d;
            return -c * (Math.sqrt(1 - t*t) - 1) + b;         
        };
        /** * *
        * Circular easing out - decelerating to zero velocity
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeOutCirc =function Ease_easeOutCirc(t, b, c, d) {
            t /= d;
            t--;
            return c * Math.sqrt(1 - t*t) + b;         
        };
        /** * *
        * Circular easing in/out - acceleration until halfway, then deceleration
        * @param - t Number (current time)
        * @param - b Number (start value)
        * @param - c Number (change in value)
        * @param - d Number (duration)
        * @returns - Number (new value)
        * * **/
        Ease.easeInOutCirc =function Ease_easeInOutCirc(t, b, c, d) {
            t /= d/2;
            if (t < 1) {
                return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            }
            t -= 2;
            return c/2 * (Math.sqrt(1 - t*t) + 1) + b;         
        };
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Cancels the interpolation. Tweening stops where it is.
        * * **/
        Ease.prototype.cancel = function Ease_cancel() {
            Ease.timer.cancelAnimation(this.interpolation);
        };
        /** * *
        * Cancels the interpolation, sets all properties to their finished state.
        * Calls the onComplete function.
        * * **/
        Ease.prototype.finish = function Ease_finish(callback) {
            // Cancel...
            this.cancel();
            // Set final values...
            for (var key in this.properties) {
                if (key in this.target) {
                    if (typeof this.target[key] === 'function') {
                        // Apply the setter function...
                        this.target[key](this.properties[key]);
                    } else {
                        this.target[key] = this.properties[key];
                    }
                }
            }
            // Call onComplete...
            this.onComplete.apply(null, this.onCompleteParams);
        };
        /** * *
        * Starts interpolation. Returns itself.
        * @return {Ease}
        * * **/
        Ease.prototype.interpolate = function Ease_interpolate() {
            var start = Date.now();
            var time = 0;
            var tween = this;
            // Get the delta of the properties we're interpolating...
            var deltaProperties = {};
            var fromProperties = {};
            // Save the type of property...
            var propertyTypeIsFunction = {};
                
            for (var key in this.properties) {
                if (key in this.target) {
                    var from, to;
                    if (typeof this.target[key] === 'function') {
                        // This property is a getter/setter, so use it as a function...
                        propertyTypeIsFunction[key] = true;
                        from = this.target[key]();
                    } else {
                        propertyTypeIsFunction[key] = false;
                        from = this.target[key];
                    }
                    to = this.properties[key];
                        
                    var change = to - from;
                    fromProperties[key] = from; 
                    deltaProperties[key] = change;   
                } else {
                    console.warn(key, 'is not in target',this.target.toString());
                }
            }
            var interpolationFunction = function Ease_interpolate_interpolationFunction() {
                time = Date.now() - start;
                if (time >= tween.duration + tween.delay) {
                    tween.finish();
                } else if (time >= tween.delay) {
                    var t_interpolate = time - tween.delay;
                    for (var key in fromProperties) {
                        var from = fromProperties[key];
                        var delta = deltaProperties[key];
                        var current = tween.equation(t_interpolate, from, delta, tween.duration);
                        if (propertyTypeIsFunction[key]) {
                            tween.target[key](current);
                        } else {
                            tween.target[key] = current;
                        }
                        // Update...
                        tween.onUpdate.apply(null, tween.onUpdateParams);
                    }
                }
            };
            // Start and store our interpolation...
            tween.interpolation = Ease.timer.requestAnimation(interpolationFunction);
            return tween;
        };
        /** * *
        * Runs this tween as a Task.
        * * **/
        Ease.prototype.go = function Ease_go(results) {
            var oldOnComplete = this.onComplete;
            var alias = this;
            this.onComplete = function newOnComplete() {
                oldOnComplete();
                Task.prototype.go.call(alias);
            }
            this.interpolate();
        }
        
        return Ease;
    }
});
