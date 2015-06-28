//Physical body for collisions and use with CANNON.js and THREE.js
//By Chuck
THREE.PhysicalBody = function(mesh, options) {

    //Privates
    var SCOPE = this;
    var BODY;
    var SHAPE;
    var CHILDREN;
    var SURFACE;

    //Publics
    SCOPE.types = {
        "plane"   : "createPlaneShape",
        "box"     : "createBoxShape",
        "sphere"  : "createSphereShape",
        "cylinder": "createCylinderShape",
        "convex"  : "createConvexShape"
    };

    //Load a mesh by
    this.loadMesh = function( mesh, options ) {

        //Must be THREE.Mesh
        if( !(mesh instanceof THREE.Object3D) ) {
            throw new Error("Object given is not a THREE.Object3D");
        }

        //Make by type if specified
        options = options || {};

        if(options.type) {
            SHAPE = SCOPE.createByType(mesh, options.type);
        }

        //Create by built in geometry
        else {
            SHAPE = SCOPE.createByGeometry(mesh);
        }

        //Set shape to body
        //Create physical body and create prototype
        var mass = (mesh.mass) ? mesh.mass - 0.0 : 0;

        var bodyOptions = {mass: mass};
        
		if( options.material instanceof CANNON.Material || 
			options.material instanceof THREE.PhysicalMaterial 
		) { 
			
			bodyOptions.material = options.material; 
		
		} else if ( typeof( options.material ) === "object" ) {

			bodyOptions.material = new THREE.PhysicalMaterial( options.material );	

		} else {

			bodyOptions.material = THREE.PhysicalDefaultMaterial;

		}

        BODY = new CANNON.Body( bodyOptions );
        BODY.angularDamping = 0.5;

        var offset = new CANNON.Quaternion().copy(mesh.quaternion);

        BODY.addShape(SHAPE, offset);
    
		mesh.body = BODY;

	};

    //add a child object to mesh
    //uses position from mesh
    this.addChild = function( mesh, options ) {

    };

    //Get CANNON Body
    this.getBody = function() { return BODY; };

    //Get CANNON Shape
    this.getShape = function() { return SHAPE; };

    //Get CANNON Surface material
    this.getSurface = function() { return SURFACE; };

    //Get size vector of box
    this.getBoundingBox = function( mesh ) {

        //require boundingBox to be computed
        var boxgeo = mesh.geometry;
        if(!boxgeo.boundingBox) {
            boxgeo.computeBoundingBox();
        }

        return boxgeo.boundingBox.size().multiplyScalar(mesh.scale.x);
    
	};

    this.getBoundingSphereRadius = function( mesh ) {

        //require boundingSphere to be computed
        var sphereGeo = mesh.geometry;
        if(!sphereGeo.boundingSphere) {
            sphereGeo.computeBoundingSphere();
        }

        return sphereGeo.boundingSphere.radius;
    
	};

    //Get object y offset
    this.getOffset = function( mesh ) {

        return 0; //mesh.geometry.center().multiplyScalar(mesh.scale.x);

    };

    /********************Cannon body creation********************/

    //Create shape by desired type
    this.createByType = function( mesh, type ) {

        //Get desired type method
        var typemethod = SCOPE.types[type];
        if( !typemethod ) {
            
			throw new Error(type + " is not a valid body type");
        
		}

        return SCOPE[typemethod](mesh);
    
	};

    //Create by geometry
    this.createByGeometry = function( mesh ) {

        var geometry = mesh.geometry;

        //Plane
        if(geometry instanceof THREE.PlaneGeometry ||
            geometry instanceof THREE.PlaneBufferGeometry
        ) {
            return SCOPE.createPlaneShape(mesh);
        }

        //Box
        else if(geometry instanceof THREE.BoxGeometry) {
            return SCOPE.createBoxShape(mesh);
        }

        //Sphere
        else if(geometry instanceof THREE.SphereGeometry) {
            return SCOPE.createSphereShape(mesh);
        }

        //Cylinder
        else if(geometry instanceof THREE.CylinderGeometry) {
            return SCOPE.createCylinderShape(mesh);
        }

        //Convex
        else {
            return SCOPE.createConvexShape(mesh);
        }

    };

    //Create cannon plane from object3d
    this.createPlaneShape = function( planegeo ) {

	   	return new CANNON.Plane();
    
	};

    //Create cannon box from object3d
    this.createBoxShape = function( boxobj ) {

        //Create box size vector
        var boundingBox = SCOPE.getBoundingBox(boxobj);
        boundingBox.multiplyScalar(0.5);

        return new CANNON.Box(boundingBox);

    };

    //Create cannon sphere from object3d
	this.createSphereShape = function( spheregeo, segements ) {

        var radius = SCOPE.getBoundingSphereRadius(spheregeo);
        return new CANNON.Sphere(radius);

    };

    //Create cannon cylinder from object3d
    this.createCylinderShape = function( cylindergeo, segmentsOpt ) {

        var radiusTop, radiusBottom, height,
            segments;

        //Regular geometry bouding box to clyinder
        if( !(cylindergeo instanceof THREE.CylinderGeometry) ) {

            var boundingBox = SCOPE.getBoundingBox(cylindergeo);

            //Radius given from bounding box max
            radiusTop = radiusBottom = Math.max(boundingBox.x, boundingBox.z) / 2;
            height = boundingBox.y;

            //Radial segements for smoothness
            segments = segmentsOpt || 32;

            //console.log(radius, height);

        } else {

            var p = cylindergeo.parameters;

            radiusTop = p.radiusTop || 20;
            radiusBottom = p.radiusBottom || 20;
            height = p.height || 100;
            segments = Math.max( p.radialSegments || 8, p.heightSegments || 1 );

        }

        return new CANNON.Cylinder(radiusTop, radiusBottom, height, segments);

    };

	
	//Create trimesh cannon shap from THREE.Mesh verticies
	this.createTrimeshShape = function( mesh, quality ) {

		

	};


    //Creates a CANNON Shape from THREE.Mesh verticies and faces
    this.createConvexShape = function( mesh, quality ) {

		var geo = mesh.geomtry;

        if( mesh.geometry instanceof THREE.BufferGeometry ) {
        
			geo = new THREE.Geometry().fromBufferGeometry( mesh.geometry );
        
		}

        //Create cannon mesh shape
        //Output verticies and faces
        geo = geo.clone();
        var rawVerts = geo.vertices.slice(0);
        var rawFaces = geo.faces.slice(0);

        // Get vertices
        var verts = [];
        for(var j=0; j<rawVerts.length; j++) {
            var v = rawVerts[j];
            verts.push(new CANNON.Vec3(v.x, v.y, v.z));
        }

        //Create cannon face array
        var faces = [];
        var fl = rawFaces.length;
        for( var j = 0; j < fl; j++ ) {
        
			var face = rawFaces[j];
            faces.push([face.a, face.b, face.c]);
        
		}

        try {
        
			return new CANNON.ConvexPolyhedron(verts, faces);
        
		}

        catch( e ) {
        
			return SCOPE.createBoxShape(mesh);
        
		}

    };

    //Initialize body
    if( mesh ) {
        
		SCOPE.loadMesh(mesh, options);
    
	}

};

THREE.PhysicalBody.prototype = {

};
