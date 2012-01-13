/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *    RectangleTests.js
 *    Tests for the Rectangle Addin
 *    Copyright (c) 2012 Schell Scivally. All rights reserved.
 *
 *    @author    Schell Scivally
 *    @since    Thu Jan 12 13:59:26 PST 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
 mod({
     name : 'RectangleTests',
     dependencies : [ 'Geom/Rectangle.js' ],
     init : function initRectangleTests (m) {
         /**
          * Initializes the RectangleTests 
          * @param - m Object - The mod modules object.
          */
          
         // aliases
         var ifndefInit = m.ifndefInit;
         var ifndefInitObj = m.ifndefInitObj;
         var safeAddin = m.safeAddin;
         var assert = m.assert;
         var Point = m.Point;
         var Size = m.Size;
         var Rectangle = m.Rectangle;
         
		assert.suite = 'Geom Tests';
        
		var pnt1 = Point({x:1,y:1});
		var pnt2 = Point({x:10, y:10});
		var pnt3 = Point({x:-10, y:-10});
        
        assert.eq(pnt3.x, -10, 'Point can construct with default values');
        
        var pnt1copy = pnt1.copy();
        assert.eq(pnt1.isEqualTo(pnt1copy), true, 'Point can make copies');
        
        assert.eq(pnt3.distanceTo(pnt2), 28.284271247461902, 'Point can calculate distance to another point');
        
        assert.eq(pnt1.closer(pnt2, pnt3), pnt2, 'Point can determine closest point');
        
        var size = Size();
        assert.eq(size.width, 0, 'Size initializes width');
        assert.eq(size.height, 0, 'Size initializes height');
         
        size.width = 4;
        size.height = 3;
         
        var otherSize = Size({width:10,height:4});
        var likeSize = size.copy();
        assert.eq(size.isEqualTo(otherSize) === false && size.isEqualTo(likeSize) === true, true, 'Size can determine equality');
        
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
		assert.eq(r1.origin.distanceTo(p1), 0, 'First rectangle '+r1.toString()+' has origin 0,0');
		assert.eq(r2.origin.distanceTo(p3), 0, 'Second rectangle '+r2.toString()+' has origin -10,-10');
		assert.eq(r3.origin.distanceTo(p3), 0, 'Third rectangle '+r3.toString()+' has origin -10,-10');
		assert.eq(r3.size.width, 20, 'Third rectangle '+r3.toString()+' has width 20');
		assert.eq(r3.size.height, 20, 'Third rectangle '+r3.toString()+' has height 20');
		assert.eq(r3.containsPoint(Point.from(0, 0)), true, 'Third rectangle contains point 0,0');
		assert.eq(sectioned.length, 6, 'Third rectangle sections into 6 sub-rectangles');
		assert.eq(sectioned[0].origin.distanceTo(Point.from(-10, -10)), 0, '1 section origin is correct');
		assert.eq(sectioned[0].size.width, 10, '1 section width is correct');
		assert.eq(sectioned[0].size.height, 10, '1 section height is correct');
		assert.eq(sectioned[1].origin.distanceTo(Point.from(0, -10)), 0, '2 section origin is correct');
		assert.eq(sectioned[2].origin.distanceTo(Point.from(5, -10)), 0, '3 section origin is correct');
		assert.eq(sectioned[2].size.width, 5, '2 section width is correct');
		assert.eq(sectioned[3].origin.distanceTo(Point.from(-10, 0)), 0, '4 section origin is correct');
		assert.eq(sectioned[4].origin.distanceTo(Point.from(0, 0)), 0, '5 section origin is correct');
		assert.eq(sectioned[5].origin.distanceTo(Point.from(5, 0)), 0, '6 section origin is correct');
		assert.eq(r3.isEqualTo(r3eq), true, 'Third rectangle is equal to',r3eq.toString());
		assert.eq(r3.isEqualTo(r3.copy()), true, 'Can copy rectangles');
		assert.eq(unioned.isEqualTo(r3), true, 'Can union rectangles '+unioned.toString()+' '+r3.toString());
         
         
         return {};
     }
 });