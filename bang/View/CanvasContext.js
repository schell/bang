/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * CanvasContext.js
 * A modified CanvasRenderingContext2D.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Fri Nov 16 12:28:35 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'CanvasContext',
    dependencies : [],
    /** * *
    * Initializes the CanvasContext constructor.
    * * **/
    init : function initCanvasContextConstructor() {
        /** * *
        * Constructs new CanvasContexts.
        * @constructor
        * @param {number} w
        * @param {number} h
        * @nosideeffects
        * @return {CanvasContext}
        * * **/ 
        function CanvasContext() {
            throw new TypeError('Illegal contructor - use CanvasContext.createContext');
        }

        CanvasContext.prototype = {}; 
        CanvasContext.prototype.constructor = CanvasContext;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Creates a new CanvasRenderingContext2D for a view.
        * @param {number} w The width of the canvas.
        * @param {number} h The height of the canvas.
        * @param {View} view The stage this canvas context will be drawn into.
        * @returns {CanvasRenderingContext2D}
        * * **/
        CanvasContext.createContext = function CanvasContext_createContext(w, h, view) {
            var context = document.createElement('canvas').getContext('2d');
            var canvas = context.canvas;
            canvas.width = w || canvas.width;
            canvas.height = h || canvas.height;
            /** * *
            * A reference to the context's owner.
            * @type {View}
            * * **/
            context.view = view || false;
            // When a user conducts a draw operation we want to update the 
            // stage's needsDisplay so the stage will show these changes,
            // so we'll do some aliasing...
            function createDirtyAlias(func) {
                return function aliasedDrawFunc() {
                    context.view.needsDisplay = true;
                    return func.apply(context, arguments);
                }
            }
            for (var propName in context) {
                var drawFunc = context[propName];
                if (typeof drawFunc === 'function') {
                    context[propName] = createDirtyAlias(drawFunc);
                }
            }
            return context;
        }
        return CanvasContext;
    }
});    
