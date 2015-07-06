//three.js world scene and 3d api
//By Chuck
THREE.World = function() {

    var SCOPE = this;

    //World physics
    var OBJECTS = [ ];

    //Items, vehicles, and game action interactions
    var UPDATING = false;
    var currentAction = false;

    //Scene, screen, and web gl
    var SCENE = new THREE.Scene();
    var RENDERER;
    var COMPOSER;
    var CAMERA = new THREE.PerspectiveCamera(
        20, (window.innerWidth / window.innerHeight), 10, 1500
    );
    var CAMERAS = [ CAMERA ];

    //Timing and event dispatching
    var CLOCK = new THREE.Clock();

    //Html container
    var CONTAINER;

    //Screen size type
    var SCREEN_SIZE = "window";

    //Rendering updation function
    var UPDATER;

    //THREE.Loader for universal loading
    var LOADER = new THREE.LoaderHelper();

    //THREE.Exporter for different file types
    var EXPORTER = new THREE.Exporter();

    /********************Public Properties********************/

    //Current camera index
    this.cameraIndex = 0;

    //Render screen height and width
    this.screenWidth = 0;
    this.screenHeight = 0;

    //Camera autoAspect
    this.autoAspect = true;


    /********************World Webgl + Render globals********************/

    //Initialize Webgl at dom element ID
    this.init = function(containerID, options) {

        //Add webgl to container id'd webGL
        CONTAINER = document.getElementById(containerID);
        if(!CONTAINER) {
            throw new Error("Element not found with id " + containerID);
        }

        //Setup up rendering and options default webgl
        options = options || {};
        var renderType = options.renderType || "webgl";

        SCOPE.clearColor = options.clearColor || 0x000000;

        //Setup rendering and screen
        SCOPE.setRenderType(renderType);

        window.addEventListener("resize", SCOPE.screenResize, false);

    };


    //Get active camera
    this.getCamera = function() { return CAMERA; };

    //Get Renderer
    this.getRenderer = function() { return RENDERER; };

    //Get active scene
    this.getScene = function() { return SCENE; };


    /********************Screen sizing********************/

    // Set three scene
    this.setScene = function( scene ) {

        SCENE = scene;

    };

    //Remove object from scene
    this.removeObject = function( object3d ) {

        SCENE.remove( object3d );

        SCOPE.dispatch({
            type: "remove-mesh",
            uuid: object3d.uuid,
            object: object3d
        });

        if( object3d.geometry ) {
            object3d.geometry.dispose();
        }


    };

    // set screen sizing string [window, container] or x, y

    this.setScreenSize = function(type) {

        if(type === SCREEN_SIZE) {return;}

        if(type === "window") {
            SCREEN_SIZE = "window";
        }

        else if(type === "container") {
            SCREEN_SIZE = "container"
        }

        else {

            type = typeof(type) === "object" ? type : {};
            SCREEN_SIZE = type.x || 500;
            SCREEN_SIZE = type.y || 500;

        }

        SCOPE.screenResize();

    };

    //Get screen size by type

    this.getScreenSize = function() {

        var size = new THREE.Vector2;

        switch(SCREEN_SIZE) {

            case "window":
                size.x = window.innerWidth;
                size.y = window.innerHeight;
                break;

            case "container":
                size = SCOPE.getContainerSize();
                break;

            default:
                size = SCREEN_SIZE;

        }

        return size;

    };

    //get size of html container

    this.getContainerSize = function() {

        return {
            x: CONTAINER.clientWidth,
            y: CONTAINER.clientHeight,
        };

    };

    //Screen resize changes camera aspect and render

    this.screenResize = function() {

        var screenSize = SCOPE.getScreenSize();
        var x = screenSize.x,
            y = screenSize.y;

        SCOPE.screenWidth  = x;
        SCOPE.screenHeight = y;

        //Check autoAspect and adjust x / y
        if(SCOPE.autoAspect) {
            SCOPE.cameraAspect( x / y );
        }

        //Set canvas to size
        RENDERER.setSize( x, y );

        SCOPE.dispatch({
            type: "screen-resize",
            size: screenSize
        });

    };


    //Change frame quality

    this.screenQuality = function(quality){

    };


    //Set camera aspect default is window / height

    this.cameraAspect = function(aspect) {

        CAMERA.aspect = aspect - 0;
        CAMERA.updateProjectionMatrix();

    };

    /********************Render Post Processing********************/

    //Render to screen
    this.render = function(delta) {

        var evt = {
            start: Date.now(),
            delta: delta
        };

        var before = evt;
        before.type = "before-render";
        SCOPE.dispatch(before);

        RENDERER.render(SCENE, CAMERA);

    };

    //Set renerer and change composer
    this.setRenderer = function(renderer) {

        //Remove old
        var old = RENDERER;
        if(old) {CONTAINER.removeChild(old.domElement);}

        RENDERER = renderer;

        CONTAINER.appendChild(RENDERER.domElement);

        SCOPE.screenResize();

    };

    //Change Rendering type
    this.setRenderType = function(renderType, options) {

        if(!THREE.RenderTypes[renderType]) {
            throw new Error("Render type not valid " + renderType);
        }

        //Setup renderer
        var renderObj = THREE.RenderTypes[renderType];
        var renderOptions = options || renderObj.defaults;
        var renderFunc = renderObj.renderer;
        var renderer = new THREE[renderFunc](renderOptions);

        renderer.setClearColor( SCOPE.clearColor );

        SCOPE.setRenderer(renderer);

    };

    //Use shadows in renderer
    this.useShadows = function(useShadows, mapType, soft) {

        if(useShadows) {
            RENDERER.shadowMapEnabled = true;
            if(mapType) { RENDERER.shadowMapType = mapType; }
            if(soft) { RENDERER.shadowMapSoft = true; }
        }

        else {
            RENDERER.shadowMapEnabled = false;
        }

    };


    /********************World Object Updation********************/

    //Launch World and keep updating
    this.LaunchWorld = function() {
        UPDATING = true;
        CLOCK.start();
        SCOPE.update();
    };

    //Stop current updating process
    this.StopWorld = function() {
        UPDATING = false;
        CLOCK.stop();
    };

    //Update world geometery and player actions
    this.update = function() {

        //If world is updating recurse this function
        if(UPDATING) {
            requestAnimationFrame(SCOPE.update, RENDERER.domElement);
        }

        //Use delta time to update controls
        var delta = CLOCK.getDelta();

        //Update animations
        THREE.AnimationHandler.update(delta);

        //Render content
        SCOPE.render(delta);

    };


    /********************Creations********************/

    //Clear scene objects

    this.sceneClear = function() { SCENE = new THREE.Scene(); };

    //Remove object in scene by uuid

    this.sceneRemoveByUUID = function(uuid) {

    };

    //Remove object in scene by name

    this.sceneRemoveByName = function(name) {

    };

    //Add a mesh to collidable world
    this.addMesh = function(newObject) {

        //Add and dispatch event
        SCENE.add(newObject);
        OBJECTS.push(newObject);

        SCOPE.dispatch({
            type: "add-mesh",
            object: newObject
        });

    };

    //Lights are just added to world
    this.addLight = function(newLight) {

        SCENE.add(newLight);

        SCOPE.dispatch({
            type: "add-light",
            object: newLight
        });

    };

    //Add a scene camera

    this.addCamera = function(camera, setToActive) {

        if(!(camera instanceof THREE.Camera)) {
            throw new Error("Camera not THREE.Camera");
        }

        CAMERAS.push(camera);

        if(setToActive) {CAMERA = camera;}

    };

    //Set active Camera

    this.setCamera = function(indexNum) {

        indexNum = indexNum;
        if(!CAMERAS[indexNum]) {
            throw new Error("Index not in range");
        }

        CAMERA = CAMERAS[indexNum];

        SCOPE.screenResize();

    };


    //Export scene JSON as string

    this.sceneExportJSON = function() {

        return JSON.stringify(SCENE.toJSON());

    };

    //Load from loader module > url, callback
    this.universalLoad = LOADER.universalLoad;

    //Load by > type, url, callback
    this.loadType = LOADER.loadType;

};

THREE.World.prototype = Object.create(THREE.Event.prototype);
