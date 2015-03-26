//Camera controls module
//Folows target or sets it to a follow position
//By Chuck

THREE.CameraControl = function(camera, target) {

    //Privates
    var SCOPE = this;

    //Publics
    this.camera = camera;
    this.target = target;
    this.view = 3;

    //Camera view processing on person object
    this.processCamera = function() {

        var aspect = window.innerWidth / window.innerHeight;
        var radius = CONTROLLER.getRadius();
        var meshPosition = PERSON.getPosition();
        var thisX = meshPosition.x;
        var thisY = meshPosition.y;
        var thisZ = meshPosition.z;

        var sine = Math.sin(CONTROLLER.currentrotation);
        var cosine = Math.cos(CONTROLLER.currentrotation);

        //First person mode
        if(this.view === 1) {
            //Set position
            this.camera.position.set(thisX, thisY + radius, thisZ );

            //Set rotation of view
            var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
            euler.x = -this.mouseY;
            euler.y = this.currentrotation;
            this.camera.quaternion.setFromEuler(euler);
        }

        //Second person mode
        else if(this.view === 2) {
            //Move in front of mesh
            thisX = thisX - (sine * radius *1);
            thisZ = thisZ - (cosine * radius * 1);

            //Set camera
            this.camera.position.set(thisX, thisY + radius, thisZ);
            var lookAt = meshPosition;
            lookAt.y = thisY + radius + 4;
            this.camera.lookAt(lookAt);
        }

        //Third person mode
        else if(this.view === 3) {
            //Move back by radius
            thisX =  thisX + ((sine)*radius*3);
            thisZ = thisZ + (cosine*radius*3);

            //Set camera
            this.camera.position.set(thisX, thisY + radius, thisZ);
            var lookAt = meshPosition;
            lookAt.y = thisY + radius * .5;
            this.camera.lookAt(lookAt);
        }

        this.camera.updateProjectionMatrix();
    };

    //Toggles between 1st, 2nd, 3rd person view
    this.changeCameraView = function() {
        if(scope.view === 3) {scope.view = 1;}
        else {scope.view++;}
        scope.processCamera();
    };
};
