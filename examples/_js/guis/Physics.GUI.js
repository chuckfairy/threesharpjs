// G3 Simple physics GUI using the data gui and G3.Physics
// https://github.com/dataarts/dat.gui
// By Chuck

THREE.Physics.GUI = function(physicsObj) {

    //Privates
    var SCOPE = this;
    var PHYSICS = physicsObj;
    var WORLD = physicsObj.getWorld();
    var GUI = new dat.GUI({ autoPlace: false });

    //Folders
    this.folders = {
        physics: GUI.addFolder("Physics"),
        scenes: GUI.addFolder("Scenes")
    };

    //Gravity
    this.gravityX = WORLD.gravity.x;
    this.gravityY = WORLD.gravity.y;
    this.gravityZ = WORLD.gravity.z;

    //solver iterations
    this.solveriterations = WORLD.solver.iterations;


    //Add physics
    this.initPhysics = function() {
        var pFolder = SCOPE.folders["physics"];

        //Gravity min and maximum
        var gMin = -30.00;
        var gMax = 30.00;

        //Gravity gui controller
        var gX = pFolder.add(SCOPE, "gravityX", gMin, gMax);
        var gY = pFolder.add(SCOPE, "gravityY", gMin, gMax);
        var gZ = pFolder.add(SCOPE, "gravityZ", gMin, gMax);

        //Frames per second
        pFolder.add(PHYSICS, "fps", 10, 360);

        //solver iterations
        pFolder.add(SCOPE, "solveriterations", 1, 40);

        gX.onChange(SCOPE.changeGravity);
        gY.onChange(SCOPE.changeGravity);
        gZ.onChange(SCOPE.changeGravity);
    };

    //Change gravity of object
    this.changeGravity = function() {
        PHYSICS.setGravity(
            new THREE.Vector3(SCOPE.gravityX, SCOPE.gravityY, SCOPE.gravityZ)
        );
    };

    //Public API

    //Return dat.GUI object
    this.getGUI = function() {return GUI;};

    //append to dom element if this is even needed...
    this.appendToElement = function(elementId) {
        var del = document.getElementById(elementId);

        if(!del) {
            throw new Error("Element with id not found: " + del);
        }

        //Append to element
        del.appendChild(GUI.domElement);
    };

    //Create GUI Folder
    this.createFolder = function(name) {
        SCOPE.folders[name] = GUI.addFolder(name)
    };

    //Add a value
    this.addToFolder = function(foldername, keyname, value1, value2) {

        //Create new folder if it doesn't exist
        if(!SCOPE.folders[foldername]) {
            SCOPE.createFolder(foldername);
        }

        //Add folder controller
        var folder = SCOPE.folders[foldername];
        SCOPE[keyname] = value1;
        folder.add(SCOPE, keyname);
    };

    //Add a scene function to be called
    this.addScene = function(name, sceneFunc) {

        //Set timestep to 0 to start off
        SCOPE[name] = function() {
            //PHYSICS.setTimestep(0);
            sceneFunc();
        };

        //Add scene to GUI folder
        SCOPE.folders["scenes"].add(SCOPE, name);
    };

    this.init();
};

THREE.Physics.GUI.prototype = {
    init: function() {
        this.initPhysics();
        this.folders["scenes"].open();
    }
};
