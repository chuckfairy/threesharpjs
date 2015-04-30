//Dae vehicle loader and controls
THREE.PhysicalVehicleControls = function( physicalVehicle, options ) {

    var scope = this;

    options = options || {};

    this.vehicle = physicalVehicle;

    // car data manual parameters
    this.maxForce = options.speed || 1000;
    this.maxAcceleration = options.acceleration || 5;
    this.maxWheelRotation = options.steering || 5;

    this.velocity = 0;
    this.acceleration = 0;

    this.steeringForce = options.steeringForce || Math.PI / 8;

    //array of wheel drive [1, 0] which wheels to move
    this.wheelDrive = options.wheelDrive || [ 0, 1, 2, 3 ];

    this.steeringDrive = options.steeringDrive || [ 0, 1, 2, 3];

    //max wheel rotation
    this.wheelRotation = 0;


    //Key down event move car
    var keyDown = function( event ) {

        switch( event.charName ) {

            case "up": case "w":
                scope.vehicle.setWheelForce( scope.maxForce );//, this.wheelDrive );
                break;

            case "down": case "s":
                scope.vehicle.setWheelForce( -scope.maxForce, this.wheelDrive );
                break;

            case "left": case "a":
                scope.vehicle.setSteeringValue( scope.steeringForce, this.steeringDrive );
                break;

            case "right" : case"d":
                scope.vehicle.setSteeringValue( -scope.steeringForce, this.steeringDrive );
                break;

        }

    };

    var keyUp = function( event ) {


        switch( event.charName ) {

            case "up": case "w": case "down": case "s":
                scope.vehicle.setWheelForce( 0, this.wheelDrive );
                break;

            case "left": case "a": case "right" : case"d":
                scope.vehicle.setSteeringValue( 0, this.steeringDrive );
                break;

        }

    };


    //Three keyboard controls from events and params
    this.keyboardControls = new THREE.KeyboardControls({

        events: {
            "keydown": keyDown,
            "keyup": keyUp
        }

    });

};

THREE.PhysicalVehicleControls.prototype = {

    init: function() {


    },

    //Starts controls on call
    start: function() {
        this.keyboardControls.start();
    },

    //Stops controls and remove listeners
    stop: function() {
        this.keyboardControls.stop();
    },

    //Update mesh, controls, and movement
    update: function() {
        this.vehicle.update();
    },

};
