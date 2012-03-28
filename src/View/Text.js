/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Text.js
* The Text addin.
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Fri Mar 16 16:14:15 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Text',
    dependencies : [ 'bang::View/View.js' ],
    init : function initText (m) {
        /** * *
        * Initializes the Text Addin
        * @param - m Object - The mod modules object.
        * * **/
        var addin = function addinText (self) {
            /** * *
            * Adds Text properties to *self*.
            * @param - self Object - The object to add Text properties to.
            * @return self Text Object 
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
            m.safeAddin(self, 'fillStyle', 'rgb(0, 0, 0)');
            // The initial text outline color...
            m.safeAddin(self, 'strokeStyle', 'rgba(0, 0, 0, 0)');
            // Whether or not to fit the text into the hit area rectangle...
            m.safeAddin(self, 'shouldWrapText', true);
            // Whether or not to fit the bottom of the hit area to the bottom of the text...
            m.safeAddin(self, 'shouldAutoSize', true);
            // The height of each successive line of text in pixels (only used when wrapping)...
            m.safeAddin(self, 'lineHeight', 12);
            //--------------------------------------
            //  CONTEXT TRANSFORMATION
            //--------------------------------------
            // Whether or not this view's transformations have been applied...
            var _transformApplied = false;
            m.safeOverride(self, 'applyTransform', 'view_applyTransform', function Text_applyTransform() {
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
                self.context.fillStyle = self.fillStyle;
                self.context.strokeStyle = self.strokeStyle;
                self.view_applyTransform();
            });
            m.safeOverride(self, 'restoreTransform', 'view_restoreTransform', function Text_restoreTransform(params) {
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
            // The text broken up into lines in order to fit the bounding box...
            var _lines = [];
            m.safeOverride(self, 'draw', 'view_draw', function Text_draw() {
                /** * *
                * Draws this view into the 2d context.
                * * **/
                self.applyTransform();
                if (self.shouldWrapText) {
                    // We may have to add newlines to the supplied text...
                    if (_lines.join(' ') !== self.text.split('\n').join(' ')) {
                        // Either we have not set _lines or self.text has changed,
                        // so we need to re-process this text to fit it into the hitArea...
                        var sections = self.text.split('\n');
                        for (var i=0; i < sections.length; i++) {
                            var line = sections[i];
                            var split = line.split(' ');
                            var len = split.length;
                            var n = 0;
                            var s = '';
                            while (n < len) {
                                while ((self.context.measureText(s+split[n]).width < self.hitArea.width()) && (n < len)) {
                                    // Add a word to the string and increment n...
                                    s += split[n] + ' ';
                                    n++;
                                }
                                // Pop off that last space...
                                s = s.substr(0,s.length-1);
                                _lines.push(s);
                                s = '';
                            }
                        }
                    }
                    if (self.shouldAutoSize) {
                        self.hitArea = m.Rectangle.from(self.hitArea.x(), self.hitArea.y(), self.hitArea.width(), _lines.length*self.lineHeight);
                    }
                } else {
                    _lines = [self.text];
                }
                for (var j=0; j < _lines.length; j++) {
                    var text = _lines[j];
                    self.context.fillText(text, self.hitArea.x(), self.hitArea.y()+j*self.lineHeight);
                    self.context.strokeText(text, self.hitArea.x(), self.hitArea.y()+j*self.lineHeight);
                }                    
                self.restoreTransform();
                self.view_draw();
            });
            
            return self;
        };
        
        return addin;
        
    }
});
