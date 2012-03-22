/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* BitmapTests.js
* The Bitmap tests.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Thu Feb  2 12:29:18 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'BitmapTests',
    dependencies : [ 'bang::Global.js', 'bang::View/Stage.js', 'bang::Ease/Ease.js', 'bang::View/Bitmap.js', 'bang::Error/BitmapLoadError.js', 'bang::Utils/PNGEncoder.js', 'http://schell.github.com/go/go.js' ],
    init : function initBitmapTests (m) {
        /**
         * Initializes the BitmapTests 
         * @param - m Object - The mod modules object.
         */
        return function runBitmapTests(callback) {
            var assert = m.assert;
            assert.testSuite = 'Bitmap Tests';
            
            var stage = m.Stage();
            stage.setParentElement('bang');
            
            var dne = 'nothing/nothing.png';
            var local = 'images/block.png';
            var bm = m.Bitmap();
            
            function loadBitmapTests(cb) {
                bm.addInterest(bm, m.Notifications.Bitmap.DID_NOT_LOAD, function(note) {
                    assert.eq(note.body.type, m.BitmapLoadError.type, 'Bitmap notifies of failed image load.');
                    bm.removeInterest(bm, m.Notifications.Bitmap.DID_NOT_LOAD);
                
                
                    bm.load(local);
                });
                bm.addInterest(bm, m.Notifications.Bitmap.DID_LOAD, function(note) {
                    assert.eq(note.body, local, 'Bitmap notifies of successfull image load.');
                    cb();
                });
                bm.load(local);
            }
            
            function drawBitmapTests(cb) {
                stage.addSubview(bm);
                setTimeout(function() {
                    var canSeeBitmap = m.interactiveTests ? confirm('Can you see a bloody block rendered on the stage? (hit enter or click "Okay" to answer "yes, I do.")') : true;
                    assert.eq(canSeeBitmap, true, 'Bitmap can render to stage');
                    cb();
                }, 1000);
            }
            
            function easeBitmapTests(cb) {
                bm.tween = m.Ease({
                    target : bm,
                    duration : 1000,
                    properties : {
                        scaleX : 0.5,
                        scaleY : 0.5
                    },
                    onComplete : function() {
                        var canEase = m.interactiveTests ? confirm('Did the bloody block get smaller?') : true;
                        assert.eq(canEase, true, 'Can tween bitmap.');
                        if (window.location.href.indexOf('http://') !== -1) {
                            // We are running from a server, so we can do
                            // tests without security errors...
                            var imageData = bm.getImageData();
                            assert.eq(imageData !== false, true, 'Bitmap can retrieve image data.');
                        } 
                        
                        stage.remove();
                        cb();
                    }
                });
                bm.tween.interpolate();
            }
            
            go(loadBitmapTests, drawBitmapTests, easeBitmapTests, callback).start();
        };
    }
});