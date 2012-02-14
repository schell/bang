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
            view.addInterest(view, m.Notifications.View.DID_UPDATE_CONTEXT, function updatedContext(note) {
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
            container.removeSubview(view);
            assert.eq(container.subviews().length, 0, 'ViewContainer can remove subviews.');
            assert.eq(container.subviews().indexOf(view), -1, 'ViewContainer can remove subviews.');
        
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
            topOfTree.sendNotification(m.Notifications.View.DID_UPDATE_CONTEXT, topOfTree.context);
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
            assert.eq(m.defined(view.stage) && view.stage === stage, true, 'Subviews inherit parent\'s stage.');
            
            var hitView = m.View({
                
            });
            
            var rsTest = m.View();
            rsTest.scaleX = 0.5;
            rsTest.rotation = 45;
            assert.eq(rsTest.scaleX, 0.5, 'Rotation does not affect store scaleX value.');
            assert.eq(rsTest.rotation, 45, 'ScaleX does not affect store rotation value.');
        
            function makeDrawFunction(view, color) {
                return function () {
                    view.context.save();
                    view.context.fillStyle = color;
                    view.context.fillRect(view.hitArea.left(), view.hitArea.top(), view.hitArea.width(), view.hitArea.height());
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
            green.addInterest(undefined, m.Notifications.Stage.FRAME_TICK, function tick(note) {
                red.rotation += 2;
                blue.rotation += 2;
                green.rotation -= 2;
            });
            green.addToString(function(){return '[redAndBlue]';});
            
            function testHitAreaConversion(cb) {
                console.log('hitArea conversion test');
                
                function drawPolygon(context, fill, stroke, poly) {
                    if (!m.defined(context) || !m.defined(poly)) {
                        return;
                    }
                        
                    fill = m.ifndefInit(fill, 'rgba(0,0,0,0.5)');
                    stroke = m.ifndefInit(stroke, 'rgba(0,0,0,0.8)');
                        
                    context.save();
                    context.fillStyle = fill;
                    context.strokeStyle = stroke;
                    context.beginPath();
                    context.moveTo(poly.elements[0], poly.elements[1]);
                    for (var i=2; i <= poly.elements.length; i+=2) {
                        var x = poly.elements[i];
                        var y = poly.elements[i+1];
                        context.lineTo(x, y);
                    }
                    context.closePath();
                    context.fill();
                    context.stroke();
                    context.restore();
                }
                
                var trunk = m.ViewContainer({
                    x : 150,
                    hitArea : m.Rectangle.from(0, 0, 100, 100)
                });
                var branch = m.ViewContainer({
                    x : 50,
                    y : 50,
                    scaleY : 0.5,
                    rotation : 45,
                    hitArea : m.Rectangle.from(0, 0, 100, 100)
                });
                var branchArm = m.ViewContainer({
                    x : 100,
                    y : 100,
                    scaleX : 0.5,
                    hitArea : m.Rectangle.from(0, 0, 100, 100)
                });
                var leftLeaf = m.View({
                    x : 50,
                    y : 100,
                    scaleX : 0.5,
                    scaleY : 0.5,
                    hitArea : m.Rectangle.from(0, 0, 100, 100)
                });
                var rightLeaf = m.ViewContainer({
                    x : 100, 
                    y : 0,
                    hitArea : m.Rectangle.from(0, 0, 100, 100)
                });
                
                trunk.addHitAreaDrawFunction('rgb(50,50,50)');
                branch.addHitAreaDrawFunction('gray');
                branchArm.addHitAreaDrawFunction('silver');
                leftLeaf.addHitAreaDrawFunction('rgba(0,0,0,0.5)');
                rightLeaf.addHitAreaDrawFunction('rgba(0,0,0,0.5)');
                
                stage.addSubview(trunk);
                trunk.addSubview(branch);
                branch.addSubview(branchArm);
                branchArm.addSubview(leftLeaf);
                branchArm.addSubview(rightLeaf);

                var leftLeafHitArea = leftLeaf.getCompoundTransform().transformPolygon(leftLeaf.hitArea.copy());
                var rightLeafHitArea = rightLeaf.getCompoundTransform().transformPolygon(rightLeaf.hitArea.copy());
                var branchArmHitArea = branchArm.getCompoundTransform().transformPolygon(branchArm.hitArea.copy());
                var inverseRightMatrix = rightLeaf.getCompoundTransform(true);
                var leftHitInRightCoords = inverseRightMatrix.transformPolygon(leftLeafHitArea.copy());
                
                var leftInRight = m.View({
                    x : leftHitInRightCoords.left(),
                    y : leftHitInRightCoords.top(),
                    alpha : 0.5,
                    hitArea : m.Rectangle.from(0, 0, leftHitInRightCoords.width(), leftHitInRightCoords.height())
                });
                leftInRight.drawQueue.push(function() {
                    drawPolygon(leftInRight.context, 'yellow', 'lime', leftInRight.hitArea);
                });
                rightLeaf.addSubview(leftInRight);
                
                // Get the points that all should be rather similar (exactly the same in a perfect world...)
                var leftPoint = leftLeafHitArea.pointAt(1);
                var rightPoint = rightLeafHitArea.pointAt(3);
                var branchPoint = branchArmHitArea.pointAt(2);
                var xsPrettyEqual = leftPoint.x().toFixed(2) == rightPoint.x().toFixed(2) && rightPoint.x().toFixed(2) == branchPoint.x().toFixed(2);
                var ysPrettyEqual = leftPoint.y().toFixed(2) == rightPoint.y().toFixed(2) && rightPoint.y().toFixed(2) == branchPoint.y().toFixed(2);
                assert.eq(xsPrettyEqual && ysPrettyEqual, true, 'Matrix can get compound transform and apply to hitArea.');
                
                var convertedLeftToRight = leftLeaf.convertPolygonToView(leftLeaf.hitArea.copy(), rightLeaf);
                var convertedLeftFromRight = rightLeaf.convertPolygonFromView(leftLeaf.hitArea.copy(), leftLeaf);
                assert.eq(convertedLeftToRight.isEqualTo(convertedLeftFromRight), true, 'View.convertPolygonToView converts the same as View.convertPolygonFromView.');
                
                stage.drawQueue.push(function () {
                    drawPolygon(stage.context, 'red', 'yellow', leftLeafHitArea);
                    drawPolygon(stage.context, 'blue', 'yellow', rightLeafHitArea);
                });
                
                //stage.removeSubview(trunk);
                //cb();
            }
            
            function testGreenEasing(cb) {
                console.log('green easing test');

                stage.addSubview(green);
                
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
            go(testHitAreaConversion, testGreenEasing, testScaledEasing, callback).start();
        };
    }
});
