/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Utils.js
* The utilities object.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Mar 20 16:28:01 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Utils',
    dependencies : [ 'bang::Global.js' ],
    init : function initUtils (m) {
        /** * *
        * Initializes the utilities object.
        * @param - m Object - The mod modules object.
        * * **/
        
        var utils = {};
        utils.findFactors = function findFactors(len) {
            /** * *
            * Finds some nice factors for len.
            * @return Array
            * * **/
            var h = 1;
            var scan = h;
            var w = len;
            while (scan < w) {
                var pw = len/scan;
                if (pw%1 === 0) {
                    w = pw;
                    h = scan;
                }
                scan++;
            }
            return [w,h];
        };
        
        utils.squarifyLength = function squarifyLength(len, tolerance) {
            /** * *
            * Attempts to 'squarify' a length.
            * @param len The length of data to squarify.
            * @param tolerance How many times bigger one dimension can be from the other.
            * * **/
            tolerance = tolerance || 5;
            
            var factors = utils.findFactors(len);
            var w = factors[0];
            var h = factors[1];
            if (w < h/tolerance) {
                w = Math.ceil(Math.sqrt(len));
                h = w;
            }
            return [w, h];
        };
        
        utils.bitStream = function bitStream(array, bitsper) {
            /** * *
            * Creates a bitstream object.
            * @param Array The array to treat as a bitstream.
            * @param Number The number of bits per index.
            * @return Object
            * * **/
            var data = array.slice();
            return {
                length : data.length*bitsper,
                at : function(i) {
                    var ndx = Math.floor(i/bitsper);
                    var x = i%bitsper + 1;
                    return data[ndx] >> (bitsper-x) & 1;
                }
            }
        };
        
        utils.packStringIntoImageData = function packStringIntoImageData(string) {
            /** * *
            * The same as packStringIntoImageData, but with a 12.5% compression improvement.
            * @param string The message to store.
            * @return ImageData
            * * **/
            function packStringIntoArray(string) {
                var dataToPack = Array.prototype.map.call(string, function(el,ndx) {
                    return string.charCodeAt(ndx);
                });
                var stream = utils.bitStream(dataToPack, 7);
                var data = [0];
                var ndx = 0;
                var acc = 0;
                for (var i=0; i < stream.length; i++) {
                    var bit = stream.at(i);
                    if (acc === 8) {
                        data[++ndx] = 0;
                        acc = 0;
                    }
                    data[ndx] = data[ndx] << 1 | bit;
                    acc++;
                }
                data[ndx] = data[ndx] << (8-acc);
                return data;
            }
            
            var packedData = packStringIntoArray(string);
            var pixelsNeeded = packedData.length/3;
            var dimensions = utils.squarifyLength(pixelsNeeded, 3);
            var ctx = document.createElement('canvas').getContext('2d');
            var packed = ctx.createImageData(dimensions[0], dimensions[1]);
            
            var acc = 0;
            var ndx = 0;
            for (var i=0; i < packed.data.length; i++) {
                if (++acc === 4) {
                    // This is an alpha channel...
                    packed.data[i] = 255;
                    acc = 0;
                    continue;
                }
                packed.data[i] = packedData[ndx++];
            }
            console.log('string length:',string.length,'compressed length:',packedData.length,'pixels needed:',pixelsNeeded,'dimensions:',dimensions,'wasted:',dimensions[0]*dimensions[1]-pixelsNeeded);
            return packed;
        };
            
        utils.unpackImageDataToString = function unpackImageDataToString(imageData) {
            /** * *
            * Unpacks a message from an ImageData object.
            * @param imageData
            * @return String 
            * * **/
            var data = [];
            
            for (var i=0; i < imageData.data.length && imageData.data[i]; i++) {
                if (i%4 !== 3) {
                    data.push(imageData.data[i]);
                }
            }
            
            function unpackStringFromArray(data) {
                var stream = utils.bitStream(data, 8);
                var string = '';
                var code = 0;
                var acc = 0;
                for (var i=0; i < stream.length; i++) {
                    var bit = stream.at(i);
                    if (acc === 7) {
                        string += String.fromCharCode(code);
                        code = 0;
                        acc = 0;
                    }
                    code = code << 1 | bit;
                    acc++;
                }
                return string;
            }
            
            return unpackStringFromArray(data);
        };
        
        return utils;
    }
});
