/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Mesh.js
* A mesh is a collection of vertices, texture coordinates, normals and any
* number of other shader attributes interleaved into an array. This class
* is meant to be a base class for other specific meshes.
*
* Copyright (c) 2012 Schell Scivally. All rights reserved.
* 
* @author    Schell Scivally
* @since    Sat Jun  9 14:34:13 PDT 2012
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Mesh',
    dependencies : [ 'bang::Geometry/Vector.js' ],
    /** * *
    * Initializes the Mesh object constructor.
    * @param {function} Vector The Vector constructor function.
    * * **/
    init : function MeshFactory (Vector) {
        /** * *
        * Creates a new mesh.
        * @constructor
        * * **/
        function Mesh() {
            var args = Array.prototype.slice.call(arguments);
            Vector.prototype.constructor.apply(this, args);
            
            /** * *
            * A list of the length of each component of the mesh.
            * For instance, if a mesh's vertices are made up of 3 position,
            * 2 texture mapping and 3 normal components, this list would be [3,2,3].
            * This can be used in determining compatibility of meshes and shaders, and
            * extracting components of specific vertices. By default it doesn't mean much.
            * @type {Array.<number>}
            * * **/
            this.attributeComponentLengths = [1];
            /** * *
            * A list of the names of the attributes of the mesh's vertices.
            * @type {Array.<string>}
            * * **/
            this.attributeComponentNames = [''];
        }
        
        Mesh.prototype = new Vector();
        
        Mesh.prototype.constructor = Mesh;
        //--------------------------------------
        //  METHODS
        //--------------------------------------
        /** * *
        * The stride of this mesh.
        * This is the total length of the components in each vertex.
        * @return {number}
        * * **/
        Mesh.prototype.stride = function Mesh_stride() {
            var stride = 0;
            for (var i=0; i < this.attributeComponentLengths.length; i++) {
                stride += this.attributeComponentLengths[i];
            }
            return stride;
        };
        /** * *
        * Extracts the vertex at the given index.
        * @param {number} index The index of the vertex to extract.
        * @return {Array.<number>}
        * * **/
        Mesh.prototype.vertexAt = function Mesh_vertexAt(index) {
            var stride = this.stride();
            var ndx = index*stride;
            var vertex = [];
            for (var i=0; i < stride; i++) {
                vertex.push(this[ndx+i]);
            }
            return vertex;
        };
        /** * *
        * Returns the component named at the given index.
        * @param {number} index The index of the vertex the component belongs to.
        * @param {string} name The name of the component.
        * @return {Array.<number>} 
        * * **/
        Mesh.prototype.componentAt = function Mesh_componentAt(name, index) {
            var nameIndex = this.attributeComponentNames.indexOf(name);
            if (nameIndex === -1) {
                throw new Error(name+' is not a component of the mesh.');
            }
            var offset = 0;
            for (var i=0; i < nameIndex; i++) {
                offset += this.attributeComponentLengths[i];
            }
            var componentLength = this.attributeComponentLengths[nameIndex];
            var stride = this.stride();
            var ndx = index*stride;
            var component = [];
            for (i=0; i < componentLength; i++) {
                component.push(this[ndx+offset+i]);
            }
            return component;
        };
        
        
        return Mesh;
    }
});