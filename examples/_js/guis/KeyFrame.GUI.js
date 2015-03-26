//KeyFrame GUI
//By Chuck
THREE.KeyFrame.GUI = function(KeyFrame) {

    //Privates
    var SCOPE = this;
    var KEYFRAME = KeyFrame;
    var GUI = new dat.GUI({ autoPlace: false });

    //Folders
    this.folders = {
        interpolation: GUI.addFolder("Interpolation"),
        easing: GUI.addFolder("Easing")
    };

    //Set easings
    this.easingsArray = [ ];
    this.easings = (function() {

        var easings = {};

        //Set easing selects
        Object.keys(THREE.TWEEN.Easing).forEach(function(family){
            Object.keys(THREE.TWEEN.Easing[family]).forEach(function(direction){
                var name = family+'.'+direction;
                easings[name] = THREE.TWEEN.Easing[family][direction];
                SCOPE.easingsArray.push(name);
            });
        });

        return easings;

    })();

    //Current Easing pattern
    this.easing = KEYFRAME.easing;


    //Interpolation tween globals
    this.interpolArray = [ ];
    this.interpolations = (function() {
        var inters = {};

        //Set easing selects
        Object.keys(THREE.TWEEN.Interpolation).forEach(function(interpol){

            inters[interpol] = THREE.TWEEN.Interpolation[interpol];
            SCOPE.interpolArray.push(interpol);

        });

        return inters;

    })();

    //Interpolation starting
    this.interpolation = THREE.TWEEN.Interpolation.Linear;

    //Initialize
    this.init();
};

//Set prototype of THREE.GUI
THREE.KeyFrame.GUI.prototype = Object.create(THREE.GUI);

//Initialization function
THREE.KeyFrame.GUI.prototype.init = function() {

    //Add to easing
    this.addToFolder("Easing", "easings", this.easingsArray);
    this.addToFolder("Interpolation", "interpolation", this.interpolArray)

    //Add to intepolation
};
