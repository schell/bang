/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* VideoTests.js
* The video tests.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed Mar 28 14:26:30 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/    
mod({
    name : 'VideoTests',
    dependencies : [ 'bang::View/Video.js' ],
    init : function initVideoTests (m) {
        /**
         * Initializes the VideoTests 
         * @param {Object} The mod modules object.
         */
        
        return function(callback) {
            var stage =Stage();
            stage.setParentElement('bang');
            
            var video =Video({
                width : 340,
                height : 190,
                rotation: 45,
                x : 150
            });
            
            video.load('videos/earth.mp4');
            
            stage.addView(video);
        };
    }
});