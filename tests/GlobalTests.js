mod({
    name : 'GlobalTests',
    dependencies : [ 'bang::Global.js' ],
    init : function initGlobalTests (m) {
        return function runGlobalTests(callback) {
            // aliases
            var assert =assert;
        
            assert.suite = 'Global Tests';
                    
            // test safeAddin adds property
            var object =Object();
           safeAddin(object, 'key', 6);
           safeAddin(object, 'key', 7);
            assert.eq('key' in object, true, 'safeAddin can add property');
            assert.eq(object.key, 6, 'safeAddin does not overwrite existing property');
        
           safeOverride(object, 'key', 'super_key', 666);
            assert.eq(('super_key' in object) && object.super_key === 6 && ('key' in object) && object.key === 666, true, 'safeOverride can override property.');
        
            var initObject =Object();
            assert.eq(initObject.toString(), '['+initObject.uniqueId()+']', 'Initial objects have uniqueId as toString.');
        
            var taggedObject = {
                tag : 'tagged'
            };
           Object(taggedObject);
            assert.eq(taggedObject.toString(), '[tagged]', 'Initial object does not override tag.');
        
            var calls = 0;
            var animation;
            var animate = function (time) {
                calls++;
               cancelAnimation(animation);
                assert.eq(calls, 1, 'Can cancel animation.');
            };
            animation =requestAnimation(animate);
            setTimeout(function () {
                assert.eq(calls, 1, 'Can start and cancel animation.');
                callback();
            }, 500);
        };
    }
});