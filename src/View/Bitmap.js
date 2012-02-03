/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Bitmap.js
* The Bitmap Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Thu Feb  2 11:12:24 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Bitmap',
    dependencies : [ 'Global.js', 'View/View.js', 'Notifications.js', 'Error/BitmapLoadError.js', 'Error/BitmapSecurityError.js' ],
    init : function initBitmap (m) {
        /** * *
        * Initializes the Bitmap Addin
        * @param - m Object - The mod modules object.
        * * **/
        
        var addin = function addinBitmap (self) {
            /** * *
            * Adds Bitmap properties to *self*.
            * @param - self Object - The object to add Bitmap properties to.
            * @return self Bitmap Object 
            * * **/
            self = m.Object(self); 
            
            // Addin View
            m.View(self);
            
            // A reference to this Bitmap's image tag...
            m.safeAddin(self, 'image', undefined);
            
            m.safeAddin(self, 'load', function Bitmap_load(src) {
                /** * *
                * Loads a bitmap image.
                * @param - src String
                * * **/
                var image = new Image();
                image.onload = function onLoadImage() {
                    self.image = image;
                    self.sendNotification(m.Notifications.DID_LOAD, src);
                };
                image.onerror = function onErrorImage() {
                    var error = m.BitmapLoadError({
                        message : 'Bitmap could not load '+src
                    });
                    self.sendNotification(m.Notifications.DID_NOT_LOAD, error);
                };
                image.src = src;
            });
            
            m.safeAddin(self, 'getImageData', function Bitmap_bitmapData() {
                /** * *
                * Returns the image data of this Bitmap, or false if no image is loaded.
                * @returns - ImageData
                * * **/
                if (!m.defined(self.image)) {
                    return false;
                }
                var image = self.image;
                // Create a canvas to extract the bitmap data with...
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                    
                var context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                    
                var securityError;
                var imageData;
                try {
                    imageData = context.getImageData(0, 0, image.width, image.height);
                } catch (e) {
                    securityError = e;
                }
                if (securityError) {
                    return false;
                }
                
                return imageData;
            });
            
            m.safeOverride(self, 'draw', 'view_draw', function Bitmap_draw() {
                /** * *
                * Draws this bitmap into the 2d context.
                * * **/
                self.applyTransform();
                
                self.context.drawImage(self.image, 0, 0);
                
                for (var i=0; i < self.drawQueue.length; i++) {
                    var drawFunc = self.drawQueue[i];
                    drawFunc();
                }
                
                self.restoreTransform();
                
            });
            
            
            return self;
        };
        
        return addin;
        
    }
});
