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
    dependencies : [ 'submodules/go/go.js', 'Bang/Ease/Ease.js', 'Bang/View/View.js', 'Bang/View/ViewContainer.js', 'Bang/View/Stage.js' ],
    init : function initViewTests (m) {
        /** * *
        * Initializes the ViewTests
        * @param - m Object - The mod modules object.
        * * **/
        return function runViewTests(callback) {
            var assert = m.assert;
            assert.testSuite = 'View Tests';
        
            var view = m.View({
                tag : 'view'
            });
            var payload = false;
            var cb = function(note) {
                payload = note.body;
            };
            view.addInterest(view, 'a note name', cb);
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
            
            stage.setParentElement('bang');
            assert.eq(document.getElementById(stage.canvas.id) !== null, true, 'Stage is injected into parent div.');
        
            stage.addSubview(view);
            assert.eq(m.defined(view.context) && view.context === stage.context, true, 'Subviews inherit parent\'s context.');
        
            var rsTest = m.View();
            rsTest.scaleX = 0.5;
            rsTest.rotation = 45;
            assert.eq(rsTest.scaleX, 0.5, 'Rotation does not affect store scaleX value.');
            assert.eq(rsTest.rotation, 45, 'ScaleX does not affect store rotation value.');
        
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
                scaleX : 0.5,
                scaleY : 0.5
            });
            red.alpha = 0.5;
            red.addToString(function(){return '[red]';});
            red.drawQueue.push(makeDrawFunction(red, 'rgb(255, 0, 0)'));
        
            var blue = m.View({
                hitArea : m.Rectangle.from(0, 0, 100, 100),
                x : 100,
                y : 100,
                scaleX : 0.5,
                scaleY : 0.5
            });
            red.alpha = 0.5;
            blue.addToString(function(){return '[blue]';});
            blue.drawQueue.push(makeDrawFunction(blue, 'rgb(0, 0, 255)'));
            var green = m.ViewContainer({
                hitArea : m.Rectangle.from(0, 0, 100, 100),
                x : 200,
                y : 200,
                rotation : 0
            });
            green.addSubview(red);
            green.addSubview(blue);
            green.drawQueue.push(makeDrawFunction(green, 'rgb(0, 255, 0)'));
            green.addInterest(undefined, m.Notifications.FRAME_TICK, function tick(note) {
                red.rotation += 2;
                blue.rotation += 2;
                green.rotation -= 2;
            });
            green.addToString(function(){return '[redAndBlue]';});
            stage.addSubview(green);
            
            function testGreenEasing(cb) {
                console.log('green easing test');
                var ease = m.Ease({
                    properties : {
                        alpha : 0.1
                    },
                    duration : 1000,
                    target : green,
                    equation : 'easeInOutExpo'
                });
                ease.onComplete = cb;
                ease.interpolate();
            }
            function testScaledEasing(cb) {
                var scaled = m.View({
                    hitArea : m.Rectangle.from(0, 0, 500, 10)
                });
                scaled.drawQueue.push(makeDrawFunction(scaled, 'rgb(0, 255, 255)'));
                scaled.scaleX = 0;
                scaled.tween = m.Ease({
                    target : scaled,
                    duration : 500,
                    properties : {
                        scaleX : 1.0
                    }
                });
                scaled.tween.onComplete = function () {
                    scaled.tween.properties.scaleX = Number(!Boolean(scaled.scaleX));
                    scaled.tween.interpolate();
                };
                scaled.tween.interpolate();
                stage.addSubview(scaled);
        
                var bar = m.View({
                    hitArea : m.Rectangle.from(-250, -5, 500, 10),
                    x : 250,
                    y : 250,
                    rotation : 45,
                    scaleX : 0.5
                });
                bar.tween = m.Ease({
                    target : bar,
                    duration : 1000,
                    equation : 'linear',
                    properties : {
                        rotation : 360
                    },
                    onComplete : function () {
                        stage.remove();
                        setTimeout(function() {
                            assert.eq(m.animationCount(), 0, 'No registered animations left after removing stage.');
                            callback();
                        }, 500);
                    }
                });
                bar.tween.interpolate();
                bar.drawQueue.push(makeDrawFunction(bar, 'rgb(0, 255, 255)'));
                stage.addSubview(bar);
            }
            go(testGreenEasing, testScaledEasing, callback).start();
        };
    }
});
