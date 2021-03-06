/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* bang.js
* The bang library unpacker.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Mon Mar 26 18:56:24 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
(function initBangUnpacker(window) {
    function bitStream(array, bitsper) {
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
        };
    }
    function unpackImageDataToString(imageData) {
        /** * *
        * Unpacks a message from an ImageData object.
        * @param imageData
        * @return String 
        * * **/
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
            var stream = bitStream(data, 8);
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
    }
    function initElementWithSrcImage(element, srcImage) {
        var img = new Image();
        img.onload = function loadedImageSrc() {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var imageData = ctx.getImageData(0, 0, img.width, img.height);
            if (imageData) {
                var src = unpackImageDataToString(imageData);
                // Inside the devil's den there is evil...
                var main = eval(src);
                if (typeof main === 'function') {
                    // Give the program its entry point and
                    // store whatever it creates in a new context...
                    var context = main(element);
                    window.bang.contexts = window.bang.contexts || {};
                    window.bang.contexts[element.id] = context;
                }
            } else {
                throw new Error('Could not get image data.');
            }
        };
        img.onerror = function loadError(e) {
            throw new Error(e);
        };
        img.src = srcImage;
    }
    // The actual initializer...
    window.bang = function() {
        var bangElements = Array.prototype.slice.call(document.getElementsByClassName('bang'));
        for(var i = 0; i < bangElements.length; i++) {
            var el = bangElements[i];
            var src = el.dataset.source;
            var id = el.id || 'bang_'+i;
            el.id = id;
            var context = initElementWithSrcImage(el, src);
        }
    };
}(window));