/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Video.js
* The video view addin.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Wed Mar 28 12:36:30 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Video',
    dependencies : [ 'bang::Global.js', 'bang::View/Bitmap.js' ],
    init : function initVideo (m) {
        /** * *
        * Initializes the Video Addin
        * @param - m Object - The mod modules object.
        * * **/
        
        var addin = function addinVideo (self) {
            /** * *
            * Adds Video properties to *self*.
            * @param - self Object - The object to add Video properties to.
            * @return self Video Object 
            * * **/
            self = m.Object(self); 
            
            // Add in Bitmap
            m.Bitmap(self);
            
            m.safeOverride(self, 'load', 'bitmap_load', function Video_load(src) {
                /** * *
                * Loads a video.
                * @param String The source path of the video to load.
                * * **/
                var video = document.createElement('video');
                video.autoplay = true;
                video.addEventListener('loadstart', function onLoadVideoStart(e) {
                });
                video.addEventListener('progress', function onLoadVideoProgress(e) {
                });
                video.addEventListener('canplay', function onLoadVideoCanPlay(e) {
                    self.image = video;
                    self.video = video;
                    self.sendNotification(m.Notifications.Network.DID_LOAD, src);
                });
                video.addEventListener('error', function onErrorVideo(e) {
                    var error = m.LoadError({
                        message : 'Video could not load '+src
                    });
                    self.sendNotification(m.Notifications.Network.DID_NOT_LOAD, error);
                });
                video.src = src;
                video.load();
            });
            
            return self;
        };
        
        return addin;
        
    }
});
