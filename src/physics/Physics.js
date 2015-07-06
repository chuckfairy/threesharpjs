//Basic THREE.js Physics with CANNON.js
//By Chuck
THREE.Physics = function( options ) {

    var scope = this;

    var WORLD = new CANNON.World();
    WORLD.gravity.set( 0, -9.8, 0 );
    WORLD.broadphase = new CANNON.SAPBroadphase( WORLD );
    WORLD.solver.iterations = ( options.iterations|0 ) || 10;
    //WORLD.solver.tolerance = 0;

    WORLD.allowSleep = !!options.allowSleep;
    //WORLD.defaultContactMaterial.friction = 1000;
    //WORLD.defaultContactMaterial.restitution = .2;

	//Max steps per update
    var MAXSTEPS = 1;

    //THREE.js Objects
    var OBJECTS = {};

    //Cannon physical elements
    var CANNON_BODIES = {};

	//Bodies subject to gravity
	var MASS_BODIES = {};

	//Bodies with mass of 0
	var STATIC_BODIES = {};

	var options = typeof( options ) === "object" ? options : {};


    /********************Properties********************/

	//CANNON world
	scope.world = WORLD;

    //Frames per second
    scope.fps = options.fps ||  20;

	//Update static objects. Bodies with mass of 0
	scope.updateStatic = typeof( options.updateStatic ) !== "undefined" ? 
		!!options.updateStatic :  true;


	/********************World get and setters********************/

    //Get an object by mesh uuid
    scope.getObject = function(uuid) {
        return OBJECTS[uuid] || false;
    };


    /********************World Creation and use********************/

    //Initialization
    scope.init = function(options) {

		//Set gravity
        if( !options.gravity ) {

			scope.setGravity( options.gravity );

		}

	};

    //Update the thru a time step
    scope.update = function( delta ) {

        scope.dispatch({
            type: 'before-update',
            delta: delta
        });

        WORLD.step( 1 / scope.fps );
        scope.updateBodies();

    };

    //Update positions and rotation of objects
    scope.updateBodies = function() {

		var bodies = scope.updateStatic ? OBJECTS : MASS_BODIES;

		var ol = bodies.length;

        for( var uuid in bodies ) {
            
			var objects = bodies[uuid];
            var cannon = objects.cannon;
            var mesh = objects.object;

			//dont update on equality
            if( mesh.position.equals( cannon.position ) ) { continue; }

            mesh.position.copy( cannon.position );
            mesh.quaternion.copy( cannon.quaternion );

        }

    };


	//Update static bodies
	scope.updateStatics = function() {

		for( var uuid in STATIC_BODIES ) {

			var objects = STATIC_BODIES[uuid];
			var cannon = objects.cannon;
			var mesh = objects.object;

            mesh.position.copy( cannon.position );
            mesh.quaternion.copy( cannon.quaternion );

		}	

	};

    //Get cannon world for adding stuff to it
    scope.getWorld = function() { return WORLD; };

    //Get world objects
    scope.getObjects = function() { return OBJECTS; };

    //Change gravity
    scope.setGravity = function( vector3 ) {

        if( !( vector3 instanceof THREE.Vector3 ) ) {

            throw new Error("Parameter not THREE.Vector3");
        
		}

        WORLD.gravity.set(vector3.x, vector3.y, vector3.z);
    };

    //add an object to physical world
    //and uses cannon built in rigid body detection
    scope.addObject = function( mesh, options ) {

        if( !( mesh instanceof THREE.Object3D ) ) {

            throw new Error("Parameter not THREE.Object3D");
        
		}

        //Create cannon body
        var physicalBody = new THREE.PhysicalBody(mesh, options);
        var cannonBody = physicalBody.getBody();
        cannonBody.position.copy(mesh.position);
        cannonBody.quaternion.copy(mesh.quaternion);

        //Save objects to active objects using uuid
        //and add to world
        var uuid = mesh.uuid;
        OBJECTS[uuid] = {
            object: mesh,
            cannon: cannonBody
        };

		if( ( mesh.mass|0 ) === 0 ) {

			STATIC_BODIES[uuid] = OBJECTS[uuid];

		} else {

			MASS_BODIES[uuid] = OBJECTS[uuid];

		}

        WORLD.addBody( cannonBody );

    };


	//Add objects from array
	scope.addObjects = function ( array, options ) {
		
		if( typeof( array ) !== "object" ) {

			throw new Error( "Add objects requires an array of meshes");

		}

		var al = array.length;

		for( var i = 0; i < al; i ++ ) {

			scope.addObject( array[i], options );

		}	
	
	}

    //Remove object from simulation
    scope.removeObject = function( uuid ) {

        var rObject = OBJECTS[uuid];

        //Throw a warning
        if( !rObject ) {
            console.log("Object not found with uuid " + uuid);
            return;
        }

        WORLD.remove( rObject.cannon );
        delete OBJECTS[uuid];

    };

    
	//Clear world bodies
    scope.clearWorld = function() {

        WORLD.bodies = [];

    };

	
	//clear movment of a physical body
	scope.clearMovement = function( body ) {

		if( typeof( body ) === "number" ) { 

			body = scope.getObject( body );

		}

		if( ! ( body instanceof CANNON.Body ) ) {

			console.warn( "Clear movement requires a cannon body" );
			return;

		}

        body.angularVelocity.set( 0, 0, 0 );
        body.velocity.set( 0, 0, 0 );

	};

	scope.init( options );

};

THREE.Physics.prototype = Object.create(THREE.Event.prototype);
