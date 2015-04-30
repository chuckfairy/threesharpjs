//Keyboard event control module
//By Chuck
THREE.KeyboardControls = function(options, domElement) {

    var scope = this;

    options = options || {};


    /***************Properties API***************/

    //Dom Element
    this.domElement = domElement || document;

    //Controls live
    this.live = false;

    //Key sequence time in miliseconds
    this.keySequenceDuration = options.keySequenceDuration || 500;

    //Mouse xy coordinates
    this.pointerXY = new THREE.Vector2();

    //keyboard char codes to human language
    this.charCodes = {

        //Alphabet
        65: "a", 66: "b", 67: "c", 68: "d", 69: "e", 70: "f", 71: "g",
        72: "h", 73: "i", 74: "j", 75: "k", 76: "l", 77: "m", 78: "n",
        79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 85: "u",
        86: "v", 87: "w", 88: "x", 89: "y", 90: "z",

        //Directionals
        38: "up", 37: "left", 40: "down", 39:"right",

        //Numbers
        48: "0", 49: "1", 50: "2", 51: "3", 52: "4",
        53: "5", 54: "6", 55: "7", 56: "8", 57: "9",

        //Action
        8: "backspace", 9: "tab", 13: "enter", 16: "shift",
        17: "ctrl", 18: "alt", 19: "pause", 20: "caps lock",
        32: "space", 46: "delete"

    };

    this.eventNames = [
        "keydown", "keyup", "click", "clickup",
        "mousemove"
    ];


    /***************Public API***************/

    //start controls and add listeners
    this.start = function() {

        if(scope.live) {return;}

        scope.domElement.addEventListener("keydown", keydown, false);
        scope.domElement.addEventListener("keyup", keyup, false);
        scope.domElement.addEventListener("mousedown", clickdown, false);
        scope.domElement.addEventListener("mouseup", clickup, false);
        scope.domElement.addEventListener("mousemove", mousemove, false);
        scope.domElement.addEventListener("scroll", scroll, false);

        scope.live = true;

    };

    //Stop controls and remove listeners
    this.stop = function() {

        if(!scope.live) {return;}

        scope.domElement.removeEventListener("keydown", keydown, false);
        scope.domElement.removeEventListener("keyup", keyup, false);
        scope.domElement.removeEventListener("mousedown", clickdown, false);
        scope.domElement.removeEventListener("mouseup", clickup, false);
        scope.domElement.removeEventListener("mousemove", mousemove, false);
        scope.domElement.removeEventListener("scroll", scroll, false);

        scope.live = false;

    };


    //Set dispatcher events

    this.setEvents = function(events) {

        for( var eventName in events) {

            scope.on(eventName, events[eventName]);

        }

    };


    //Turn charcode press down into readable event

    this.getCharName = function(event) {

        var keyCode = event.keyCode;
        return this.charCodes[keyCode] || false;

    };


    //Get pointerXY from a mouse event

    this.updatePointerXY = function(event) {

        scope.pointerXY.x = ( event.pageX / window.innerWidth ) * 2 - 1;
        scope.pointerXY.y = - ( event.pageY / window.innerHeight ) * 2 + 1;

    };


    //Check if key is held

    this.keyIsHeld = function(charName) {

        return HELDKEYS[charName] || false;

    };


    /***************Private Keyboard Properties***************/

    var CLICKHELD = false;

    var CONTEXTHELD = false;

    var HELDKEYS = {};


    /***************Keyboard event dispatching***************/

    //Keyboard key down

    var keydown = function(event) {

        event.preventDefault();

        var charName = scope.getCharName(event);

        HELDKEYS[charName] = true;

        scope.dispatch({
            type: "keydown",
            charName: charName
        });

        scope.dispatch({
            type: "keydown " + charName,
            charName: charName
        });

    };

    //Key up for master

    var keyup = function(event) {

        event.preventDefault();
        var charName = scope.getCharName(event);

        HELDKEYS[charName] = false;

        scope.dispatch({
            type: "keyup",
            charName: charName
        });

        scope.dispatch({
            type: "keyup " + charName,
            charName: charName
        });

    };


    //mouse click down

    var clickdown = function(event) {

        event.preventDefault();

        CLICKHELD = true;

        scope.dispatch({
            type: "click",
            coords: scope.pointerXY
        });

    };


    //Mouse click up

    var clickup = function(event) {

        event.preventDefault();

        CLICKHELD = false;

        scope.dispatch({
            type: "clickup",
            coords: scope.pointerXY
        });

    };


    //Keyboard mouse moving

    var mousemove = function(event) {

        event.preventDefault();

        var movement = new THREE.Vector2();
        movement.copy(scope.pointerXY)

        scope.updatePointerXY(event);

        scope.dispatch({
            type: "mousemove",
            coords: scope.pointerXY
        });


        //Check if it is a drag

        if ( CLICKHELD ) {

            movement.x -= scope.pointerXY.x;
            movement.y -= scope.pointerXY.y;

            scope.dispatch({
                type: "mousedrag",
                coords: scope.pointerXY,
                movement: movement
            });

        }

    };

    var scroll = function(event) {



    };

    //Launch by default
    if(options.events) {
        scope.setEvents(options.events);
    }

    scope.start();

};

THREE.KeyboardControls.prototype = Object.create(THREE.Event.prototype);

THREE.KeyboardControls.prototype.constructor = THREE.KeyboardControls;
