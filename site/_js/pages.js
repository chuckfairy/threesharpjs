//Main page navigation
//By Chuck

//Setup sidebar
var sidebar = document.getElementById("navigator");
sidebar.onView;
sidebar.onHide;

sidebar.toggle = function() {
    if(sidebar.className === "navigatorOff") {
        sidebar.className = "navigatorOn";
        if(sidebar.onView) {sidebar.onView();}
    } else {
        sidebar.className = "navigatorOff";
        if(sidebar.onHide) {sidebar.onHide();}
    }
}

sidebar.toggle();

var navigatorbutton = document.getElementById("navigatorbutton");

//Setup navigation toggler
navigatorbutton.onclick = function() {sidebar.toggle();};
