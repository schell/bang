/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* TextView.js
* The TextView addin.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Fri Mar 16 16:14:15 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'TextView',
    dependencies : [ 'Bang/View/View.js' ],
    init : function initTextView (m) {
        /** * *
        * Initializes the TextView Addin
        * @param - m Object - The mod modules object.
        * * **/
        var addin = function addinTextView (self) {
            /** * *
            * Adds TextView properties to *self*.
            * @param - self Object - The object to add TextView properties to.
            * @return self TextView Object 
            * * **/
            self = m.Object(self); 
            
            m.View(self);
            
            // The initial text...
            m.safeAddin(self, 'text', '');
            // The initial font styling...
            m.safeAddin(self, 'font', '12px sans-serif');
            // The initial baseline setting...
            m.safeAddin(self, 'textBaseline', 'top');
            // The initial text alignment...
            m.safeAddin(self, 'textAlign', 'left');
            // The initial text color...
            m.safeAddin(self, 'textColor', 'rgb(0, 0, 0)');
            //--------------------------------------
            //  CONTEXT TRANSFORMATION
            //--------------------------------------
            // Whether or not this view's transformations have been applied...
            var _transformApplied = false;
            m.safeOverride(self, 'applyTransform', 'view_applyTransform', function TextView_applyTransform() {
                /** * *
                * Applies this view's transform to its context.
                * * **/
                if (_transformApplied) {
                    return;
                }
                _transformApplied = true;
                
                self.context.save();
                
                self.context.font = self.font;
                self.context.textBaseline = self.textBaseline;
                self.context.textAlign = self.textAlign;
                self.context.fillStyle = self.textColor;
                self.view_applyTransform();
            });
            m.safeOverride(self, 'restoreTransform', 'view_restoreTransform', function TextView_restoreTransform(params) {
                /** * *
                * Restores the context to its state before applying the transforming
                * operations of this view.
                * * **/
                if (_transformApplied) {
                    _transformApplied = false;
                    self.context.restore();
                }
                self.view_restoreTransform();
            });
            m.safeOverride(self, 'draw', 'view_draw', function TextView_draw() {
                /** * *
                * Draws this view into the 2d context.
                * * **/
                self.applyTransform();
                self.context.fillText(self.text, 0, 0);
                self.restoreTransform();
                self.view_draw();
            });
            
            return self;
        };
        
        return addin;
        
    }
});
