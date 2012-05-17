/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* SpriteTests.js
* The Sprite Addin tests
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Mon Feb  6 09:23:58 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'SpriteTests',
    dependencies : [ 'bang::View/Sprite.js', 'bang::Geometry/Rectangle.js' ],
    init : function initSpriteTests (m) {
        /**
         * Initializes the SpriteTests 
         * @param {Object} The mod modules object.
         */
        
        return function runSpriteTests(callback) {
            var assert =assert;
            assert.suite = 'Sprite Tests';
            
            var stage =Stage();
            stage.setParentElement('bang');
            
            var sheet = 'images/walkingRabbit.png';
            var frames =Rectangle.from(0,0,269,371);
            var w = 44.5;
            var t = 269/w;
            var verticallyAt = [];
            for (var i=1; i < t-1; i++) {
                verticallyAt.push(w*i);
            }
            frames = frames.section({
                verticallyAt : verticallyAt
            });
            
            var sprite =Sprite({
                frames : frames
            });
            sprite.load(sheet);
            
            stage.addView(sprite);
            
            setTimeout(function() {
                stage.remove();
                callback();
            }, 2000);
        };
    }
});