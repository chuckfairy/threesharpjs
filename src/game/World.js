//three.js world scene and 3d api
//By Chuck
THREE.World = function() {

    var scope = this;

    //World physics
    var OBJECTS = [];

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
    scope.cameraIndex = 0;

    //Render screen height and width
    scope.screenWidth = 0;
    scope.screenHeight = 0;

    //Camera autoAspect
    scope.autoAspect = true;


    /********************World Webgl + Render globals********************/

    //Initialize Webgl at dom element ID
    scope.init = function(containerID, options) {

        //Add webgl to container id'd webGL
        CONTAINER = document.getElementById(containerID);
        if(!CONTAINER) {
            throw new Error("Element not found with id " + containerID);
        }

        //Setup up rendering and options default webgl
        options = options || {};
        var renderType = options.renderType || "webgl";

        scope.clearColor = options.clearColor || 0x000000;

        options.opacity = typeof options.opacity === "undefined"
            ? 1 : options.opacity;

        //Setup rendering and screen
        scope.setRenderType( renderType, options );

        window.addEventListener("resize", scope.screenResize, false);

    };


    //Get active camera
    scope.getCamera = function() { return CAMERA; };

    //Get Renderer
    scope.getRenderer = function() { return RENDERER; };

    //Get active scene
    scope.getScene = function() { return SCENE; };


    /********************Screen sizing********************/


    // Set three scene
    scope.setScene = function( scene ) {

        SCENE = scene;

    };


    //Remove object from scene
    scope.removeObject = function( object3d ) {

        SCENE.remove( object3d );

        scope.dispatch({
            type: "remove-mesh",
            uuid: object3d.uuid,
            object: object3d
        });

        if( object3d.geometry ) {
            object3d.geometry.dispose();
        }


    };

    // set screen sizing string [window, container] or x, y

    scope.setScreenSize = function(type) {

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

        scope.screenResize();

    };

    //Get screen size by type

    scope.getScreenSize = function() {

        var size = new THREE.Vector2;

        switch(SCREEN_SIZE) {

            case "window":
                size.x = window.innerWidth;
                size.y = window.innerHeight;
                break;

            case "container":
                size = scope.getContainerSize();
                break;

            default:
                size = SCREEN_SIZE;

        }

        return size;

    };

    //get size of html container

    scope.getContainerSize = function() {

        return {
            x: CONTAINER.clientWidth,
            y: CONTAINER.clientHeight,
        };

    };

    //Screen resize changes camera aspect and render

    scope.screenResize = function() {

        var screenSize = scope.getScreenSize();
        var x = screenSize.x,
            y = screenSize.y;

        scope.screenWidth  = x;
        scope.screenHeight = y;

        //Check autoAspect and adjust x / y
        if(scope.autoAspect) {
            scope.cameraAspect( x / y );
        }

        //Set canvas to size
        RENDERER.setSize( x, y );

        scope.dispatch({
            type: "screen-resize",
            size: screenSize
        });

    };


    //Change frame quality

    scope.screenQuality = function(quality){

    };


    //Set camera aspect default is window / height

    scope.cameraAspect = function(aspect) {

        CAMERA.aspect = aspect - 0;
        CAMERA.updateProjectionMatrix();

    };

    /********************Render Post Processing********************/

    //Render to screen
    scope.render = function(delta) {

        var evt = {
            start: Date.now(),
            delta: delta
        };

        var before = evt;
        before.type = "before-render";
        scope.dispatch(before);

        RENDERER.render(SCENE, CAMERA);

    };

    //Set renerer and change composer
    scope.setRenderer = function(renderer) {

        //Remove old
        var old = RENDERER;
        if(old) {CONTAINER.removeChild(old.domElement);}

        RENDERER = renderer;

        CONTAINER.appendChild(RENDERER.domElement);

        scope.screenResize();

    };

    //Change Rendering type
    scope.setRenderType = function(renderType, options) {

        if(!THREE.RenderTypes[renderType]) {
            throw new Error("Render type not valid " + renderType);
        }

        //Setup renderer
        var renderObj = THREE.RenderTypes[renderType];
        var renderOptions = options || renderObj.defaults;
        var renderFunc = renderObj.renderer;
        var renderer = new THREE[renderFunc](renderOptions);

        renderer.setClearColor( scope.clearColor, options.opacity );

        scope.setRenderer(renderer);

    };

    //Use shadows in renderer
    scope.useShadows = function(useShadows, mapType, soft) {

        if( useShadows ) {

            RENDERER.shadowMap.enabled = true;
            if(mapType) { RENDERER.shadowMapType = mapType; }
            if(soft) { RENDERER.shadowMapSoft = true; }

        }

        else {

            RENDERER.shadowMap.enabled = false;

        }

    };


    /********************World Object Updation********************/

    //Launch World and keep updating
    scope.LaunchWorld = function() {
        UPDATING = true;
        CLOCK.start();
        scope.update();
    };

    //Stop current updating process
    scope.StopWorld = function() {
        UPDATING = false;
        CLOCK.stop();
    };

    //Update world geometery and player actions
    scope.update = function() {

        //If world is updating recurse scope function
        if(UPDATING) {
            requestAnimationFrame(scope.update, RENDERER.domElement);
        }

        //Use delta time to update controls
        var delta = CLOCK.getDelta();

        ////Update animations
        //THREE.AnimationHandler.update(delta);

        //Render content
        scope.render(delta);

    };


    /********************Creations********************/

    //Clear scene objects

    scope.sceneClear = function() { SCENE = new THREE.Scene(); };

    //Remove object in scene by uuid

    scope.sceneRemoveByUUID = function(uuid) {

    };

    //Remove object in scene by name

    scope.sceneRemoveByName = function(name) {

    };

    //Add a mesh to collidable world
    scope.addMesh = function( mesh ) {

        //Add and dispatch event
        SCENE.add( mesh );
        OBJECTS.push( mesh );

        scope.dispatch({
            type: "add-mesh",
            object: mesh 
        });

    };

	//Add meshes from array
	scope.addMeshes = function( meshes ) {

		if( typeof( meshes ) !== "object" ) {

			throw new Error( "Add meshes requires an array of meshes" );

		}

		var ml = meshes.length;

		for( var i = 0; i < ml; i ++ ) {

			scope.addMesh( meshes[i] );

		}

	};

    //Lights are just added to world
    scope.addLight = function(newLight) {

        SCENE.add(newLight);

        scope.dispatch({
            type: "add-light",
            object: newLight
        });

    };

    //Add a scene camera

    scope.addCamera = function(camera, setToActive) {

        if( ! ( camera instanceof THREE.Camera ) ) {

            throw new Error("Camera not THREE.Camera");
        
		}

        CAMERAS.push( camera );

        if( setToActive ) { CAMERA = camera; }

    };

    //Set active Camera

    scope.setCamera = function(indexNum) {

        indexNum = indexNum;
        if(!CAMERAS[indexNum]) {
            throw new Error("Index not in range");
        }

        CAMERA = CAMERAS[indexNum];

        scope.screenResize();

    };


    //Export scene JSON as string

    scope.sceneExportJSON = function() {

        return JSON.stringify(SCENE.toJSON());

    };

    //Load from loader module > url, callback
    scope.universalLoad = LOADER.universalLoad;

    //Load by > type, url, callback
    scope.loadType = LOADER.loadType;

};

THREE.World.prototype = Object.create(THREE.Event.prototype);
