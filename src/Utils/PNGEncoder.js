/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* PNGEncoder.js
* A PNG encoder addin.
* Backup support modified from Robert Eisele's <robert@xarg.org> pnglib (http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/)
* Copyright (c) 2012 Schell Scivally. All rights reserved.
*
*@author    Schell Scivally
* @since    Mon Mar 19 11:21:39 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'PNGEncoder',
    dependencies : [ 'bang::Global.js', 'bang::Utils/Utils.js', 'bang::View/Bitmap.js' ],
    init : function initPNGEncoder (m) {
        /** * *
        * Initializes the PNGEncoder Addin
        * @param - m Object - The mod modules object.
        * * **/
        
        // Private var telling us whether or not we have toDataURL...
        var _haveToDataURL = function () {
            var canvas = document.createElement('canvas');
            return (typeof canvas.toDataURL === 'function');
        };
        
        var addin = function addinPNGEncoder (self) {
            /** * *
            * Adds PNGEncoder properties to *self*.
            * @param - self Object - The object to add PNGEncoder properties to.
            * @return self PNGEncoder Object 
            * * **/
            self = m.Object(self); 
            //--------------------------------------
            //  PROPERTIES
            //--------------------------------------
            // The pixel width of the png...
            m.safeAddin(self, 'width', 0);
            // The pixel height of the png...
            m.safeAddin(self, 'height', 0);
            if (!self.width || !self.height) {
                throw new Error('resulting png must have a width and height > 0');
            }
            // We can use canvas for png encoding...
            m.safeAddin(self, 'context', function createCanvasContext() {
                var canvas = document.createElement('canvas');
                canvas.width = self.width;
                canvas.height = self.height;
                return canvas.getContext('2d');
            }());
            m.safeAddin(self, 'buffer', function createBuffer() {
                return self.context.createImageData(self.width, self.height);
            }());
            m.safeAddin(self, 'setPixel', function PNGEncoder_setPixel(x,y, r,g,b,a) {
                /** * *
                * Sets a pixel at x,y to the color r,g,b,a
                * * **/
                var n = (y*self.width+x)*4;
                
                self.buffer.data[n]   = r;
                self.buffer.data[n+1] = g;
                self.buffer.data[n+2] = b;
                self.buffer.data[n+3] = a;
            });
            m.safeAddin(self, 'getBase64', function PNGEncoder_getBase64() {
                /** * *
                * Returns a base64 encoded PNG string.
                * @return String
                * * **/
                self.context.putImageData(self.buffer, 0, 0);
                var src = self.context.canvas.toDataURL();
                return src.replace('data:image/png;base64,','');
            });

            return self;
        };
        
        addin.PNGDataFromBitmap = function PNGEncoder_PNGDataFromBitmap(bitmap) {
            /** * *
            * Converts a Bitmap addin object to PNG string.
            * @param Bitmap
            * @return String Or false if operation failed.
            * * **/
            var imageData = bitmap.getImageData();
            if (imageData) {
                var encoder = m.PNGEncoder({
                    width : imageData.width, 
                    height : imageData.height
                });
                
                for (var y=0; y < imageData.height; y++) {
                    for (var x=0; x < imageData.width; x++) {
                        var n = (y*imageData.width+x)*4;
                        var r,g,b,a;
                        r = imageData.data[n];
                        g = imageData.data[n+1];
                        b = imageData.data[n+2];
                        a = imageData.data[n+3];
                        
                        encoder.setPixel(x,y, r,g,b,a);
                    }
                }
                return encoder.getBase64();
            } else {
                return false;
            }
        };
        addin.PNGSrcFromBitmap = function PNGEncoder_PNGSrcFromBitmap(bitmap) {
            /** * *
            * Convenience function that appends png image uri onto src.
            * * **/
            if (bitmap.image && bitmap.context && _haveToDataURL) {
                var canvas = document.createElement('canvas');
                canvas.width = bitmap.image.width;
                canvas.height = bitmap.image.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(bitmap.image);
                return canvas.toDataURL();
            }
            return 'data:image/png;base64,'+addin.PNGDataFromBitmap(bitmap);
        };
        addin.PNGDataFromString = function PNGEncoder_PNGDataFromString(string) {
            /** * *
            * Returns PNG image data generated from a string. 
            * Attempts to make a square PNG.
            * @param string The string to compress into a PNG.
            * @return String
            * * **/
            var numPixels = Math.ceil(string.length/4);
            var factors = m.Utils.findFactors(numPixels);
            var w,h;
            w = factors[0];
            h = factors[1];
            var encoder = m.PNGEncoder({
                width : w,
                height : h
            });
            m.charCodesIn = [];
            for (var y=0; y < h; y++) {
                for (var x=0; x < w; x++) {
                    var n = (y*w+x)*4;
                    var r,g,b,a;

                    r = string.charCodeAt(n) || 0;
                    g = string.charCodeAt(n+1) || 0;
                    b = string.charCodeAt(n+2) || 0;
                    a = string.charCodeAt(n+3) || 0;
                    m.charCodesIn = m.charCodesIn.concat([r,g,b,a]);
                    encoder.setPixel(x, y, r,g,b,a);
                }
            }
            return encoder.getBase64();
        };
        addin.PNGSrcFromString = function PNGEncoder_PNGSrcFromString(string) {
            /** * *
            * Convenience function that appends png image uri onto src.
            * * **/
            if (_haveToDataURL) {
                var imageData = m.Utils.packStringIntoImageData(string);
                var c = document.createElement('canvas');
                c.width = imageData.width;
                c.height = imageData.height;
                var ctx = c.getContext('2d');
                ctx.putImageData(imageData, 0, 0);
                return c.toDataURL();
            }
            return 'data:image/png;base64,'+addin.PNGDataFromString(string);
        };
        addin.PNGFromString = function PNGEncoder_PNGFromString(string) {
            /** * *
            * Convenience function that returns an html img object png from 
            * a string.
            * * **/
            var img = new Image();
            img.src = addin.PNGSrcFromString(string);
            return img;
        };
        addin.StringFromBitmap = function PNGEncoder_StringFromBitmap(bitmap) {
            /** * *
            * Returns a string of pixel data stored in a Bitmap.
            * @param bitmap
            * @return String Or false if operation failed.
            * * **/
            if (bitmap.image) {
                var imageData = bitmap.getImageData();
                return m.Utils.unpackImageDataToString(imageData);
            }
            return false;
        };
        
        return addin;
    }
});