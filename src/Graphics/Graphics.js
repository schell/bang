/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Graphics.js
* The graphics addin. 
* Graphics aliases a lot of canvas' Context2D drawing functions
* and helps maintain the dirty rectangles implementation.
*
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Mon Apr  9 15:21:55 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/

// lineCap string
// textAlign string
// canvas object
// shadowOffsetX number
// font string
// miterLimit number
// shadowBlur number
// shadowColor string
// fillStyle string
// strokeStyle string
// globalCompositeOperation string
// shadowOffsetY number
// globalAlpha number
// textBaseline string
// lineJoin string
// lineWidth number
// save function
// restore function
// scale function
// rotate function
// translate function
// transform function
// setTransform function
// createLinearGradient function
// createRadialGradient function
// clearRect function
// fillRect function
// beginPath function
// closePath function
// moveTo function
// lineTo function
// quadraticCurveTo function
// bezierCurveTo function
// arcTo function
// rect function
// arc function
// fill function
// stroke function
// clip function
// isPointInPath function
// measureText function
// setAlpha function
// setCompositeOperation function
// setLineWidth function
// setLineCap function
// setLineJoin function
// setMiterLimit function
// clearShadow function
// fillText function
// strokeText function
// setStrokeColor function
// setFillColor function
// strokeRect function
// drawImage function
// drawImageFromRect function
// setShadow function
// putImageData function
// createPattern function
// createImageData function
// getImageData function

mod({
    name : 'Graphics',
    dependencies : [ 'bang::Global.js' ],
    init : function initGraphics (m) {
        /** * *
        * Initializes the Graphics Addin
        * @param - m Object - The mod modules object.
        * * **/
        
        var addin = function addinGraphics (self) {
            /** * *
            * Adds Graphics properties to *self*.
            * @param - self Object - The object to add Graphics properties to.
            * @return self Graphics Object 
            * * **/
            if (self) {
                throw new Error('Graphics can not inherit properties during instantiation.');
            }
            
            // So this object is a CanvasRenderingContext2D...
            self = m.Object(function() {
                /** * *
                * The graphics context. 
                * Used for rendering drawing routines.
                * * **/
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                return ctx;
            }()); 
            
            // A property so we know whether or not this canvas is dirty (needs re-drawing)...
            m.safeAddin(self, 'isDirty', true);
            
            // A private alias for storing the original drawing functions...
            var _aliases = {};
            
            function proxyDrawFunction(functionName) {
                _aliases[functionName] = self[functionName];
                self[functionName] = function aliasedDrawingFunction() {
                    // The user called a draw function, so this graphics context
                    // is dirty...
                    self.isDirty = true;
                    var args = Array.prototype.slice.call(arguments);
                    _aliases[functionName].apply(self, args);
                };
            }
            
            // Rewrite the CanvasRenderingContext2D functions to proxy through
            // our own functions...
            for(var key in self) {
                if (typeof self[key] === 'function') {
                    proxyDrawFunction(key);
                }
            }
            
            return self;
        };
        
        return addin;
        
    }
});
