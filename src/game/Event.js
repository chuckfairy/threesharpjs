//THREE event prototype
//By Chuck
THREE.Event = function() {};

THREE.Event.prototype = {

    apply: function( object ) {

        THREE.EventDispatcher.prototype.apply( object );

        object.on = THREE.Event.prototype.on;
        object.dispatch = THREE.Event.prototype.dispatch;

    },

    //Set event listener
    on: function(eventName, callback) {

        this.addEventListener(eventName, callback);

    },

    //Dispatch function
    dispatch: function(eventData) {

        this.dispatchEvent(eventData);

    }

};

THREE.EventDispatcher.prototype.apply(THREE.Event.prototype);
