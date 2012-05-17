/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*    Animation.js
*    Animation objects request timers and schedule callbacks.
*    Copyright (c) 2012 . All rights reserved.
*
*    @author    Schell Scivally
*    @since    Tue Jan 10 20:05:33 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Animation',
    dependencies : [],
    /**
    * Initializes the Animation type constructor.
    * @param {Object}
    * @return {function}
    */
    init : function initAnimation (m) {
        /** * *
        * Creates a new Animation object.
        * Animation objects request timers from the browser and
        * schedule callbacks. They don't necessarily have to be
        * used for animation.
        * @constructor
        * * **/
        function Animation() {
            /** * *
            * An array to hold all the current animations.
            * @type {Array.<object>}
            * * **/
            this.animations = [];
        }
        
        Animation.prototype = {};
        
        Animation.prototype.constructor = Animation;
        //--------------------------------------
        //  HELPERS
        //--------------------------------------
        /** * *
        * The function to use for requesting an animation timer.
        * @type {function(function(number)): number}
        * * **/
        var request = (window.requestAnimationFrame       ||
                       window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame    ||
                       window.onRequestAnimationFrame     ||
                       window.msRequestAnimationFrame     ||
                       function (callback) {
                           setTimeout(callback, 1000/60);
                           return callback;
                       });
        /** * *
        * The function to use for cancelling an animation timer.
        * @type {function( number|function(number) )}
        * * **/
        var cancel = (window.cancelRequestAnimationFrame       || 
                      window.webkitCancelRequestAnimationFrame || 
                      window.cancelAnimationFrame              || 
                      function(id) {
                          clearTimeout(id);
                      });
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Returns a string representation of this Animation.
        * @return {string}
        * * **/
        Animation.prototype.toString = function Animation_toString() {
            return 'Animation{}';
        };
        /** * *
        * Creates an animation package.
        * Animation packages are used for keeping track of specific animations.
        * @param context {Object} The context of this animation package.
        * @return {Object}
        * * **/
        Animation.prototype.createPackage = function Animation_createPackage(context) {
            return {
                id : 0,
                cancelled : false,
                context : context
            };
        };
        /** * *
        * Calls animationFunction over and over again.
        * @param animationFunction {function(number=)} The function to call over and over, repeatedly.
        * @param context {Object} The object to use as the 'this' property with calling animationFunction.
        * @return {Object.<string, string|number|false>}
        * * **/
        Animation.prototype.requestAnimation = function (animationFunction, context) {
            var animation = this.createPackage(context);
            // Store a reference to the animation...
            this.animations.push(animation);
            /** * *
            * Calls the animation function and schedules another call.
            * @param {number}
            * * **/
            var animate = function (time) {
                time = time || Date.now();
                
                if (animation.cancelled === true) {
                    // Abort if the animation has been cancelled...
                    animation.id = false;
                    return;
                }
                // Update the animation id...
                animation.id = request(animate);
                // Animate...
                animationFunction.call(animation.context, time);
            };

            animation.id = request(animate);
            return animation;
        };
        /** * *
        * Cancels an animation associate with a package returned by requestAnimation.
        * @param {Object.<string, string|number|false>}
        * * **/
        Animation.prototype.cancelAnimation = function Animation_cancelAnimation(animation) {
            animation.cancelled = true;
            animation.context = null;
            cancel(animation.id);
            
            // Remove the animation from our list...
            var ndx = this.animations.indexOf(animation);
            if (ndx !== -1) {
                this.animations.splice(ndx, 1);
            }
        };
        /** * *
        * Cancels all animations currently registered.
        * * **/
        Animation.prototype.cancelAllAnimations = function() {
            while (this.animations.length) {
                this.cancelAnimation(this.animations[0]);
            }
        };

        return Animation;
    }
});