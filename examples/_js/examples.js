//DOM + variables

var doc = document;
var asidebar = sidebar.getElementsByTagName("a");

var examplePreButton = doc.getElementById("examplePre");
var exampleNextButton = doc.getElementById("exampleNext");

var g3Wrap = doc.getElementById("g3Wrap");
g3Wrap.style.paddingLeft = "0";

var exampleIframe = doc.getElementById("webglIframe");
var webglCurrentPage = doc.getElementById("webglCurrentPage");

var current_page;
var current_page_url;
var current_page_number;

/********************Sidebar and navigation********************/
sidebar.addEventListener("click", function(e) {
    var tar = e.target;
    if(tar.tagName === "A" && tar.getAttribute("data")) {
        if(tar.getAttribute("data") === null) {return;}
        navigateTarget(tar);
    }

    else if(tar.tagName === "h2") {
        sidebar.collapseSet(tar);
    }
});

sidebar.onView = function() {
    g3Wrap.style.paddingLeft = null;
};

sidebar.onHide = function() {
    g3Wrap.style.paddingLeft = "0";
};

function navigateTarget(target) {
    var directory = target.parentNode.getAttribute("data");
    var filename = target.getAttribute("data");
    var filepath = directory + "/" + filename + ".html"

    exampleIframe.src = filepath;
    if(current_page) {current_page.className = "";}
    current_page_url = filepath;
    current_page = target;
    current_page.className = "selected";

    window.location.hash = "/" + filepath;

    setTimeout(function() {
        webglCurrentPage.innerHTML = filepath;
    }, 150);

};

sidebar.collapseSet = function(element) {

};

//Get starting hash an load that example
init_sidebar();
function init_sidebar() {
    if(window.location.hash) {
        var hasher = window.location.hash.split("/")[2].split(".")[0];
        for(var i = 0; i < asidebar.length; i++) {
            var aTarget = asidebar[i];
            if(aTarget.getAttribute("data") === hasher) {
                navigateTarget(aTarget);
                return;
            }
        }
    } else {
        sidebar.toggle();
    }
}


/********************Example tools and viewer********************/

//webgl tools view page and source
var webglTools = doc.getElementById("webglTools");
function webglToolAction(e) {
    var thisTarget = e.target;
    if(thisTarget.hasAttribute("data")) {
        var action = thisTarget.getAttribute("data");
        var url = location.origin + location.pathname + current_page_url;
        if(action === "view-source") {
            url = "view-source:" + url;
        }

        window.open(url , '_blank');
    }
}

webglTools.addEventListener("click", webglToolAction, false);

//Example changer
function exampleToggle(boolean) {
    if(boolean) {
        navigateTarget(current_page.nextSibling);
    } else {
        navigateTarget(current_page.previousSibling);
    }
}

examplePreButton.onclick = function() {exampleToggle(0)};
exampleNextButton.onclick = function() {exampleToggle(1)};
