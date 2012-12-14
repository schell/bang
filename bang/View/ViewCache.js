/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* ViewCache.js
* An extension for View that enables cacheing.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author Schell Scivally
* @since Thu Dec 13 21:03:17 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'ViewCache',
    dependencies : [ 
        'bang::View/View.js'
    ],
    /** * *
    * Initializes the ViewCache constructor.
    * * **/
    init : function initViewCacheConstructor(View) { 
        /** * *
        * Constructs new ViewCaches.
        * @constructor
        * @nosideeffects
        * @return {ViewCache}
        * * **/ 
        function ViewCache() {
            throw new Error('ViewCache is a View extension and is not instantiatable.');    
        }

        ViewCache.prototype = {}; 
        ViewCache.prototype.constructor = ViewCache;
        //-----------------------------
        //  EXTENSIONS
        //-----------------------------
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the cache property.
        * A context that holds the cached bitmap data of this view and its subviews.
        * @returns {CanvasRenderingContext2d} 
        * * **/
        View.prototype.__defineGetter__('cache', function ViewCache_getcache() {
            if (!this._cache) {
                var cache = document.createElement('canvas').getContext('2d');
                cache.canvas.width = this.stage.width;
                cache.canvas.height = this.stage.height;
                this._cache = cache;
            }
            return this._cache;
        });

        return ViewCache;
    }
});    
