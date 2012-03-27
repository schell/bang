/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* UtilsTests.js
* Tests the PNGEncoder addin and other utilities.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Mon Mar 19 15:23:22 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'UtilsTests',
    dependencies : [ 'bang::Global.js', 'bang::View/Bitmap.js', 'bang::Utils/Utils.js', 'bang::Utils/PNGEncoder.js' ],
    init : function initUtilsTests (m) {
        /** * *
        * Initializes the PNGEncoderTests Addin
        * @param - m Object - The mod modules object.
        * * **/ 
        return function runUtilsTests(callback) {
            var assert = m.assert;
            assert.testSuite = 'Utilities Tests';
                
            var stage = m.Stage();
            stage.setParentElement('bang');
            stage.addHitAreaDrawFunction('rgb(255,255,255)');
            
            go(
                function encodeDecodeTest(cb) {
                    var c = document.createElement('canvas');
                    document.body.appendChild(c);
                    c.id = "encodeDecodeTest";
                    
                    var ctx = c.getContext('2d');
                    
                    var message = "A Troll stood by sadly for hours Near where'd been two shiny bright towers With hot tears in his eye He could not understand why Yet he hurt with the world's greatest powers.   Trolls come from lands far and near Through legends and myth they appear But right now, Today! To the GREAT USA They wish comfort and love without fear!";
                    
                    var msgImageData = m.Utils.packStringIntoImageData(message);
                    c.width = msgImageData.width;
                    c.height = msgImageData.height;
                    
                    ctx.putImageData(msgImageData, 0, 0);
                    
                    var dataOut = ctx.getImageData(0, 0, c.width, c.height);
                    var msgOut = m.Utils.unpackImageDataToString(dataOut);
                    
                    assert.eq(message, msgOut, 'Can encode data to canvas and back.');
                    
                    var src = mod.compile();
                    var png = m.PNGEncoder.PNGFromString(src);
                    document.body.appendChild(png);
                    var bm = m.Bitmap();
                    bm.addInterest(bm, m.Notifications.DID_LOAD, function() {
                        var string = m.PNGEncoder.StringFromBitmap(bm);
                        assert.eq(src.length, string.length, 'Can encode lots of data to png and back without loosing data.');
                        cb();
                    });
                    bm.load(png.src);
                },
                function bitmapEncodeTest(cb) {
                    var block = m.Bitmap();
                    block.addInterest(block, m.Notifications.Bitmap.DID_LOAD, function() {
                        block.removeInterest(block, m.Notifications.Bitmap.DID_LOAD);
                        
                        var blockReEncoded = m.Bitmap({
                            x : block.image.width
                        });
                        var src = m.PNGEncoder.PNGDataFromBitmap(block);
                        
                        blockReEncoded.addInterest(blockReEncoded, m.Notifications.Bitmap.DID_LOAD, function() {
                            var reEncodedSrc = m.PNGEncoder.PNGDataFromBitmap(blockReEncoded);
                            assert.eq(reEncodedSrc === src, true, 'PNGEncoder can encode from bitmap.');
                            cb();
                        });
                        blockReEncoded.load('data:image/png;base64,'+src);
                        stage.addSubview(blockReEncoded);
                    });
                    block.load('images/block.png');
                    stage.addSubview(block);
                },
                function JSEncodeTest(cb) {
                    var a = 666;
                    var string = 'var b = 24; var c = 16; var d = b/c; var s = "This is a string with the number one point five after some dots..."; a = s+(b/c).toString();for(var i=0;i<s.length;i++){d+=s.charCodeAt(i);}';
                    var pngSrc = m.PNGEncoder.PNGSrcFromString(string);
                    var pngBM = m.Bitmap();
                    pngBM.addInterest(pngBM, m.Notifications.Bitmap.DID_LOAD, function() {
                        var srcString = m.PNGEncoder.StringFromBitmap(pngBM);
                        if (srcString !== string) {
                            console.log(string);
                            console.log('\n');
                            console.log(srcString);
                        }
                        assert.eq(srcString,string, 'Can retrieve source code from png.');
                        eval(srcString);
                        assert.eq(d, 6035.5, 'Can correctly evaluate data stored in PNG format.');
                        
                        var projectCompilation = mod.compile();
                        pngSrc = m.PNGEncoder.PNGSrcFromString(projectCompilation);
                        document.write('<img title="bang_and_tests.png" src="'+pngSrc+'">');
                        cb();
                    });
                    pngBM.load(pngSrc);
                    stage.addSubview(pngBM);
                },
                function () {
                    stage.remove();
                    callback();
                }
            ).start();
        };
    }
});
