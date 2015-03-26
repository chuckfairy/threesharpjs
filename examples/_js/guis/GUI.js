//DAT GUI function prototype
//By Chuck
THREE.GUI = {

    folders: {},

    GUI: new dat.GUI( {autoPlace: false} ),

    createFolder: function(name) {
        this.folders[name] = this.GUI.addFolder(name)
    },

    //Add a value
    addToFolder: function(foldername, keyname, value1, value2) {

        //Create new folder if it doesn't exist
        if(!this.folders[foldername]) {
            this.createFolder(foldername);
        }

        //Add folder controller
        var folder = this.folders[foldername];

        if(!this[keyname]) {
            this[keyname] = value1;
        }

        folder.add(this, keyname, value1, value2);
    },

    add: function(keyname, value1, value2) {

        if(!this[keyname]) {
            this[keyname] = value1;
        }

        this.GUI.add(this, keyname, value1, value2);
    },

    //Append GUI to DOM element by id
    appendToElement: function(elementId) {

        //Get DOM eleemnt
        var del = document.getElementById(elementId);

        if(!del) {
            throw new Error("Element with id not found: " + del);
        }

        //Append GUI
        del.appendChild(this.GUI.domElement);

    }

};
