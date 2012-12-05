/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Task.js
* A nested task scheduler and runner built with callbacks. This is a prototypal
* version of an older library I wrote called 'go'. (https://github.com/schell/go)
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Tue May 22 19:45:24 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Task',
    dependencies : [  ],
    /** * *
    * Initializes the Task object constructor.
    * @param 
    * * **/
    init : function TaskFactory () {
        /** * *
        * Creates a new Task object.
        * The default task object executes some number of task functions in serial. Each
        * task function should take at least one argument, a callback function, which will
        * be provided by the task runner. The task function can optionally take two arguments,
        * a callback function and the return value of the previous task function. The task runner
        * will provide the return value of the previous function only if the runner is evoked in a 
        * serial context. If the current task in the queue is a parallel operation nested in a 
        * serial operation, each parallel task function will be given the result of the 
        * last serial operation.
        * 
        * @param {string=} The type of task to run ('serial' or 'parallel').
        * @param {...} A number of task functions or Task objects to run.
        * @constructor
        * * **/
        function Task() {
            var args = Array.prototype.slice.call(arguments);
            var type = false;
            if (typeof args[0] === 'string') {
                type = args.shift();
            }
            /** * *
            * The type of task this is.
            * @param {string}
            * * **/
            this.type = type || 'serial';
            /** * *
            * The function steps of the task, or nested Task objects.
            * @type {Array.<function(function)|Task>} An array of Task objects or function steps that take function callbacks.
            * * **/
        	this.queue = args;
            /** * *
            * A list of the return values of task functions.
            * @type {Array.<*>}
            * * **/
            this.results = [];
            for (var i=0; i < args.length; i++) {
                this.results.push(undefined);
            }
            /** * *
            * A callback function for other Task objects to set.
            * @type {function(*)|boolean}
            * * **/
            this._taskCallback = false;
            /** * *
            * A callback function for users to set.
            * @type {function(*, Task)|boolean}
            * * **/
            this._userCallback = false;
            /** * *
            * A callback function to call in case of cancellation.
            * @type {function(Task)|false}
            * * **/
            this._cancelCallback = false;
            /** * *
            * The current task index.
            * @type {number}
            * * **/
            this.index = -1;
            /** * *
            * A reference to a parent task.
            * @type {Task|boolean}
            * * **/
            this.parent = false;
            /** * *
            * Whether or not the task has been cancelled.
            * @type {boolean}
            * * **/
            this.cancelled = false;
        }
        
        Task.prototype = {};
        
        Task.prototype.constructor = Task;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * Cancels a task, if the task is nested this also cancels parent tasks.
        * * **/
        Task.prototype.cancel = function Task_cancel() {
            this.cancelled = true;
            this._userCallback = function(){};
            this._taskCallback = function(){};
            if (this._cancelCallback) {
                this._cancelCallback(this);
            }
            if (this.parent) {
                this.parent.cancel();
            }
        };
        /** * *
        * Calls the given function in the case that some sub operation cancels
        * the task. Provides the task object as a parameter to the given function.
        * @param {function(Task)} cancelFunc
        * * **/
        Task.prototype.onCancel = function Task_onCancel(cancelFunc) {
            this._cancelCallback = cancelFunc;
            // Return itself for chaining options...
            return this;
        }
        /** * *
        * Calls the given function once all of the Task's operations
        * have completed. Provides the results of the last operation
        * and the calling Task object as parameters. The results of this
        * function will be used as the result of a nested Task.
        * @param {function(*, Task)} completeFunc
        * * **/
        Task.prototype.onComplete = function Task_onComplete(completeFunc) {
            this._userCallback = completeFunc;
            // Return itself for chaining options...
            return this;
        };
        /** * *
        * Runs the task in serial.
        * @param {*} resultOfParentTaskOp The result of the parent task's last operation. Used internally for nested tasks.
        * * **/
        Task.prototype.go = function Task_go(resultOfParentTaskOp) {
            if (this.cancelled) {
                return;
            }
            
            var alias = this;
            
            // Figure out what we should pass to operations and sub tasks,
            // should be the result of the last operation...
            var resultOfLastOperation = this.results[this.index]; // may be undefined...
            if (this.index === -1) {
                // This is the first operation in a task, but if
                // this task is a sub task of some parent task,
                // the parent task would have given us the results
                // of the last operation as the only parameter to go().
                resultOfLastOperation = resultOfParentTaskOp;
            }
            
            function finish() {
                var onCompleteResults = undefined;
                if (alias._userCallback) {
                    // The user has supplied a callback using onComplete(),
                    // so call it with the last results and this...
                    onCompleteResults = alias._userCallback(alias.results[alias.index], alias);
                }
                if (alias._taskCallback) {
                    // This is a child Task, so callback to the parent Task...
                    // Give the parent Task object the result of the user supplied callback...
                    alias._taskCallback(onCompleteResults, alias);
                }
            }
            
            if (this.type === 'serial') {
                var step = this.queue.shift() || false;
                
                if (step) {
                    function serialCallback(results) {
                        alias.index++;
                        alias.results[alias.index] = results;
                        alias.go();
                    };
                    
                    if (Task.prototype.isPrototypeOf(step)) {
                        // The step is a Task object, so set that Task's callback 
                        // and let the Task take over until it calls back...
                        step.parent = this;
                        step._taskCallback = serialCallback;
                        step.go(this.results[this.index]);
                        return this;
                    }
                    // The step is a user's task function so run it...
                    step(serialCallback, resultOfLastOperation, this);
                    return this;
                }
                // This was the last step...
                finish();
            } else if (this.type === 'parallel') {
                
                function createParallelCallback(task, ndx) {
                    return function parallelClosure(results) {
                        task.index++;
                        task.results[ndx] = results;
                        if (task.index === (task.queue.length - 1)) {
                            finish();
                        }
                    };
                }
                
                for(var i = 0; i < this.queue.length/* && this.index === -1*/; i++) {
                    var step = this.queue[i];
                    var parallelCallback = createParallelCallback(this, i);
                    
                    if (Task.prototype.isPrototypeOf(step)) {
                        step.parent = this;
                        step._taskCallback = parallelCallback;
                        step.go(resultOfLastOperation);
                    } else {
                        step(parallelCallback, resultOfLastOperation, this);
                    }
                }
            }
            // Return itself so we can do some chaining...
            return this;
        };
        
        return Task;
    }
});