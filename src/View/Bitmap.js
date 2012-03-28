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
    dependencies : [ 'bang::Global.js', 'bang::View/View.js', 'bang::Notifications.js', 'bang::Error/LoadError.js', 'bang::Error/SecurityError.js' ],
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
            
            // A width and height in case someone wants to set a specific w&h...
            m.safeAddin(self, 'width', false);
            m.safeAddin(self, 'height', false);
            
            m.safeAddin(self, 'load', function Bitmap_load(src) {
                /** * *
                * Loads a bitmap image.
                * @param - src String
                * * **/
                var image = new Image();
                image.onload = function onLoadImage() {
                    self.image = image;
                    self.sendNotification(m.Notifications.Network.DID_LOAD, src);
                };
                image.onerror = function onErrorImage() {
                    var error = m.LoadError({
                        message : 'Bitmap could not load '+src
                    });
                    self.sendNotification(m.Notifications.Network.DID_NOT_LOAD, error);
                };
                image.src = src;
            });
            m.safeAddin(self, 'getImageData', function Bitmap_bitmapData() {
                /** * *
                * Returns the image data of this Bitmap, or false if no image is loaded.
                * @returns - ImageData
                * * **/
                if (!('image' in self)) {
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
                if (self.image) {
                    if (self.width && self.height) {
                        self.context.drawImage(self.image, 0, 0, self.width, self.height);
                    } else {
                        self.context.drawImage(self.image, 0, 0);
                    }
                }
                self.restoreTransform();
                self.view_draw();
            });
            
            
            return self;
        };
        
        return addin;
        
    }
});
