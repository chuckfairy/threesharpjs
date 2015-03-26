//Webcam api functions
//By Chuck
THREE.WebCamera = function() {

};

THREE.WebCamera.prototype = {

    constructor: THREE.WebCamera,

    live: false,

    exportTypes: [
        "webp", "png", "jpg"
    ],

    request: function(success, error) {

    },


    //Return data url

    getDataUrl: function(type) {

        if(!this.live) {

            throw new Error("Webcam not available");

        }

    }


};
