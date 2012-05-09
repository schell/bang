/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    RectangleTests.js
 *    Tests for the Rectangle Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 13:59:26 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
 mod({
     name : 'GeomTests',
     dependencies : [ 'bang::Geometry/Geometry.js' ],
     init : function initRectangleTests (m) {
         /**
         * Initializes the RectangleTests 
         * @param - m Object - The mod modules object.
         */
         return function runGeomTests(callback) { 
             // aliases
             var ifndefInit = m.ifndefInit;
             var ifndefInitObj = m.ifndefInitObj;
             var safeAddin = m.safeAddin;
             var assert = m.assert;
             var Point = m.Point;
             var Size = m.Size;
             var Rectangle = m.Rectangle;
         
            assert.suite = 'Geom Tests';
        
            var mat = m.Matrix({
                elements : [
                    0, 1, 2,
                    3, 4, 5, 
                    6, 7, 8
                ]
            });
            
            var row0 = mat.row(0);
            var row2 = mat.row(2);
            assert.eq(row0.toString(), '0,1,2', 'Can get matrix row.');
            assert.eq(row2.toString(), '6,7,8', 'Can get matrix row.');
            
            var c0 = mat.column(0);
            var c2 = mat.column(2);
            assert.eq(c0.toString(), '0,3,6', 'Can get matrix column.');
            assert.eq(c2.toString(), '2,5,8', 'Can get matrix column.');
            
            var A = m.Matrix({
                elements : [
                    5, 9, 2, 
                    1, 7, 6,
                    3, 4, 8
                ]
            });
            
            var B = m.Matrix({
                elements : [
                    9, 1, 6, 
                    7, 2, 4,
                    8, 10, 3
                ]
            });
            
            var AB = m.Matrix({
                elements : [
                    124, 43, 72,
                    106, 75, 52,
                    119, 91, 58
                ]
            });
            
            var BA = m.Matrix({
                elements : [
                    64, 112, 72,
                    49, 93, 58,
                    59, 154, 100
                ]
            });
            
            var resultAB = A.copy().multiply(B);
            var resultBA = B.copy().multiply(A);
            
            assert.eq(resultAB.elements.toString(), AB.elements.toString(), 'Matrix can multiply');
            
            mat.loadIdentity();
            
            mat.translate(1, 2);
            assert.eq(mat.x(), 1, 'Matrix can translate x');
            assert.eq(mat.y(), 2, 'Matrix can translate y');
            
            mat.scale(0.5, 0.3, 0.1);
            assert.eq(mat.a(), 0.5, 'Matrix can scale x');
            assert.eq(mat.e(), 0.3, 'Matrix can scale y');
        
            mat.loadIdentity();
        
            var vec = m.Vector({
                elements : [
                    2,
                    4
                ]
            });
        
            mat.translate(1, 1);
        
            var tVec = mat.transform2DVector(vec);
            assert.eq(tVec.x(), 3, 'Matrix can translate Vector in x');
            assert.eq(tVec.y(), 5, 'Matrix can translate Vector in y');
        
            tVec = mat.transform2DVector(tVec);
            assert.eq(tVec.x(), 4, 'Matrix can translate Vector in x');
            assert.eq(tVec.y(), 6, 'Matrix can translate Vector in y');
        
            mat.loadIdentity();
            mat.scale(0.5, 0.5, 0.5);
            tVec = mat.transform2DVector(tVec);
            assert.eq(tVec.x(), 2, 'Matrix can scale Vector in x');
            assert.eq(tVec.y(), 3, 'Matrix can scale Vector in y');
        
            // Point tests
            var pnt1 = Point.from(1, 1);
            var pnt2 = Point.from(10, 10);
            var pnt3 = Point.from(-10, -10);
        
            assert.eq(pnt3.x(), -10, 'Point can construct with default values');
        
            var pnt1copy = pnt1.copy();
            assert.eq(pnt1.isEqualTo(pnt1copy), true, 'Point can make copies');
        
            assert.eq(pnt3.distanceTo(pnt2), 28.284271247461902, 'Point can calculate distance to another point');
        
            assert.eq(pnt1.closer(pnt2, pnt3), pnt2, 'Point can determine closest point');
        
            var unitSquare = m.Polygon({
                elements : [
                    -1,  1,
                     1,  1,
                     1, -1,
                    -1, -1
                ]
            });
            assert.eq(unitSquare.containsPoint(m.Point()), true, 'Polygon unit square contains origin');
            
            var rect = m.Polygon({
                elements : [
                    10, 5,
                    10, -5,
                    -10, -5,
                    -10, 5
                ]
            });
            var transform = m.Matrix();
            transform.rotate(Math.PI/2).scale(2, 2);
            transform.transformPolygon(rect);
            var cleanElements = rect.elements.map(function(el,ndx,a) {
                return Math.round(el);
            });
            var resultPoly = m.Polygon({
                elements : cleanElements
            });
            var comparePoly = m.Polygon({
                elements : [-10,20,10,20,10,-20,-10,-20]
            });
            assert.eq(resultPoly.isEqualTo(comparePoly), true, 'Matrix can transform polygons.');
            assert.eq(resultPoly.elements.toString(), comparePoly.elements.toString(), 'Matrix can transform polygons.');
            
            var D = m.Matrix().translate(100, 50).scale(0.5).rotate(Math.PI/4);
            var invD = D.inverse();
            var I = D.copy().multiply(invD);
            I.elements = I.elements.map(function(el,ndx,a) {
                return Math.round(el);
            });
            assert.eq(I.isEqualTo(m.Matrix()), true, 'Matrix can return inverse.');
        
            var p1 = Point.from(0, 0);
            var p2 = Point.from(10, 10);
            var p3 = Point.from(-10, -10);
            var r1 = Rectangle.fromTwoPoints(p1, p2);
            var r2 = Rectangle.fromTwoPoints(p1, p3);
            var r3 = Rectangle.fromTwoPoints(p3, p2);
            var r3eq = Rectangle.from(-10, -10, 20, 20);
            var sectioned = r3.section({
                verticallyAt : [10, 15],
                horizontallyAt : [10]
            });
            var unioned = Rectangle();
            for (var i = 0; i < sectioned.length; i++) {
                unioned = unioned.union(sectioned[i]);
            }
            assert.eq(r1.origin().distanceTo(p1), 0, 'First rectangle '+r1.toString()+' has origin 0,0');
            assert.eq(r2.origin().distanceTo(p3), 0, 'Second rectangle '+r2.toString()+' has origin -10,-10');
            assert.eq(r3.origin().distanceTo(p3), 0, 'Third rectangle '+r3.toString()+' has origin -10,-10');
            assert.eq(r3.width(), 20, 'Third rectangle '+r3.toString()+' has width 20');
            assert.eq(r3.height(), 20, 'Third rectangle '+r3.toString()+' has height 20');
            assert.eq(r3.containsPoint(Point.from(0, 0)), true, 'Third rectangle contains point 0,0');
            assert.eq(sectioned.length, 6, 'Third rectangle sections into 6 sub-rectangles');
            assert.eq(sectioned[0].origin().distanceTo(Point.from(-10, -10)), 0, '1 section origin is correct');
            assert.eq(sectioned[0].width(), 10, '1 section width is correct');
            assert.eq(sectioned[0].height(), 10, '1 section height is correct');
            assert.eq(sectioned[1].origin().distanceTo(Point.from(0, -10)), 0, '2 section origin is correct');
            assert.eq(sectioned[2].origin().distanceTo(Point.from(5, -10)), 0, '3 section origin is correct');
            assert.eq(sectioned[2].width(), 5, '2 section width is correct');
            assert.eq(sectioned[3].origin().distanceTo(Point.from(-10, 0)), 0, '4 section origin is correct');
            assert.eq(sectioned[4].origin().distanceTo(Point.from(0, 0)), 0, '5 section origin is correct');
            assert.eq(sectioned[5].origin().distanceTo(Point.from(5, 0)), 0, '6 section origin is correct');
            assert.eq(r3.isEqualTo(r3eq), true, 'Third rectangle is equal to',r3eq.toString());
            assert.eq(r3.isEqualTo(r3.copy()), true, 'Can copy rectangles');
            assert.eq(unioned.isEqualTo(r3), true, 'Can union rectangles '+unioned.toString()+' '+r3.toString());
            
            callback();
        };
     }
 });