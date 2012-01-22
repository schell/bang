/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* ViewTests.js
* Testing for the View Addin
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue Jan 17 16:36:44 PST 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'ViewTests',
    dependencies : [ 'View/View.js', 'View/ViewContainer.js', 'View/Stage.js' ],
    init : function initViewTests (m) {
        /** * *
        * Initializes the ViewTests
        * @param - m Object - The mod modules object.
        * * **/
        var assert = m.assert;
        assert.testSuite = 'View Tests';
        
        var view = m.View();
        var payload = false;
        var callback = function(note) {
            payload = note.body;
        };
        view.addInterest(view, 'a note name', callback);
        view.dispatch(m.Note({
            name : 'a note name',
            body : 666
        }));
        assert.eq(payload, 666, 'View can add interests and dispatch notifications.');
           
        view.removeInterest(view, 'a note name');
        view.dispatch(m.Note({
            name : 'a note name',
            body : 777
        }));
        assert.eq(payload, 666, 'View can remove interests.');
        
        assert.testSuite = 'ViewContainer Tests';
        
        var container = m.ViewContainer();
        container.addSubview(view);
        assert.eq(container.subviews().length, 1, 'ViewContainer can add subviews.');
        
        assert.testSuite = 'Stage Tests';
        
        var stage = m.Stage();
        assert.eq('canvas' in stage, true, 'Stage has canvas instance.');
        assert.eq('id' in stage.canvas, true, 'Stage.canvas has id.');
        assert.eq('context' in stage && m.defined(stage.context), true, 'Stage has 2d context.');
        
        var throwsError = false;
        try {
            stage.setParentElement('asdf');
        } catch (e) {
            throwsError = true;
        }
        assert.eq(throwsError, true, 'Stage throws error if parent DNE.');
        
        var parentDiv = document.createElement('div');
        parentDiv.id = 'bang';
        document.body.appendChild(parentDiv);
        stage.setParentElement('bang');
        assert.eq(document.getElementById(stage.canvas.id) !== null, true, 'Stage is injected into parent div.');
        
        stage.addSubview(view);
        assert.eq(m.defined(view.context) && view.context === stage.context, true, 'ViewContainers set their subview\'s context.');
        
        function makeDrawFunction(view, color) {
            return function () {
                view.context.save();
                view.context.fillStyle = color;
                view.context.fillRect(view.frame.origin.x, view.frame.origin.y, view.frame.size.width, view.frame.size.height);
                view.context.restore();
            };
        }
        
        var red = m.View({
            frame : m.Rectangle.from(10, 10, 100, 100)
        });
        red.drawQueue.push(makeDrawFunction(red, 'rgba(255, 0, 0, 1.0)'));
        
        var blue = m.View({
            frame : m.Rectangle.from(0, 0, 100, 100)
        });
        blue.drawQueue.push(makeDrawFunction(blue, 'rgba(0, 0, 255, 0.5)'));
        
        stage.addSubview(red);
        stage.addSubview(blue);
        
        return {};
    }
});
