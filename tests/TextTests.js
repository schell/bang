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
    dependencies : [ 'bang::View/Stage.js', 'bang::View/Text.js', 'bang::Geometry/Rectangle.js', 'bang::Ease/Ease.js' ],
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
            assert.suite = 'Text Tests';
            
            var stage = m.Stage();
            stage.setParentElement('bang');
            stage.addHitAreaDrawFunction('rgba(255, 255, 255, 0.5)');
            
            var string = 'Hey, this is a text field. It should wrap and the bounding box will autosize vertically.';
            string += '\n\nIt also supports newlines!\n\nBOOOOOM!\n\nOh, and it has a lineHeight property that defaults to 12px.';
            string += '\nRight now we are tweening between a lineHeight of 18 (font-size) and 27 (1.5x font-size), you can see the bounding box autosizing...';
            var text = m.Text({
                text : string,
                font : 'bold italic 18px serif',
                lineHeight : 18,
                fillStyle : 'rgba(0, 0, 0, 1.0)',
                strokeStyle : 'rgba(0, 0, 0, 0.3)',
                hitArea : m.Rectangle.from(10, 10, 300, 100)
            });
            text.addHitAreaDrawFunction('rgba(0,0,0,0)','rgba(0,0,0,0.5)');
            
            var tween;
            tween = m.Ease({
                target : text,
                duration : 1000,
                equation : 'easeOut',
                properties : {
                    lineHeight : 27
                },
                onComplete : function(){
                    assert.eq(text.hitArea.isEqualTo(m.Rectangle.from(10, 10, 300, 100)), false, 'Text resizes hit area.');
                    tween.properties.lineHeight = text.lineHeight == 27 ? 18 : 27;
                    tween.onComplete = function() {
                        stage.remove();
                        callback();
                    }
                    // Repeat...
                    setTimeout(tween.interpolate,1000);
                }
            });
            setTimeout(tween.interpolate,1000);
            
            stage.addView(text);
            
            setTimeout(function() {
                /*stage.remove();
                callback();*/
            }, 2000);
        };
    }
});