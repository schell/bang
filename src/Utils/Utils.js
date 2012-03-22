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
            var w = 1;
            var scan = w;
            var h = len;
            while (scan < h) {
                var ph = len/scan;
                if (ph%1 === 0) {
                    h = ph;
                    w = scan;
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
         
        utils.packStringIntoImageData = function packStringIntoImageData(string) {
            /** * *
            * Packs a string message into an ImageData object.
            * @param string The message to store.
            * @return ImageData
            * * **/
            // We can fit 3 chars into each pixel...
            var pixelsNeeded = Math.ceil(string.length/3);
            var dimensions = utils.squarifyLength(pixelsNeeded, 3);
            var ctx = document.createElement('canvas').getContext('2d');
            var packed = ctx.createImageData(dimensions[0], dimensions[1]);
            var ndx = 0;
            Array.prototype.map.call(string, function packChannel(el) {
                if ((ndx+1)%4 === 0) {
                    // This is alpha channel, push 255 because of canvas's using
                    // pre-multiplied alpha stuffs...
                    packed.data[ndx++] = 255;
                }
                packed.data[ndx++] = el.charCodeAt(0);
            });
            packed.data[ndx] = 255;
            console.log('string.length:',string.length,'pixels:',pixelsNeeded,'dimensions:',dimensions,'wasted pixels:',dimensions[0]*dimensions[1] - pixelsNeeded);
            return packed;
        };
            
        utils.unpackImageDataToString = function unpackImageDataToString(imageData) {
            /** * *
            * Unpacks a message from an ImageData object.
            * @param imageData
            * @return String 
            * * **/
            var s = '';
            for (var i=0; i < imageData.data.length && imageData.data[i]; i++) {
                if (i%4 !== 3) {
                    s += String.fromCharCode(imageData.data[i]);
                }
            }
            while (s[s.length-1] === ' ') {
                s = s.substr(0, s.length-1);
            }
            return s;
        };
        
        return utils;
    }
});
