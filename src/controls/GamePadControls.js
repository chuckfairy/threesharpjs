//Gamepad html5 API functions
//By Chuck
THREE.GamePadControls = function() {

};

THREE.GamePadControls.prototype = Object.create(THREE.Event);

THREE.GamePadControls.prototype.request = function() {};

//Uses xbox layout as default
THREE.GamePadControls.prototype.buttons = {

    xbox: {

        stickL: 5, stickR: 6,

        dDown: 10, dLeft: 11, dUp: 12, dRight: 13,

        //Right buttons
        a: 20, x: 21, y: 22, b: 23,

        lT: 24, lB: 25, rT: 26, rB: 27

    },

    playstation: { },

    gamecube: { },

    other: { }

};
