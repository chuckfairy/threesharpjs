//Keyboard event control module
//By Chuck
THREE.TouchControls = function(options, domElement) {

    var scope = this;

    options = options || {};


    /***************Properties API***************/

    //Dom Element
    this.domElement = domElement || document;

    //Controls live
    this.live = false;

    //Key sequence time in miliseconds
    this.touchSequenceDuration = options.touchSequenceDuration || 500;

    //Mouse xy coordinates
    this.pointerXY = new THREE.Vector2();

    //Mouse touch start position
    this.touchStartPosition = new THREE.Vector2();

    //Last movement speed
    this.lastMovement = new THREE.Vector2();

    //Movement threshold
    this.swipeSpeed = (options.swipeSpeed) ?
        (options.swipeSpeed - 0.0) : 0.5;

    //Swipe speed time for touch end
    this.swipeSpeedTime = (options.swipeSpeedTime) ?
        (options.swipeSpeedTime - 0.0) : 100;

    this.lastTouchTime = 0;

    //Number of currently touch fingers
    this.touchNumber = 0;

    //All events
    this.eventNames = [
        "touchstart", "touchend", "touchmove", "swipe"
    ];

    //Has touch controls
    this.hasTouch = ('ontouchstart' in window) ||
        window.DocumentTouch && document instanceof DocumentTouch;


    /***************Public API***************/

    //start controls and add listeners
    this.start = function() {

        if( scope.live ) {return;}
        if( !scope.hasTouch ) { return; }

        scope.domElement.addEventListener("touchstart", touchstart, false);
        scope.domElement.addEventListener("touchend", touchend, false);
        scope.domElement.addEventListener("touchmove", touchmove, false);

        scope.live = true;

    };

    //Stop controls and remove listeners
    this.stop = function() {

        if( !scope.live ) {return;}

        scope.domElement.removeEventListener("touchstart", touchstart, false);
        scope.domElement.removeEventListener("touchend", touchend, false);
        scope.domElement.removeEventListener("touchmove", touchmove, false);

        scope.live = false;

    };


    //Set dispatcher events

    this.setEvents = function(events) {

        for( var eventName in events) {

            scope.on(eventName, events[eventName]);

        }

    };


    //Get pointerXY from a mouse event

    this.updatePointerXY = function(event) {

        var touch = event.touches[0];

        scope.pointerXY.x = ( touch.pageX / window.innerWidth ) * 2 - 1;
        scope.pointerXY.y = - ( touch.pageY / window.innerHeight ) * 2 + 1;

    };


    /***************Private Keyboard Properties***************/




    /***************Keyboard event dispatching***************/

    //Keyboard key down

    var touchstart = function(event) {

        event.preventDefault();

        scope.touchNumber = event.touches.length;
        scope.updatePointerXY(event);
        scope.touchStartPosition.copy(scope.pointerXY);
        scope.lastTouchTime = Date.now();

        scope.dispatch({
            type: "touchstart",
            coords: scope.pointerXY
        });

    };


    //touch end up for master

    var touchend = function(event) {

        event.preventDefault();

        scope.touchNumber = event.touches.length;

        scope.dispatch({
            type: "touchend"
        });

        //Check if swipe
        swipe(event);

        scope.lastTouchTime = 0;

    };


    //Keyboard mouse moving

    var touchmove = function(event) {

        event.preventDefault();

        var movement = new THREE.Vector2();
        movement.copy(scope.pointerXY)

        scope.updatePointerXY(event);

        movement.x -= scope.pointerXY.x;
        movement.y -= scope.pointerXY.y;

        scope.lastTouchTime = Date.now();

        scope.dispatch({
            type: "touchmove",
            coords: scope.pointerXY,
            movement: movement
        });

        scope.lastMovement.copy(movement);

    };


    //Detect swipe function

    var swipe = function( event ) {

        //Detect movement direction

        var direction;

        var movement = scope.lastMovement.sub(scope.touchStartPosition);
        var speed = Math.max(movement.x, movement.y);
        var lastTime = Date.now() - scope.lastTouchTime;

        //Check swipe speed greater then threshold
        if( !( speed > scope.swipeSpeed ) ) {
            return;
        }

        //Check if swipe time is over threshold
        if( Date.now() - scope.lastTouchTime > scope.swipeSpeedTime ) {
            return;
        }

        //Determine direction
        if( movement.x > movement.y ) {

            direction = (movement.x < 0) ? "left" : "right";

        } else {

            direction = (movement.y > 0) ? "up" : "down";

        }

        if( direction ) {

            scope.dispatch({
                type: "swipe",
                direction: direction,
                movement: movement,
                speed: speed
            });

            scope.dispatch({
                type: ("swipe " + direction),
                movement: movement,
                speed: speed
            });

        }

    };


    //Launch by default
    if(options.events) { this.setEvents(options.events); }

    scope.start();

};

THREE.TouchControls.prototype = Object.create(THREE.Event.prototype);

THREE.TouchControls.prototype.constructor = THREE.TouchControls;
