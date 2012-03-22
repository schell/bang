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
            if (!_haveToDataURL) {
                //--------------------------------------
                //  BUFFER HELPERS
                //--------------------------------------
                /**
                * A handy class to calculate color values.
                *
                * @version 1.0
                * @author Robert Eisele <robert@xarg.org>
                * @copyright Copyright (c) 2010, Robert Eisele
                * @link http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/
                * @license http://www.opensource.org/licenses/bsd-license.php BSD License
                **/
                function PNGEncoder_write(buffer, offs) {
                    /** * *
                    * Writes some bytes to a buffer starting at offset offs.
                    * @param buffer A buffer to write to.
                    * @param offs An offset to begin writing to.
                    * @param ... The data to write to the buffer.
                    * * **/
                    for (var i = 2; i < arguments.length; i++) {
                        for (var j = 0; j < arguments[i].length; j++) {
                            buffer[offs++] = arguments[i].charAt(j);
                        }
                    }
                }
                function PNGEncoder_byte2(w) {
                    /** * *
                    * Returns a two byte string from w.
                    * @param w The Number to convert.
                    * @return String
                    * * **/
                    return String.fromCharCode((w >> 8) & 255, w & 255);
                }
                function PNGEncoder_byte4(w) {
                    /** * *
                    * Returns a four byte string from w.
                    * @param w The Number to convert.
                    * @return String
                    * * **/
                    return String.fromCharCode((w >> 24) & 255, (w >> 16) & 255, (w >> 8) & 255, w & 255);
                }
                function PNGEncoder_byte2lsb(w) {
                    /** * *
                    * Returns a two byte string from w with the signed byte on the left.
                    * @param w The Number to convert.
                    * @return String
                    * * **/
                    return String.fromCharCode(w & 255, (w >> 8) & 255);
                }
                // The color depth of the png...
                m.safeAddin(self, 'depth', 256);
                // The buffer to fill with data...
                m.safeAddin(self, 'buffer', []);
                //--------------------------------------
                //  PRIVATES
                //--------------------------------------
                // The pixel data and row filter identifier size...
                var _pix_size = self.height * (self.width + 1);

                // The eflate header, pix_size, block headers, adler32 checksum
                var _data_size = 2 + _pix_size + 5 * Math.floor((0xfffe + _pix_size) / 0xffff) + 4;

                // The offsets and sizes of Png chunks
                var _ihdr_offs = 0;                          // IHDR offset and size
                var _ihdr_size = 4 + 4 + 13 + 4;
                var _plte_offs = _ihdr_offs + _ihdr_size;    // PLTE offset and size
                var _plte_size = 4 + 4 + 3 * self.depth + 4;
                var _trns_offs = _plte_offs + _plte_size;    // tRNS offset and size
                var _trns_size = 4 + 4 + self.depth + 4;
                var _idat_offs = _trns_offs + _trns_size;    // IDAT offset and size
                var _idat_size = 4 + 4 + _data_size + 4;
                var _iend_offs = _idat_offs + _idat_size;    // IEND offset and size
                var _iend_size = 4 + 4 + 4;
                var _buffer_size  = _iend_offs + _iend_size; // total PNG size

                _palette = {};
                _pindex  = 0;
            
                var _crc32 = [];

                // Initialize buffer with zero bytes
                for (var i = 0; i < _buffer_size; i++) {
                    self.buffer[i] = "\x00";
                }

                // Initialize non-zero elements
                PNGEncoder_write(self.buffer, _ihdr_offs, PNGEncoder_byte4(_ihdr_size - 12), 'IHDR', PNGEncoder_byte4(self.width), PNGEncoder_byte4(self.height), "\x08\x03");
                PNGEncoder_write(self.buffer, _plte_offs, PNGEncoder_byte4(_plte_size - 12), 'PLTE');
                PNGEncoder_write(self.buffer, _trns_offs, PNGEncoder_byte4(_trns_size - 12), 'tRNS');
                PNGEncoder_write(self.buffer, _idat_offs, PNGEncoder_byte4(_idat_size - 12), 'IDAT');
                PNGEncoder_write(self.buffer, _iend_offs, PNGEncoder_byte4(_iend_size - 12), 'IEND');

                // Initialize deflate header
                var header = ((8 + (7 << 4)) << 8) | (3 << 6);
                header+= 31 - (header % 31);

                PNGEncoder_write(self.buffer, _idat_offs + 8, PNGEncoder_byte2(header));

                // Initialize deflate block headers
                for (i = 0; (i << 16) - 1 < _pix_size; i++) {
                    var size, bits;
                    if (i + 0xffff < _pix_size) {
                        size = 0xffff;
                        bits = "\x00";
                    } else {
                        size = _pix_size - (i << 16) - i;
                        bits = "\x01";
                    }
                    PNGEncoder_write(self.buffer, _idat_offs + 8 + 2 + (i << 16) + (i << 2), bits, PNGEncoder_byte2lsb(size), PNGEncoder_byte2lsb(~size));
                }

                // Create crc32 lookup table...
                for (i = 0; i < 256; i++) {
                    var c = i;
                    for (var j = 0; j < 8; j++) {
                        if (c & 1) {
                            c = -306674912 ^ ((c >> 1) & 0x7fffffff);
                        } else {
                            c = (c >> 1) & 0x7fffffff;
                        }
                    }
                    _crc32[i] = c;
                }
                //--------------------------------------
                //  BACKUP PNGLIB FUNCTIONS
                //--------------------------------------
                // compute the index into a png for a given pixel
                m.safeAddin(self, 'index', function PNGEncoder_Backup_index(x,y) {
                    /** * *
                    * Computes the index into a png for a given pixel.
                    * @param x The x pixel.
                    * @param y The y pixel.
                    * @return The index of pixel x,y.
                    * * **/
                    var i = y * (self.width + 1) + x + 1;
                    var j = _idat_offs + 8 + 2 + 5 * Math.floor((i / 0xffff) + 1) + i;
                    return j;
                });
                m.safeAddin(self, 'color', function PNGEncoder_Backup_color(red, green, blue, alpha) {
                    /** * *
                    * Converts a color and builds up the palette.
                    * @param red The red channel value.
                    * @param green The red channel value.
                    * @param blue The red channel value.
                    * @param alpha The red channel value.
                    * @return The palette color value.
                    * * **/
                    alpha = alpha >= 0 ? alpha : 255;
                    var color = (((((alpha << 8) | red) << 8) | green) << 8) | blue;

                    if (typeof _palette[color] == "undefined") {
                        if (_pindex == self.depth) {
                            return "\x00";
                        }

                        var ndx = _plte_offs + 8 + 3 * _pindex;

                        self.buffer[ndx + 0] = String.fromCharCode(red);
                        self.buffer[ndx + 1] = String.fromCharCode(green);
                        self.buffer[ndx + 2] = String.fromCharCode(blue);
                        self.buffer[_trns_offs+8+_pindex] = String.fromCharCode(alpha);

                        _palette[color] = String.fromCharCode(_pindex++);
                    }
                    return _palette[color];
                });
                m.safeAddin(self, 'palette', function PNGEncoder_Backup_palette() {
                    /** * *
                    * Returns the current color palette.
                    * @return Array
                    * * **/
                    return _palette;
                });
                m.safeAddin(self, 'setPixel', function PNGEncoder_Backup_setPixel(x,y, r,g,b,a) {
                    /** * *
                    * Sets a pixel at x,y to the color r,g,b,a
                    * * **/
                    x = x || 0;
                    y = y || 0;
                
                    self.buffer[self.index(x,y)] = self.color(r,g,b,a);
                });
                m.safeAddin(self, 'getDump', function PNGEncoder_Backup_getDump() {
                    /** * *
                    * Outputs a PNG string.
                    * @return String
                    * * **/
                    // compute adler32 of output pixels + row filter bytes
                    var BASE = 65521; /* largest prime smaller than 65536 */
                    var NMAX = 5552;  /* NMAX is the largest n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1 */
                    var s1 = 1;
                    var s2 = 0;
                    var n = NMAX;

                    for (var y = 0; y < self.height; y++) {
                        for (var x = -1; x < self.width; x++) {
                            s1+= self.buffer[self.index(x, y)].charCodeAt(0);
                            s2+= s1;
                            if ((n-= 1) === 0) {
                                s1%= BASE;
                                s2%= BASE;
                                n = NMAX;
                            }
                        }
                    }
                    s1%= BASE;
                    s2%= BASE;
                    PNGEncoder_Backup_write(self.buffer, _idat_offs + _idat_size - 8, PNGEncoder_Backup_byte4((s2 << 16) | s1));

                    // Compute crc32 of the PNG chunks...
                    function crc32(png, offs, size) {
                        var crc = -1;
                        for (var i = 4; i < size-4; i += 1) {
                            crc = _crc32[(crc ^ png[offs+i].charCodeAt(0)) & 0xff] ^ ((crc >> 8) & 0x00ffffff);
                        }
                        PNGEncoder_Backup_write(png, offs+size-4, PNGEncoder_Backup_byte4(crc ^ -1));
                    }

                    crc32(self.buffer, _ihdr_offs, _ihdr_size);
                    crc32(self.buffer, _plte_offs, _plte_size);
                    crc32(self.buffer, _trns_offs, _trns_size);
                    crc32(self.buffer, _idat_offs, _idat_size);
                    crc32(self.buffer, _iend_offs, _iend_size);

                    // Convert PNG to string
                    return "\211PNG\r\n\032\n"+self.buffer.join('');
                
                });
                m.safeAddin(self, 'getBase64', function PNGEncoder_Backup_getBase64() {
                    /** * *
                    * Outputs a Base64 encoded PNG string.
                    * @return String
                    * * **/
                    var s = self.getDump();
                
                    if (typeof window.btoa === 'function') {
                        return window.btoa(s);
                    }

                    var ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                    var c1, c2, c3, e1, e2, e3, e4;
                    var l = s.length;
                    var i = 0;
                    var r = "";

                    do {
                        c1 = s.charCodeAt(i);
                        e1 = c1 >> 2;
                        c2 = s.charCodeAt(i+1);
                        e2 = ((c1 & 3) << 4) | (c2 >> 4);
                        c3 = s.charCodeAt(i+2);
                        if (l < i+2) { e3 = 64; } else { e3 = ((c2 & 0xf) << 2) | (c3 >> 6); }
                        if (l < i+3) { e4 = 64; } else { e4 = c3 & 0x3f; }
                        r+= ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
                    } while ((i+= 3) < l);
                    return r;
                });
            } else {
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
            }

            return self;
        };
        addin.PNGDataFromBitmap = function PNGEncoder_PNGSrcFromBitmap(bitmap) {
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