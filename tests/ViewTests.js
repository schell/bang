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
                view.context.fillRect(view.hitArea.left(), view.hitArea.top(), view.hitArea.size().width(), view.hitArea.size().height());
                view.context.restore();
            };
        }
        
        var red = m.View({
            hitArea : m.Rectangle.from(-50, -50, 100, 100),
            transform : m.Matrix().scale(0.5, 0.5)
        });
        red.addToString(function(){return '[red]';});
        red.drawQueue.push(makeDrawFunction(red, 'rgb(255, 0, 0)'));
        
        var blue = m.View({
            hitArea : m.Rectangle.from(0, 0, 100, 100),
            transform : m.Matrix().translate(50, 50).scale(0.6, 0.6),
            alpha : 0.5
        });
        blue.addToString(function(){return '[blue]';});
        blue.drawQueue.push(makeDrawFunction(blue, 'rgb(0, 0, 255)'));
        
        var green = m.ViewContainer({
            hitArea : m.Rectangle.from(0, 0, 100, 100),
            transform : m.Matrix().translate(100, 100),
            alpha : 0.5
        });
        green.addSubview(red);
        green.addSubview(blue);
        green.drawQueue.push(makeDrawFunction(green, 'rgb(0, 255, 0)'));
        green.addInterest(undefined, m.Notifications.FRAME_TICK, function tick(note) {
            red.transform.rotate(2);
        });
        green.addToString(function(){return '[redAndBlue]';});
        stage.addSubview(green);
        
        return {};
    }
});
