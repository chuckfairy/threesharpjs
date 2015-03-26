//Dude mode js script for controlling mesh
//Like a person
//By Chuck

THREE.Person = function(customize) {
    var t = this;

    //Global data
    var MODEL = new THREE.Model();

    //Movement data
    t.moving = false;
    t.movingKey = false;
    t.processingMovement=false;
    t.currentrotation = 0;
    t.mouseControl = false;
    t.live = false;

    //View data
    t.view = 3; //set third person by default
    t.mouseX=0;
    t.mouseY=0;
    t.radius;

    //Jump data
    this.jumping = false;
    this.jumpvelocity = 0;
    this.canJump = true;

    //Customizations
    customize = customize || {};
    t.keyCallbacks = customize.callbacks || {};
    t.animationModes = customize.animations || {};
    t.animate;
    t.speed = customize.speed || 180;
    t.onload = customize.load || false;

    //Animation data
    var ANIMATION_MODES = {};
    this.animationMode = {};


    //Public API
    this.load = function(meshUrl, callback) {
        MODEL.load(meshUrl, (callback || null));
    }

    //Get position of MODEL
    this.getPosition = function() {
        return MODEL.position.clone();
    };

    //Get radius of mesh
    this.getRadius = function() {
        return MODEL.geometry.boundingSphere.radius;
    };

    this.getModel = function(){return MODEL;};

    //Set position of model given by vector
    this.setPosition = function(vector3) {
        MODEL.position.copy(vector3);
        this.modelUpdate();
    };

    //Update model animations and vectercies
    this.modelUpdate = function() {
        MODEL.update();
    }

    //Move from set movement direction
    this.getProjectedPosition = function(delta) {
        var t=this;
        t.delta = delta;

        t.rotateChange();

        this.currentPosition = t.getPosition();
        if(this.moving) {
            //Get sine and cosine of rotational radian
            var deltadelim = delta * t.speed;
            var sine = Math.sin(this.movingDirection);
            var cosine = Math.cos(this.movingDirection);

            //Z change
            var zChange = cosine*deltadelim;
            var thisZ = (this.currentPosition.z - zChange);

            //X Change
            var xChange = sine*deltadelim;
            var thisX = (this.currentPosition.x - xChange);
        } else {
            var thisX = this.currentPosition.x;
            var thisZ = this.currentPosition.z;
        }

        var yChange = this.simulateGravity();

        //Set mesh position vector
        return new THREE.Vector3(thisX, yChange, thisZ);
    }


    /***************User Controls***************/

    //Process a key down function
    this.processKeyDown = function(charname) {
        var t = this;

        //Process wasd and up,left,down,right as movements
        if(/^[wasd]$/.test(charname)) {

            t.processingMovement = true;
            if(t.movingKey === charname) {return;}
            if(t.moving || t.movingKey) {t.stopMovements();}
            setTimeout(function() {
                t.processMovement(charname);
            }, 25);
        }

        //Jump with spacebar
        if(charname === "space") {t.setjump();}

        t.processingMovement = false;
    };

    //Stops functions if has callback for it
    this.processKeyUp = function(charname) {
        //Stop movements
        if(/^[wasd]$/.test(charname)) {
            this.processingMovement = true;
            this.stopMovements();
        }

        this.processingMovement = false;
    };

    //Process movement based on direction or wasd
    this.processMovement = function(charname) {
        var t = this;
        if(t.moving) {t.stopMovements();}

        //Get degree from rotation radian
        var deg = (t.currentrotation * 180/Math.PI);

        //Change degree direction based on wasd
        var degDirection=0;
        switch(charname) {
            case "w":break;
            case "a":degDirection = 90;break;
            case "s":degDirection = 180;break;
            case "d":degDirection = 270;break;
        }

        t.movingKey = charname;
        t.movingDirection = (((deg + degDirection)*Math.PI)/180);
        t.moving = true;
    };

    //Stops movements currently going on
    this.stopMovements = function() {
        if(this.moving) {
            this.moving = false;
            this.movingKey = false;
            this.movingDirection = false;
        }
    };

    //set jump velocity
    this.setjump = function() {
        if(CONTROLS.onGround) {
            this.jumping = true;
            this.jumpvelocity = 150;
        }
    };

    //Tracks mouse movement for view movement
    this.mouseControl = function(e) {
        var t = this;
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        //Mouse xy coordinates
        var mouseXY = CONTROLS.getMouseXY(e);

        //how much mouse is changing from center
        //Y not currently used
        var changeX = (mouseXY["x"] - (wWidth/2))/(wWidth/2);
        var changeY = (mouseXY["y"] - (wHeight/2))/(wHeight/2);

        //Set previous values
        this.mouseX = changeX;
        this.mouseY = changeY;
    };

    //Change rotation
    this.rotateChange = function() {
        var yRotate = this.currentrotation;
        var changeY = this.mouseX*.05;
        var newrotation = (yRotate - changeY);

        //set new rotation for current rotation and on mesh
        this.currentrotation = MODEL.rotation.y = newrotation;
        if(this.moving) {this.processMovement(this.movingKey);}
    };


    /***************Model Movement***************/

    //Jumping physics update
    this.simulateGravity = function() {
        var t = this;
        if(t.jumping || !CONTROLS.onGround) {

            t.jumpvelocity -= 9.8 * 40.0 * t.delta;
            t.fallTranslate = (t.jumpvelocity * t.delta);

            var fallY = MODEL.position.y + t.fallTranslate;

            //If it has reached the ground stop
            if (MODEL.position.y < 0) {
                t.jumping = false;
                t.jumpvelocity = 0;
                MODEL.position.y = 0;
                CONTROLS.onGround = true;
                return 0;
            }

            return fallY;
        }

        return MODEL.position.y;
    }

    /***************Animations***************/
    this.setAnimationModes = function(animationModes) {
        ANIMATION_MODES = animationModes;
    };

    //Change animation mode
    this.changeMode = function(mode) {
        this.animationMode = ANIMATION_MODES[mode];
        this.toIdle();
    };

    //Stop dude to idle
    this.toIdle = function() {
        MODEL.morphTo(this.animationMode["idle"]);
    };

    //Change movement animation based on wasd + space + idle
    this.changeAnimation = function(changeCode) {
        if(this.animationMode[changeCode]) {
            MODEL.morphTo(this.animationMode[changeCode]);
        } else {
            this.toIdle();
        }
    };

};
