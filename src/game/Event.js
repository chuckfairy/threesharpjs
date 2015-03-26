//THREE event prototype
//By Chuck
THREE.Event = function() {};

THREE.Event.prototype = {

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
