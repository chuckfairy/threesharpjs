//Dae vehicle loader and controls
THREE.VehicleControls = function(loadurl, customize) {

    var scope = this;

    // car data manual parameters
    customize = customize || {};
    var MAX_SPEED = customize.speed || 5;
    var MAX_ACCELERATION = customize.acceleration || 5;
    var STEERING_RADIUS = customize.steering || 5;

    var VELOCITY = 0;
    var ACCELERATION = 0;
    var SPEED = 0;
    var TURNING = 0;
    var IS_ACCELERATING;
    var IS_DECELERATING;

    var delta = 0;

    var WHEEL_ROTATION = 0;
    var CAR_ROTATION = 0;

    // car rigging and texturing
    this.root = new THREE.Object3D();
    this.bodyMaterials = null;
    this.maptexture = new THREE.Texture();

    //Action data
    this.actionMessage = customize.actionMessage || "Enter vehicle";

    this.keyup = this.keyUp.bind(this);
    this.keydown = this.keyDown.bind(this);

    // internal helper variable
    this.live = false;

    //JSON load
    WORLD.jsLoad(loadurl, function (geometry, materials ) {
        scope.init(geometry, materials);
    });

    //Update matrix
    this.updateMatrix = function(newdelta) {
        delta = newdelta;
        this.updateAcceleration();
        this.updateVelocity();
        this.updateWheel();
        return this.updatePosition();
    };

    //Set acceleration
    this.setAccelerate = function() {
        IS_ACCELERATING = true;
    };

    //Set a decrease in speed
    this.setDecelerate = function() {
        IS_DECELERATING = true;
    };

    //Stop all velocity speed changes
    this.stopAcceleration = function(){
        IS_ACCELERATING = false;
        IS_DECELERATING = false;
    };

    //Update acceleration
    this.updateAcceleration = function() {
        if(ACCELERATION >= MAX_ACCELERATION) {
            ACCELERATION = MAX_ACCELERATION;
            return;
        }

        if(IS_ACCELERATING) {
            ACCELERATION += delta * 100;
        } else if(IS_DECELERATING) {
            ACCELERATION = Math.max( (ACCELERATION - delta * 100), -2);
        }
    };

    //Update speed for velocity
    this.updateVelocity = function() {
        //Update velocity speed
        VELOCITY = Math.min( (VELOCITY + (delta * ACCELERATION * 100)), MAX_SPEED);

        //Account for friction
        var delim=0;
        if(VELOCITY > 0) {delim = -0.5;}
        else if(VELOCITY < 0) {delim = 0.5;}
        VELOCITY = VELOCITY + ((ACCLERATION + delim) * delta * 100);
    };

    //Update matrix position with velocity and rotation
    this.updatePosition = function() {
        var deg = (CAR_ROTATION * 180/Math.PI);
        var degwheel = (WHEEL_ROTATION * 180/Math.PI);

        var movingDir = (((deg + degwheel)*Math.PI)/180);

        console.log(WHEEL_ROTATION, TURNING, VELOCITY);
    };


    //Steering set
    this.setTurn = function(charCode) {
        if(charCode === "d") {TURNING = 1;}
        if(charCode === "a") {TURNING = -1;}
    };

    //Stop turning set both directions
    this.stopTurn = function() {TURNING = 0;};

    //Update wheel based on max radius
    this.updateWheel = function() {
        if(TURNING === 0) {return;}

        var turningdelim = TURNING * delta * 100;
        var turnchange = Math.min((WHEEL_ROTATION + turningdelim), STEERING_RADIUS);
        turnchange = Math.max(turnchange, -STEERING_RADIUS);
        WHEEL_ROTATION = turnchange;
    };

    //Sets up mouse for use of directions in movement
    this.setupMouse = function() {
        var t = this;
        window.addEventListener("mousemove", t.mousemover);
    };

    //Tracks mouse movement for view movement
    this.followMouse = function(e) {
        var t = this;
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;

        //Mouse xy coordinates
        var mouseXY = t.getMouseXY(e);

        //how much mouse is changing from center
        //Y not currently used
        var changeX = (mouseXY["x"] - (wWidth/2))/(wWidth/2);
        var changeY = (mouseXY["y"] - (wHeight/2))/(wHeight/2);

        //Set previous values
        this.mouseX = changeX;
        this.mouseY = changeY;
    };

    //Changes mouse view based on interval of 15ms
    this.moveMouseView = function() {
        var yRotate = this.currentrotation;
        var changeY = this.mouseX*.05;
        var newrotation = (yRotate - changeY);

        //set new rotation for current rotation and on mesh
        this.currentrotation = this.mesh.rotation.y = newrotation;
        if(this.moving) {this.processMovement(this.movingKey);}
        this.processCamera();
    };

    //stop following mouse controls
    this.stopFollowMouse = function() {
        var t = this;
        window.removeEventListener("mousemove", t.mousemover);
    };

};

THREE.VehicleControls.prototype = {
    init: function(geometry, materials) {
        var lambertMaterial = new THREE.MeshLambertMaterial({color: 0x888888});
        this.bodyMesh = new THREE.Mesh(geometry, lambertMaterial);
        //this.bodyMesh.castShadow = true;
        this.bodyMesh.receiveShadow = true;
        this.bodyMesh.position.set(-100,0,20);
        this.bodyMesh.geometry.computeBoundingSphere();
        //this.bodyMesh.material.map = this.maptexture;
        var t = this;
        WORLD.addObject(this.bodyMesh, {
            message: this.actionMessage,
            action: function(){t.enterVehicle();}
        });
    },

    //Starts controls on call
    enterVehicle: function() {
        var t = this;
        controls.stopControls();
        controls.changeMode("skateboard");
        window.addEventListener("keydown", t.keydown, false);
        window.addEventListener("keyup", t.keyup, false);
        window.addEventListener("mousemove", t.mousemover);
    },

    //Stops controls and remove listeners
    exitVehicle: function() {
        var t = this;
        window.removeEventListener("keydown", t.keydown, false);
        window.removeEventListener("keyup", t.keyup, false);
        window.removeEventListener("mousemove", t.mousemover);
        controls.startControls();
    },

    //Update mesh, controls, and movement
    update: function() {

    },

    //Key down initializes events
    keyDown: function(e) {
        var charCode = controls.getcharname(e);

        //W accelerate and S to decelerate
        if(charCode === "w") {this.setAccelerate();}
        if(charCode === "s") {this.setDecelerate();}

        //a and d and left and right turning
        if(/^[ad]$/.test(charCode)) {this.setTurn(charCode);}

        //f Exits car
        if(charCode === "f") {this.exitVehicle();}
    },

    //On key up stop events currently added
    keyUp: function(e) {
        var charCode = controls.getcharname(e);

        //Stop accelerations
        if(/^[ws]$/.test(charCode)) {this.stopAcceleration();}

        //Stop turns
        if(/^[ad]$/.test(charCode)) {this.stopTurning();}
    },

};
