/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Quadtree.js
* A quadtree for broadphase collision detection.
* Copyright (c) 12 Schell Scivally . All rights reserved.
* 
* @author Schell Scivally
* @since Thu Dec 13 14:17:34 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Quadtree',
    dependencies : [ 
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the Quadtree constructor.
    * * **/
    init : function initQuadtreeConstructor(Rectangle) { 
        /** * *
        * Constructs new Quadtrees.
        * @constructor
        * @nosideeffects
        * @return {Quadtree}
        * * **/ 
        function Quadtree(x,y,w,h) {
            /** * *
            * The boundary of this quadtree.
            * @type {Rectangle}
            * * **/
            this.boundary = new Rectangle();
            Rectangle.apply(this.boundary, arguments);
            /** * *
            * The parent node of thes quadtree.
            * False if this node has no parent.
            * @type {Quadtree|false}
            * * **/
            this.parent = false;
        }

        Quadtree.prototype = {};
        Quadtree.prototype.constructor = Quadtree;
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the nodes property.
        * The four child nodes of this quadtree node.
        * @returns {Array.<Quadtree>|false}
        * * **/
        Quadtree.prototype.__defineGetter__('nodes', function Quadtree_getnodes() {
            if (!this._nodes) {
                this._nodes = false;
            }
            return this._nodes;
        });
        /** * *
        * Gets the entries property.
        * The rectangles contained within this quadtree.
        * @returns {Array.<Rectangle>} 
        * * **/
        Quadtree.prototype.__defineGetter__('entries', function Quadtree_getentries() {
            if (!this._entries) {
                this._entries = [];
            }
            return this._entries;
        });
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Inserts a new rectangle into the quad.
        * Returns whether or not the insertion was successful.
        * @param {Rectangle}
        * @return {boolean} 
        * * **/
        Quadtree.prototype.insert = function Quadtree_insert(r) {
            if (!this.boundary.intersectsRectangle(r)) {
                // The rectangle lies completely outside of this quad so abort...
                return false;
            }

            if (!this.boundary.containsRectangle(r)) {
                // The rectangle doesn't fit in this quad...
                if (!this.parent) {
                    // But this is the root quad so store it...
                    this.entries.push(r);
                    return true;
                } else {
                    // The rectangle doesn't belong here...
                    return false;
                }
            } else {
                if (this.nodes) {
                    // Insert it into one of the nodes...
                    var nodes = this.nodes.slice();
                    var nodeInserted = false;
                    var node = false;
                    while (!nodeInserted && nodes.length) {
                        node = nodes.pop();
                        nodeInserted = node.insert(r);
                    }
                    if (!nodeInserted) {
                        // The rectangle doesn't fit into any subnodes
                        // but it does fit into this one, so here is 
                        // where we'll store it...
                        this.entries.push(r);
                    }
                    return true;
                } else if (this.entries.length) {
                    // Decompose this quad and re-insert the
                    // entries into the subnodes... 
                    this.entries.push(r);
                    var nodes = [
                        new Quadtree(this.boundary.x, this.boundary.y, this.boundary.width/2, this.boundary.height/2),
                        new Quadtree(this.boundary.x + this.boundary.width/2 , this.boundary.y, this.boundary.width/2, this.boundary.height/2),
                        new Quadtree(this.boundary.x, this.boundary.y + this.boundary.height/2, this.boundary.width/2, this.boundary.height/2),
                        new Quadtree(this.boundary.x + this.boundary.width/2, this.boundary.y + this.boundary.height/2, this.boundary.width/2, this.boundary.height/2)
                    ];
                    nodes[0].parent = this;
                    nodes[1].parent = this;
                    nodes[2].parent = this;
                    nodes[3].parent = this;
                    var entries = this.entries.slice();
                    while (entries.length) {
                        var entry = entries.pop();
                        for (var i=0; i < nodes.length; i++) {
                            var node = nodes[i];
                            if (node.insert(entry)) {
                                // Remove the entry from this quad's entries...
                                this.entries.splice(this.entries.indexOf(entry), 1);
                                if (!this.nodes) {
                                    this._nodes = nodes;
                                }
                                // Break out of the for...
                                break;
                            }
                        }
                    }
                    return true;
                } else {
                    // Add the rectangle as this quads only entry...
                    this.entries.push(r);
                    return true;
                }
            }
        };
        /** * *
        * Collects all the inserted rectangles that contain the given point.
        * @param {Vector}
        * @return {Array.<Rectangle>}
        * * **/
        Quadtree.prototype.queryPoint = function Quadtree_queryPoint(point) {
            var rs = [];
            if (this.boundary.containsPoint(point)) {
                for (var i=0; i < this.entries.length; i++) {
                    var entry = this.entries[i];
                    if (entry.containsPoint(point)) {
                        rs.push(entry);
                    }
                }
                for (var i=0; i < this.nodes.length; i++) {
                    var node = this.nodes[i];
                    var subrs = node.queryPoint(point);
                    rs = rs.concat(subrs);
                }
            }
            return rs;
        };

        return Quadtree;
    }
});    
