//Events object for various actions
//By Chuck
THREE.Events = {};

//Cross Browser add event listener
THREE.Events.addEvent = function(evnt, elem, func, bubble) {
    if (elem.addEventListener) {
        elem.addEventListener(evnt,func, bubble);
    } else if (elem.attachEvent) {
        elem.attachEvent("on"+evnt, func);
    }
    else { elem[evnt] = func;}
};

//Setup mouse leaving event
THREE.Events.DetectMouseGone = function(callback) {
    document.addEventListener("mouseout", function(e) {
        e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == "HTML") {
            // stop your drag event here
            // for now we can just use an alert
            callback();
        }
    });
};
