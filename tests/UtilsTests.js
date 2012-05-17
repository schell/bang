/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* UtilsTests.js
* Tests some utilities.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Mon Mar 19 15:23:22 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'UtilsTests',
    dependencies : [ 'bang::Global.js', 'bang::View/Bitmap.js', 'bang::Utils/Utils.js' ],
    init : function initUtilsTests (m) {
        /** * *
        * Initializes the UtilsTests Addin
        * @param {Object} The mod modules object.
        * * **/ 
        return function runUtilsTests(callback) {
            var assert =assert;
            assert.suite = 'Utilities Tests';
                
            var stage =Stage();
            stage.setParentElement('bang');
            stage.addHitAreaDrawFunction('rgb(255,255,255)');
            
            go(
                function encodeDecodeTest(cb) {
                    var c = document.createElement('canvas');
                    document.body.appendChild(c);
                    c.id = "encodeDecodeTest";
                    
                    var ctx = c.getContext('2d');
                    
                    var message = "A Troll stood by sadly for hours Near where'd been two shiny bright towers With hot tears in his eye He could not understand why Yet he hurt with the world's greatest powers.   Trolls come from lands far and near Through legends and myth they appear But right now, Today! To the GREAT USA They wish comfort and love without fear!";
                    
                    var msgImageData =Utils.packStringIntoImageData(message);
                    c.width = msgImageData.width;
                    c.height = msgImageData.height;
                    
                    ctx.putImageData(msgImageData, 0, 0);
                    
                    var dataOut = ctx.getImageData(0, 0, c.width, c.height);
                    var msgOut =Utils.unpackImageDataToString(dataOut);
                    
                    assert.eq(message, msgOut, 'Can encode data to canvas and back.');
                    
                    var src = mod.compile();
                    var png =Utils.StringToImage(src);
                    document.body.appendChild(png);
                    var bm =Bitmap();
                    bm.addListener(bm,Bitmap.DID_LOAD, function() {
                        var string =Utils.ImageToString(bm.image);
                        assert.eq(src.length, string.length, 'Can encode lots of data to png and back without loosing data.');
                        cb();
                    });
                    bm.load(png.src);
                },
                function JSEncodeTest(cb) {
                    var a = 666;
                    var string = 'var b = 24; var c = 16; var d = b/c; var s = "This is a string with the number one point five after some dots..."; a = s+(b/c).toString();for(var i=0;i<s.length;i++){d+=s.charCodeAt(i);}';
                    var png =Utils.StringToImage(string);
                    var pngBM =Bitmap();
                    pngBM.addListener(pngBM,Bitmap.DID_LOAD, function() {
                        var srcString =Utils.ImageToString(pngBM.image);
                        if (srcString !== string) {
                            console.log(string);
                            console.log('\n');
                            console.log(srcString);
                        }
                        assert.eq(srcString,string, 'Can retrieve source code from png.');
                        eval(srcString);
                        assert.eq(d, 6035.5, 'Can correctly evaluate data stored in PNG format.');
                        
                        var projectCompilation = mod.compile();
                        var PNG =Utils.StringToImage(projectCompilation);
                        var GIF =Utils.StringToImage(projectCompilation, 'image/gif');
                        document.body.innerHTML = '';
                        function h3(string) {
                            var h3 = document.createElement('h3');
                            h3.innerHTML = string;
                            return h3;
                        }
                        document.body.appendChild(h3('png'));
                        document.body.appendChild(PNG);
                        document.body.appendChild(h3('gif'));
                        document.body.appendChild(GIF);
                        cb();
                    });
                    pngBM.load(png.src);
                    stage.addView(pngBM);
                },
                function () {
                    stage.remove();
                    callback();
                }
            ).start();
        };
    }
});
