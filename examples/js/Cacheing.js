/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Cacheing.js
* A cacheing project.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author Schell Scivally
* @since Thu Dec 13 08:32:33 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Cacheing',
    dependencies : [ 
        'bang::View/Stage.js',
        'bang::View/View.js'
    ],
    /** * *
    * Initializes the Cacheing constructor.
    * * **/
    init : function initCacheingConstructor(Stage, View) { 
        /** * *
        * Constructs new Cacheings.
        * @constructor
        * @nosideeffects
        * @return {Cacheing}
        * * **/ 
        function Cacheing() {
        }

        Cacheing.prototype = {}; 
        Cacheing.prototype.constructor = Cacheing;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Gets the stage property.
        * 
        * @returns {Stage} 
        * * **/
        Cacheing.prototype.__defineGetter__('stage', function Cacheing_getstage() {
            if (!this._stage) {
                var stage = new Stage(500,500);
                stage.context.fillStyle = 'white';
                stage.context.fillRect(0,0,500,500);
                this._stage = stage;
            }
            return this._stage;
        });

        return Cacheing;
    }
});    
