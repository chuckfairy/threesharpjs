//Basic THREE.js Physics with CANNON.js
//By Chuck
THREE.Physics = function(options) {

    var SCOPE = this;

    var WORLD = new CANNON.World();
    WORLD.gravity.set( 0, -9.8, 0 );
    WORLD.broadphase = new CANNON.SAPBroadphase(WORLD);
    WORLD.solver.iterations = 10;
    //WORLD.solver.tolerance = 0;

    WORLD.allowSleep = options.allowSleep;
    WORLD.defaultContactMaterial.friction = 1000;
    WORLD.defaultContactMaterial.restitution = .2;

    //Wolrd time point
    var TIMESTEP = 0;

    var MAXSTEPS = 1;

    //THREE.js Objects
    var OBJECTS = {};

    //Cannon physical elements
    var CANNON_BODIES = {};


    /********************Properties********************/

    //Frames per second
    this.fps = 20;

    /********************World get and setters********************/

    //Get an object by mesh uuid
    this.getObject = function(uuid) {
        return OBJECTS[uuid] || false;
    };


    /********************World Creation and use********************/

    //Initialization
    this.init = function(options) {
        //Set gravity
        if(!options.gravity) {
            options.gravity = new THREE.Vector3(0, -9.8, 0);
        }

        SCOPE.setGravity(options.gravity);
    };

    //Update the thru a time step
    this.update = function( delta ) {

        this.dispatch({
            type: 'before-update',
            delta: delta
        });

        //TIMESTEP += delta * ;
        WORLD.step( 1 / SCOPE.fps );
        SCOPE.updateBodies();

    };

    //Update positions and rotation of objects
    this.updateBodies = function() {
        var ol = OBJECTS.length;

        for( var uuid in OBJECTS ) {
            var objects = OBJECTS[uuid];
            var cannon = objects.cannon;
            var mesh = objects.object;
            if(cannon.position === mesh.position) {
                console.log("no change");
                continue;
            }

            mesh.position.copy(cannon.position);
            mesh.quaternion.copy(cannon.quaternion);

        }

    };

    //Get cannon world for adding stuff to it
    this.getWorld = function() { return WORLD; };

    //Get world objects
    this.getObjects = function() { return OBJECTS; };

    //Change gravity
    this.setGravity = function(vector3) {
        if(!(vector3 instanceof THREE.Vector3)) {
            throw new Error("Parameter not THREE.Vector3");
        }

        WORLD.gravity.set(vector3.x, vector3.y, vector3.z);
    };

    //add an object to physical world
    //and uses cannon built in rigid body detection
    this.addObject = function( mesh, options ) {

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

        WORLD.add(cannonBody);

    };


    //Remove object from simulation
    this.removeObject = function(uuid) {

        var rObject = OBJECTS[uuid];

        //Throw a warning
        if(!rObject) {
            console.log("Object not found with uuid " + uuid);
            return;
        }

        WORLD.remove(rObject.cannon);
        delete OBJECTS[uuid];

    };

    //Clear world bodies
    this.clearWorld = function() {

        WORLD.bodies = [];

    };


    //Initialize
    //Set init options
    options = options || {};
    SCOPE.init(options);

};

THREE.Physics.prototype = Object.create(THREE.Event.prototype);
