/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* TextTests.js
* TextTests module
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Fri Mar 16 16:58:04 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'TextTests',
    dependencies : [ 'Bang/View/TextView.js', 'Bang/Geom/Rectangle.js' ],
    init : function initTextTests (m) {
        /**
         * Initializes the TextTests 
         * @param - m Object - The mod modules object.
         */
        // aliases
        var ifndefInit = m.ifndefInit;
        var ifndefInitObj = m.ifndefInitObj;
        var safeAddin = m.safeAddin;
        
        return function runTextTests(callback) {
            var assert = m.assert;
            assert.testSuite = 'Text Tests';
            
            var stage = m.Stage();
            stage.setParentElement('bang');
            
            var box = m.View({
                hitArea : m.Rectangle.from(0, 0, 100, 100)
            });
            box.addHitAreaDrawFunction('rgba(0,0,0,0.5)');
        
            var text = m.TextView({
                text : 'Hi there, this is a text view...',
                textColor : 'rgba(255, 255, 0, 1.0)'
            });
            
            stage.addSubview(box);
            stage.addSubview(text);
            
            setTimeout(function() {
                /*stage.remove();
                callback();*/
            }, 2000);
        };
    }
});