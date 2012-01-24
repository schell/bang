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
        
        var view = m.View({
            tag : 'view'
        });
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
        
        var calledUpdateContext = false;
        view.addInterest(view, m.Notifications.DID_UPDATE_CONTEXT, function updatedContext(note) {
            calledUpdateContext = true;
        });
        var container = m.ViewContainer({
            tag : 'container'
        });
        container.context = 1000;
        container.addSubview(view);
        assert.eq(container.subviews().length, 1, 'ViewContainer can add subviews.');
        assert.eq(view.parent === container, true, 'ViewContainers set their subview\'s parent property to itself.');
        assert.eq(view.context, 1000, 'Views update their context when added to parent.');
        assert.eq(calledUpdateContext, true, 'View sends notification when context is updated.');
        
        var topOfTree = m.ViewContainer({
            tag : 'tree_0'
        });
        var treeLength = 10;
        var lastBranch = topOfTree;
        for (var i=0; i < treeLength; i++) {
            var branch = m.ViewContainer({
                tag : 'tree_'+(i+1).toString()
            });
            lastBranch.addSubview(branch);
            lastBranch = branch;
        }
        
        topOfTree.context = 666;
        topOfTree.sendNotification(m.Notifications.DID_UPDATE_CONTEXT, topOfTree.context);
        assert.eq(lastBranch.context, 666, 'Branches of displaylist update context when update note sent.');
        
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
        assert.eq(m.defined(view.context) && view.context === stage.context, true, 'Subviews inherit parent\'s context.');
        
        function makeDrawFunction(view, color) {
            return function () {
                view.context.save();
                view.context.fillStyle = color;
                view.context.fillRect(0, 0, view.frame.size.width, view.frame.size.height);
                view.context.restore();
            };
        }
        
        var red = m.View({
            frame : m.Rectangle.from(-50, -50, 100, 100),
            scale : m.Size.from(0.5, 1.0)
        });
        red.addToString(function(){return '[red]';});
        red.drawQueue.push(makeDrawFunction(red, 'rgba(255, 0, 0, 0.5)'));
        
        var blue = m.View({
            frame : m.Rectangle.from(50, 50, 100, 100),
            scale : m.Size.from(0.5, 0.5)
        });
        blue.addToString(function(){return '[blue]';});
        blue.drawQueue.push(makeDrawFunction(blue, 'rgba(0, 0, 255, 0.5)'));
        
        var redAndBlue = m.ViewContainer({
            frame : m.Rectangle.from(100, 100, 100, 100)
        });
        redAndBlue.addSubview(red);
        redAndBlue.addSubview(blue);
        redAndBlue.drawQueue.push(makeDrawFunction(redAndBlue, 'rgba(0, 255, 0, 0.5)'));
        redAndBlue.addInterest(undefined, m.Notifications.FRAME_TICK, function tick(note) {
            red.rotation += 0.1;
            if (red.rotation > 180) {
                red.rotation = 0;
            }
        });
        redAndBlue.addToString(function(){return '[redAndBlue]';});
        
        stage.addSubview(redAndBlue);
        
        return {};
    }
});
