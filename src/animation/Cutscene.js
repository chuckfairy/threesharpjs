//three js cutscene renderer for pictures and webm video
//By Chuck
THREE.Cutscene = function(world) {

    //Public Variables
    this.scene;
    this.renderer;
    this.camera;

    //Private Variables
    var SCOPE = this;
    var UPDATER;

    //Check world then import
    if(world) {
        SCOPE.importWorld(world);
    }

    //Cache a render into one frame
    this.cache = function(step) {
        UPDATER((step || 0));
        SCOPE.renderer.render(SCOPE.scene, SCOPE.camera);
        return SCOPE.renderer.domElement.toDataURL();
    };

    //Cache an animation into a video
    this.cacheScene = function(timeframe, framerate, quality) {
        timeframe = Math.abs(timeframe) || 1000;
        framerate = Math.abs(framerate) || 60
        var speed = 1.0 / (framerate);
        quality = Math.min(1, Math.abs(quality||1));
        var whammy = new G3.Whammy.Video(speed, quality);

        //Play animatioin and add frame cache
        SCOPE.playAnimation(timeframe, framerate, function(framecache){
            whammy.add(framecache);
        });

        //Compile video and return url object
        var output = whammy.compile();
        var url = G3.createObjectURL(output);
        return url;
    };

    //Play animation render
    this.playAnimation = function(timeframe, framerate, loopcallback) {
        for(var t = 0; t < timeframe; t+framerate) {
            var framecache = SCOPE.cache(speed);

            //Loop frame cache middle ware
            if(loopcallback) {
                loopcallback(framecache);
            }

            //prevent over timeframe
            if((t + framerate) > timeframe) {t = timeframe--;}
        }
    };

    //G3 world import
    this.importWorld = function(world) {
        if(!(world instanceof G3.World)) {
            throw new Error("World sent not instance of G3.World");
        }

        this.renderer = world.getRenderer();
        this.scene = world.getScene();
        this.camera = world.getCamera();
    };

    //Set three.js or other renderer
    this.setRenderer = function(renderer) {
        this.renderer = renderer;
    };

    //Set width and size of renderer and frame
    this.setSize = function(width, height) {
        this.renderer.setSize(width, height);
    };

    //Set three.js scene of cutscene
    this.setScene = function(newscene) {
        this.scene = newscene;
    };

    //Set camera equal
    this.setCamera = function(newcamera) {
        this.camera = newcamera;
    };

    //Updater will apply function updater with delta time
    this.setUpdater = function(updater) {
        if(typeof(updater) !== "function") {
            throw new Error("Updater must be a function");
        }

        UPDATER = updater;
    };


};
