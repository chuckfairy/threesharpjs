//THREE Keyframe object for timed
//By Chuck
THREE.KeyFrame = function(options) {

    //options init
    options = options || {};

    //Publics
    this.name = options.name || "";
    this.timeframe = options.timeframe || 2000;
    this.fps = options.fps || 60;
    this.elapsed = 0;
    this.percentage = 0;

    //Keyframe data start to end and tween
    this.current = options.start || {};
    this.startValue = this.current;
    this.endValue = options.end || {};
    this.live = true;

    this.easing = options.easing || THREE.TWEEN.Easing.Linear.None;

    //Options
    this.repeat = options.repeat || false;

    //Start data by default
    this.init();
    this.start();
};

//Prototye of event dispatcher
THREE.KeyFrame.prototype = Object.create(THREE.Event.prototype);

//Initialize tween
THREE.KeyFrame.prototype.init = function() {
    //Tween functions
    this.tween = new THREE.TWEEN.Tween(this.current)
        .to(this.endValue, this.timeframe);

    this.tween.easing(this.easing);
};

//Start and make live tweening
THREE.KeyFrame.prototype.start = function() {

    this.reset();
    this.live = true;

    var eventData = this.eventDefault("start")
    this.dispatch(eventData);
};

//Reset to starting values
THREE.KeyFrame.prototype.reset = function() {

    //Changed elapsed
    this.elapsed = 0;
    this.current = this.startValue;
    this.tween.update(0);
    this.dispatch(this.eventDefault("reset"));

};

//On time lapse over end program
THREE.KeyFrame.prototype.end = function() {

    //Set to final value and trigger event
    this.live = false;
    //this.current = this.endValue;
    var eventData = this.eventDefault("end");
    this.dispatch(eventData);

};

//Update key frame
THREE.KeyFrame.prototype.update = function(time) {

    if(!this.live) {return;}

    //Update tween object
    var elapsed = this.elapsed += time - 0;
    this.percentage = (elapsed / this.timeframe).toFixed(2);
    this.tween.update(elapsed);

    //default
    var eventData = this.eventDefault("update");
    this.dispatch(eventData);

    //set to stop
    if(elapsed > this.timeframe) {
        this.end();
        return;
    }

};

//Event defaults given from times
THREE.KeyFrame.prototype.eventDefault = function(type) {

    return {

        type: type,

        elapsed: this.elapsed,
        percentage: this.percentage,
        value: this.current

    };

};

//Clone object
THREE.KeyFrame.prototype.clone = function() {

    return new THREE.KeyFrame({
        name: this.name,
        start: this.startValue,
        end: this.endValue,
        timeframe: this.timeframe,
        easing: this.easing,
        fps: this.fps
    });

};

THREE.KeyFrame.prototype.cloneObj = function(object) {
    return JSON.parse(JSON.stringify(object));
};

//Export to JSON
THREE.KeyFrame.prototype.export = function() {

};

//Inverse keyframe properties
THREE.KeyFrame.prototype.inverse = function() {

    //reset tween
    this.reset();
    var clone = this.clone();
    this.startValue = clone.endValue;
    this.endValue = clone.startValue;
    this.current = clone.endValue;
    this.init();

};
