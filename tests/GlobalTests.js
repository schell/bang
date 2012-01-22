mod({
    name : 'GlobalTests',
    dependencies : [ 'Global.js' ],
    init : function initGlobalTests (m) {
        // aliases
        var assert = m.assert;
        
        assert.suite = 'Global Tests';
                    
        // test safeAddin adds property
        var object = m.initialObject();
        m.safeAddin(object, 'key', 6);
        m.safeAddin(object, 'key', 7);
        assert.eq('key' in object, true, 'safeAddin can add property');
        assert.eq(object.key, 6, 'safeAddin does not overwrite existing property');
        
        m.safeOverride(object, 'key', 'super_key', 666);
        assert.eq(('super_key' in object) && object.super_key === 6 && ('key' in object) && object.key === 666, true, 'safeOverride can override property.');
        console.log(object);
        
        console.log('GlobalTests.js - Global tests done.');
    }
});