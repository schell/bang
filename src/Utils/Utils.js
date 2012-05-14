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
    dependencies : [],
    /** * *
    * Initializes the utilities object.
    * @param {Object} The mod modules object.
    * * **/
    init : function initUtils (m) {
        /** * *
        * An empty constructor function.
        * @constructor
        * * **/
        function Utils() {
            
        }
        
        Utils.prototype = {};
        
        Utils.prototype.constructor = Utils;
        //--------------------------------------
        //  STATIC METHODS
        //--------------------------------------
        /** * *
        * Finds the factors of len.
        * @param {number} The number to factor.
        * @return {Array.<number>}
        * * **/
        Utils.findFactors = function Utils_findFactors(len) {
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
        /** * *
        * Attempts to 'squarify' a length.
        * @param {number} The length of data to squarify.
        * @param {number} How many times bigger one dimension can be from the other.
        * @return {Array.<number>}
        * * **/
        Utils.squarifyLength = function Utils_squarifyLength(len, tolerance) {
            tolerance = tolerance || NaN;
            
            var factors = Utils.findFactors(len);
            var w = factors[0];
            var h = factors[1];
            if ((w === 1 && len > 100) || !isNaN(tolerance) && h < w/tolerance) {
                h = Math.ceil(Math.sqrt(len));
                w = h;
            }
            return [w, h];
        };
        /** * *
        * Creates a bitstream object.
        * @param {Array} The array to treat as a bitstream.
        * @param {number} The number of bits per index.
        * @return {Object.<string, number|function>}
        * * **/
        Utils.bitStream = function Utils_bitStream(array, bitsper) {
            var data = array.slice();
            return {
                length : data.length*bitsper,
                at : function(i) {
                    var ndx = Math.floor(i/bitsper);
                    var x = i%bitsper + 1;
                    return data[ndx] >> (bitsper-x) & 1;
                }
            };
        };
        /** * *
        * Stores a string in image data.
        * @param {string} The message to store.
        * @return {ImageData} The resulting image data.
        * * **/
        Utils.packStringIntoImageData = function Utils_packStringIntoImageData(string) {
            /** * *
            * Tightly packs a string of 7bit ASCII characters into an array.
            * @param {string}
            * @return {Array}
            * * **/
            function packStringIntoArray(string) {
                var dataToPack = Array.prototype.map.call(string, function(el,ndx) {
                    return string.charCodeAt(ndx);
                });
                var stream = Utils.bitStream(dataToPack, 7);
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
            var pixelsNeeded = Math.ceil(packedData.length/3);
            var dimensions = Utils.squarifyLength(pixelsNeeded);
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
            console.log('string length:',string.length,'compressed length:',packedData.length,'image data length:',packed.data.length,'pixels needed:',pixelsNeeded,'dimensions:',dimensions,'wasted:',dimensions[0]*dimensions[1]-pixelsNeeded);
            return packed;
        };
        /** * *
        * Unpacks a string from an ImageData object.
        * @param {ImageData}
        * @return {string} 
        * * **/
        Utils.unpackImageDataToString = function Utils_unpackImageDataToString(imageData) {
            var data = [];
            var acc = 0;
            for (var i=0; i < imageData.data.length; i++) {
                if (++acc === 4) {
                    acc = 0;
                    continue;
                }
                data.push(imageData.data[i]);
            }
            
            function unpackStringFromArray(data) {
                var stream = Utils.bitStream(data, 8);
                var string = '';
                var code = 0;
                var acc = 0;
                for (var i=0; i < stream.length; i++) {
                    var bit = stream.at(i);
                    if (acc === 7) {
                        if (code === 0) {
                            // Null terminating...
                            return string;
                        }
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
        /** * *
        * Returns the PNG representation of a string.
        * Packs the string's 7bit characters tightly into 
        * each pixel's 3 8bit RGB channels.
        * Be warned that specifying a type parameter of a 
        * lossy format will result in the loss of the packed 
        * string's integrity (meaning don't use it. Use PNG
        * or GIF, since they're lossless.z)
        * @param {string}
        * @param {string}
        * @return {HTMLImageElement}
        * * **/
        Utils.StringToImage = function Utils_StringToImage(string, type) {
            var imageData = Utils.packStringIntoImageData(string);
            var c = document.createElement('canvas');
            c.width = imageData.width;
            c.height = imageData.height;
            var ctx = c.getContext('2d');
            ctx.putImageData(imageData, 0, 0);
            var src = c.toDataURL(type);
            var img = document.createElement('img');
            img.src = src;
            return img;
        };
        /** * *
        * Returns the String representation of the data stored
        * in the RGB channels of a loaded Image.
        * The image must be loaded!
        * @param {HTMLImageElement}
        * @return {string}
        * * **/
        Utils.ImageToString = function Utils_PNGToString(image) {
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            var imageData = ctx.getImageData(0, 0, image.width, image.height);
            if (imageData) {
                var string = Utils.unpackImageDataToString(imageData);
                return string;
            }
            return false;
        };
        
        return Utils;
    }
});
