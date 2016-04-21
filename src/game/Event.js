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


    //Remove listener

    removeListener: function( type, listener ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	},


    //Dispatch function
    dispatch: function(eventData) {

        this.dispatchEvent(eventData);

    }

};

THREE.EventDispatcher.prototype.apply(THREE.Event.prototype);
