// Threejs physical vehicles relies on PhysicalBody
// By Chuck
THREE.PhysicalVehicle = function( chassisBody, options ) {

    options = options || {};

    chassisBody.mass = options.vehicleMass || chassisBody.mass || 150;

    //Create PhysicalBody
    this.vehiclePhysicalBody = new THREE.PhysicalBody( chassisBody, {type: "box"} );
    this.vehicleBody = this.vehiclePhysicalBody.getBody();
    this.vehicleBody.position.copy(chassisBody.position);
    this.vehicleBody.quaternion.copy(chassisBody.quaternion);

    //Create vehicle
    this.vehicle = new CANNON.RigidVehicle({
        chassisBody: this.vehicleBody
    });

    //chassis body mesh
    this.chassisBody = chassisBody;

    //Center of mass addjuster
    this.centerOfMass = options.centerOfMass || new CANNON.Vec3(0,0,-1);

    //all wheels index and used for motions
    this.wheelBodies = [];

    this.wheelMeshes = [];

    //Default wheel mesh for adding wheels
    this.wheelMesh = options.wheelMesh ||
        new THREE.Mesh( new THREE.Cylinder(), new THREE.MeshLambertMaterial() );

    this.wheelPhysicalBody = new THREE.PhysicalBody( this.wheelMesh );

    this.wheelShape = this.wheelPhysicalBody.getShape();

    this.wheelMaterial = options.wheelMaterial || new CANNON.Material("wheelMaterial");

    //this.wheelSize = this.wheelMesh.geometry.boundingBox.size();

    this.wheelPositions = options.wheelPositions || [];

    this.wheelMass = this.wheelMesh.mass || 2;

    this.wheelDirection = options.wheelDirection || new CANNON.Vec3(0,-1,0);

    this.wheelAxis = options.wheelAxis || new CANNON.Vec3(1, 0, 0);

    //Initialize
    this.init();

};

THREE.PhysicalVehicle.prototype = {

    constructor: THREE.PhysicalVehicle,

    wheels: [],
    wheelsLength: 0,

    init: function() {

        if ( this.wheelPositions.length ) {
            this.setWheels(this.wheelPositions);
        }

    },

    //Set wheel to chassis

    setWheel: function(options) {

        options = options || {};

        //Create shape for chassis
        var wz = this.wheelSize;
        var wheelShape = this.wheelShape;

        var wheelBody = new CANNON.Body({
            mass: options.mass || this.wheelMass,
            material: options.material || this.wheelMaterial
        });

        var q = new CANNON.Quaternion();
        q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
        wheelBody.addShape(wheelShape, new CANNON.Vec3(), q);
        wheelBody.angularDamping = 0.4;

        var position = (options.position) ?
            new CANNON.Vec3().copy(options.position) : new CANNON.Vec3(0,0,0);
        position.vadd(this.centerOfMass);

        var axis = (options.axis) ? new CANNON.Vec3().copy(options.axis) : this.wheelAxis;

        this.vehicle.addWheel({
            body: wheelBody,
            position: position,
            axis: axis,
            direction: options.direction || this.wheelDirection
        });

        this.wheelLength = this.vehicle.wheelBodies.length;

        this.wheelBodies.push(wheelBody);

        //this.vehicleBody.addShape(wheelShape);

        //3d
        var wheelMesh = this.wheelMesh.clone();
        wheelMesh.position.copy(position);

        this.chassisBody.parent.add(wheelMesh);

        this.wheelMeshes.push(wheelMesh);

    },


    //set array of wheels

    setWheels: function( arr ) {

        var arrLength = arr.length;

        for( var i = 0; i < arrLength; i++ ) {

            var wheel = arr[i];
            this.setWheel(wheel);

        }

    },


    //Add to a cannon world or THREE.Physics object

    addToWorld: function( world ) {

        if( world instanceof THREE.Physics ) {

            world = world.getWorld();

        }

        this.vehicle.addToWorld( world );

    },


    //Apply an engine force a wheel or all if arg2 null

    setWheelForce: function( value, wheelIndex ) {

        if( !wheelIndex ) {

            var wheelLength = this.wheelLength;

            for( var i = 0; i < wheelLength; i++ ) {

                this.vehicle.setWheelForce( value, i );

            }

        }

        else if( wheelIndex.constructor === Array ) {

            var wheelLength = wheelIndex.length;

            for( var i = 0; i < wheelLength; i++ ) {

                var wheelI = wheelIndex[i];
                this.vehicle.setWheelForce( value, wheelI );

            }

        } else {

            //this.vehicle.setBrake(0, wheelIndex);
            this.vehicle.setWheelForce( value, wheelIndex );

        }

    },

    setSteeringValue: function( value, i ) {

        if ( i.constructor === Array ) {

            var indexLength = i.length;

            for( var t = 0; t < indexLength; t++ ) {

                this.vehicle.setSteeringValue( value, i[t] );

            }

            return;

        }

        this.vehicle.setSteeringValue( value, i );

    },


    //Update wheels and mesh

    update: function() {

        var t = this;

        t.chassisBody.position.copy(t.vehicleBody.position);
        t.chassisBody.quaternion.copy(t.vehicleBody.quaternion);

        var wl = this.wheelLength;
        var wheelInfo = this.vehicle.wheelInfos;
        var wheelBodies = this.wheelBodies;

        for (var i = 0; i < wl; i++) {
            //this.vehicle.updateWheelTransform(i);
            var wheelBody = wheelBodies[i];//.worldTransform;
            var wheelMesh = t.wheelMeshes[i];
            wheelMesh.position.copy(wheelBody.position);
            wheelMesh.quaternion.copy(wheelBody.quaternion);
        }

    }

}
