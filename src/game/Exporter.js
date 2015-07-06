//Multi exporter threejs
//By Chuck
THREE.Exporter = function() {

    //Exporter types

    this.OBJExporter = new THREE.OBJExporter;

    this.STLExporter = new THREE.STLExporter;

    this.STLBinaryExporter = new THREE.STLExporter;

    this.TypedGeometryExporter = new THREE.TypedGeometryExporter;

    this.exportTypes = {

        "obj": this.OBJExporter,
        "stl": this.STLExporter,
        "stlbinary": this.STLBinaryExporter,
        "typedgeometry": this.TypeGeometryExporter

    };

};

THREE.Exporter.prototype = {

    constructor: THREE.Exporter,

    //API

    export: function(type, object) {

        var exporter = this.exportTypes[type];

        if(!exporter) {

            throw new Error(type + " is not a valid export type");

        }

        if( type === "obj" || type === "typedgeometry") {

            object = object.geometry;

        }

        return exporter.parse(object);

    },


    //Type helper functions

    obj: function(object) {

        if( object.geometry ) {

            object = object.geometry;

        }

        return this.OBJExporter.parse(object);

    },

    stl: function(object, binary) {

        if( binary ) {

            return this.STLBinaryExporter.parse(object);

        } else {

            return this.STLExporter.parse(object);

        }

    },

    typegeometry: function(object) {

        return this.TypeGeometryExporter.parse(object);

    }

};
