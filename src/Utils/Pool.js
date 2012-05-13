/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Pool.js
* An addin for pooling objects.
*
* A pool holds ponds. Each pond is a pool of a type of Object
* bundled with an initializing function and a recycling function.
*
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Thu Apr  5 09:45:40 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Pool',
    dependencies : [ 'bang::Global.js' ],
    init : function initPool (m) {
        /** * *
        * Initializes the Pool Addin
        * @param {Object} The mod modules object.
        * * **/
        function createPond(type, create, init, recycle) {
            /** * *
            * Creates a pond (a sub-pool) for a type of object.
            * @param String
            * @param Function
            * @param Function
            * @param Function
            * @return Object
            * * **/
            recycle = recycle || init;
            return {
                type : type,
                create : create,
                init : init,
                recycle : recycle,
                deployedObjects : [],
                recycledObjects : []
            };
        }
        
        var addin = function addinPool (self) {
            /** * *
            * Adds Pool properties to *self*.
            * @param - self Object - The object to add Pool properties to.
            * @return self Pool Object 
            * * **/
            self = m.Object(self); 
            
            // The pool to add ponds to...
            m.safeAddin(self, 'pool', {});
            
            m.safeAddin(self, 'pondExists', function Pool_pondExists(type) {
                /** * *
                * Returns whether or not a pong for type exists already.
                * @param String
                * @return Boolean
                * * **/
                return type in self.pool;
            });
            m.safeAddin(self, 'addPond', function Pool_addPond(type, create, init, recycle) {
                /** * *
                * Adds a pond type to the pool.
                * @param String
                * @param Function
                * @param Function
                * * **/
                if (self.pondExists(type)) {
                    return;
                }
                self.pool[type] = createPond(type, create, init, recycle);
            });
            m.safeAddin(self, 'get', function Pool_get(type) {
                /** * *
                * Retrieves an object from the pool.
                * If the pond has no objects, it attempts to 
                * create one. If no type pond is found, returns 
                * false.
                * @param String
                * @return Object|false
                * * **/
                if (!self.pondExists(type)) {
                    return false;
                }
                var pond = self.pool[type];
                var object;
                if (pond.recycledObjects.length) {
                    object = pond.recycledObjects.pop();
                } else {
                    object = pond.create();
                }
                pond.deployedObjects.push(object);
                pond.init(object);
                // Add a special property so we know what pool
                // this object belongs to (and that it is being pooled)...
                object.$poolType = type;
                
                return object;
            });
            m.safeAddin(self, 'toss', function Pool_toss(object) {
                /** * *
                * Tosses an object back into its pool.
                * Recycles the object, returns false.
                * @param Object
                * @return false
                * * **/
                if (!object) {
                    throw new Error('Parameter is not an object.');
                }
                if ('$poolType' in object) {
                    var pond = self.pool[object.$poolType];
                    pond.recycle(object);
                    var ndx = pond.deployedObjects.indexOf(object);
                    pond.deployedObjects.splice(ndx, 1);
                    pond.recycledObjects.push(object);
                } else {
                    throw new Error('object',object,'does not belong to a pool.');
                }
                return false;
            });
            
            return self;
        };
        
        // A shared instance...
        var _sharedInstance = false;
        addin.sharedInstance = function addinPoolSharedInstance() {
            /** * *
            * Creates a shared instance of Pool.
            * @return Pool
            * * **/
            if (!_sharedInstance) {
                _sharedInstance = addin();
            }
            return _sharedInstance;
        };
        //--------------------------------------
        //  ALIASES FOR SHAREDINSTANCE
        //--------------------------------------
        addin.pondExists = function addinPoolPondExists(type) {
            /** * *
            * Returns whether or not a pong for type exists already.
            * @param String
            * @return Boolean
            * * **/
            return addin.sharedInstance().pondExists(type);
        };
        
        addin.addPond = function addinAddPond(type, create, init, recycle) {
            /** * *
            * Adds a pond type to the pool.
            * @param String
            * @param Function
            * @param Function
            * * **/
            return addin.sharedInstance().addPond(type, create, init, recycle);
        };
        
        addin.get = function addinPoolGet(type) {
            /** * *
            * Retrieves an object from the pool.
            * If the pond has no objects, it attempts to 
            * create one. If no type pond is found, returns 
            * false.
            * @param String
            * @return Object|false
            * * **/
            return addin.sharedInstance().get(type);
        };
        
        addin.toss = function addinPoolToss(object) {
            /** * *
            * Tosses an object back into its pool.
            * Recycles the object.
            * @param Object
            * * **/
            return addin.sharedInstance().toss(object);
        };
        
        addin.watchPond = function addinWatchPond(pond) {
            /** * *
            * Returns a status string for a given pond in the shared pool.
            * Good for debugging - use this as a watch expression:
            *     m.Pool.watchPond('someObjectPond')
            * @return String
            * * **/
            var deployed = addin.sharedInstance().pool[pond].deployedObjects.length;
            var recycled = addin.sharedInstance().pool[pond].recycledObjects.length;
            return pond + ' deployed:' + deployed + ' recycled:' + recycled;
        };
        
        addin.status = function addinStatus() {
            /** * *
            * Returns a status string for all ponds in the shared pool.
            * Good for debugging - use this as a watch expression:
            *     m.Pool.status()
            * @return String
            * * **/
            var deployed = 0;
            var recycled = 0;
            var pool = addin.sharedInstance().pool;
            for (var pond in pool) {
                deployed += pool[pond].deployedObjects.length;
                recycled += pool[pond].recycledObjects.length;
            }
            return 'Pool total deployed:' + deployed + ' recycled:' + recycled;
        };
        
        return addin;
        
    }
});