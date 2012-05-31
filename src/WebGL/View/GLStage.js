/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* GLStage.js
* A Stage constructor for 3D things.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed May 30 15:45:07 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'GLStage',
    dependencies : [ 'bang::View/Stage.js' ],
    /** * *
    * Initializes the Stage object constructor.
    * @param {Stage} Stage The Stage object factory.
    * * **/
    init : function StageFactory (Stage) {
        /** * *
        * 
        * @constructor
        * * **/
        function GLStage() {
        
        }
        
        GLStage.prototype = {};
        
        GLStage.prototype.constructor = GLStage;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        
        
        return Stage;
    }
});