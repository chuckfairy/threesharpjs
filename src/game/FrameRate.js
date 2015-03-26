//Framerate worker
//By Chuck
THREE.FrameRate = function(options) {

    //Publics
    options = options || {};

    this.timeframe = (options.timeframe - 0) || 2000;
    this.fps = (options.fps - 0) || 60;
    this.stepRate = (1 / this.fps);
    this.currentStep = 0;

    this.elapsed = 0;
    this.percentage = 0;

    this.loopTimeFrame = function() {

    };

    //Step through framerate
    this.update = function(delta) {
        this.elapsed += delta;
        this.percentage = this.elapsed / this.timeframe;
        this.currentStep = delta;

        this.dispatch(this.eventDefault("update"));
    };

    //Return event data type
    this.eventDefault = function(type) {

        return {
            type: type,
            elapsed: this.elapsed,
            percentage: this.percentage,
            delta: this.currentStep
        };

    }
};

//Prototye of event dispatcher
THREE.FrameRate.prototype = Object.create(THREE.Event.prototype);
