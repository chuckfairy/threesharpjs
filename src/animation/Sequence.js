//Sequence editor for three object3d elements
//By Chuck
THREE.Sequence = function(object, params) {

    //Privates
    var SCOPE = this;
    var KEYFRAMES = {};
    var TWEEN = new THREE.TWEEN.Tween();

    //Public
    params = params || {};
    this.fps = params.fps || 60;
    this.speed = 1000 / this.fps;
    this.timeframe = params.timeframe || 9000;
    this.elapsed = 0;
    this.percentage = 0;
    this.live = true;


    //Set a key frame action
    this.setKeyFrame = function(keyframename, start, options) {
        if(start < 0 || start > SCOPE.timeframe) {
            throw new Error("Start not in range 0 - " + SCOPE.timeframe);
        }

        if(Math.abs(start) > SCOPE.timeframe || start > end) {
            throw new Error("End time not in range or start higher then end time");
        }

        //Check keyframes object
        if(KEYFRAMES[keyframename]) {throw new Error("Key frame name already taken");}

        options.name = keyframename;
        options.delay = start;
        var keyframe = new THREE.KeyFrame(options);

        //Set keyframe value
        return KEYFRAMES[keyframename] = keyframe;
    };

    //Add a keyframe event
    this.addKeyFrame = function(keyframe, start) {

        //Type check require THREE.Keyframe
        if( !(keyframe instanceof THREE.KeyFrame) ) {
            throw new Error("Keyframe is not a THREE.Keyframe");
        }

        //Check if keyframe taken
        if(KEYFRAMES[keyframe.name]) {
            throw new Error("KeyFrame name " + keyframe.name + " already taken");
        }

        //Set keyframe and listeners
        keyframe.updateListener = function(eventData) {
            keyframe.update(eventData.delta);
        };

        SCOPE.on("update-sequence", function(eventData) {
            keyframe.update(eventData.delta);
        });

        KEYFRAMES[keyframe.name] = keyframe;
    };

    //Get a keyframe by name
    this.getKeyFrame = function(name) {
        var keyframe = KEYFRAMES[name];

        if(!keyframe) {
            throw new Error("KeyFrame " + name + " not found");
        }

        return keyframe;
    };

    //Reset object back to start
    this.reset = function() {
        this.live = true;
        this.elapsed = 0;
    };

    //Update all tweens
    this.update = function(delta) {

        if(!this.live) {return;}

        //Update tween object
        this.elapsed += delta - 0;
        this.percentage = (this.elapsed / this.timeframe).toFixed(2);

        //send event Data
        var eventData = this.eventDefault("update-sequence");
        eventData.delta = delta;
        this.dispatch(eventData);

        //set to stop
        if(this.elapsed > this.timeframe) { this.end(); }

    };

};

THREE.Sequence.prototype = Object.create(THREE.Event.prototype);

THREE.Sequence.prototype.end = THREE.KeyFrame.prototype.end;

//Sequence event default
THREE.Sequence.prototype.eventDefault = function(type) {

    return {

        type: type,

        time: Date.now(),
        elapsed: this.elapsed,
        percentage: this.percentage

    };

}
