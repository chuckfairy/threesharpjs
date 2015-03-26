/***************Dude mesh loader and animator***************/
THREE.Model = function() {

    this.animations = {};
    this.weightSchedule = [];
    this.warpSchedule = [];

    this.load = function (url, onLoad) {

        var scope = this;

        var loader = new THREE.JSONLoader();
        loader.load( url, function( geometry, materials ) {

            var phongMaterial = new THREE.MeshPhongMaterial();

            THREE.SkinnedMesh.call( scope, geometry, phongMaterial);
            scope.castShadow = true;
            //enableSkinning(scope);
            scope.visible = true;

            // Create and get the animations
            for ( var i = 0; i < geometry.animations.length; ++i ) {
                var animName = geometry.animations[ i ].name;
                geometry.animations[ i ].weight = 1;
                scope.animations[ animName ] = new THREE.Animation( scope, geometry.animations[ i ] );
            }

            // Create the debug visualization
            scope.skeletonHelper = new THREE.SkeletonHelper( scope );
            scope.skeletonHelper.material.linewidth = 3;
            scope.add( scope.skeletonHelper );
            scope.showSkeleton( true ); //Debug

            // Loading is complete, fire the callback
            if ( onLoad !== undefined ) {onLoad();}
        });
    };

    //Update mesh
    this.update = function( dt ) {
        //Future morph stuff
        if(this.skeletonHelper){this.skeletonHelper.update();}
    };

    //Play Animation based on weight
    this.play = function(animName, weight) {
        this.animations[animName].play(0, weight);
    };

    this.morphTo = function(animName) {
        this.stopAll();
        if(this.animations[ animName ]) {
            this.animations[ animName ].play(0, 1);
        }
    };

    this.applyWeight = function(animName, weight) {
        this.animations[ animName ].weight = weight;
    };

    //Stop all animations
    this.stopAll = function() {
        for ( a in this.animations ) {
            if ( this.animations[ a ].isPlaying ) {
                this.animations[ a ].stop(0);
            }

            this.animations[ a ].weight = 0;
        }

        this.weightSchedule.length = 0;
        this.warpSchedule.length = 0;
    };

    this.showSkeleton = function(boolean) {
        this.skeletonHelper.visible = boolean;
    };
};

THREE.Model.prototype = Object.create(THREE.SkinnedMesh.prototype);
