//Easy THREE.js XMLHTTPRequest loader
//By Chuck
THREE.LoaderHelper = function() {

    var SCOPE = this;
    var LOADERS = {
        awd: THREE.AWDLoader,
        babylon: THREE.BabylonLoader,
        binary: THREE.BinaryLoader,
        collada: THREE.ColladaLoader,
        ctm: THREE.CTMLoader,
        dds: THREE.DDSLoader,
        js: THREE.JSONLoader,
        obj: THREE.OBJLoader,
        pdb: THREE.PDBLoader,
        ply: THREE.PLYLoader,
        scene: THREE.SceneLoader,
        svg: THREE.SVGLoader,
        utf: THREE.UTF8Loader,
        vrml: THREE.VRMLLoader,
        vtk: THREE.VTKLoader,


    };

    //Fixes
    LOADERS.dae = LOADERS.collada,
    LOADERS.json = LOADERS.js


    /********************Game Loader API********************/

    //Load from file type
    this.loadType = function(type, url, callback) {
        SCOPE.checkType(type);

        //Load from desired type
        var loader = new LOADERS[type]();
        laoder.load(url, callback);
    };

    //Load file by extension name
    this.universalLoad = function(url, callback) {
        //Get extension
        var extension = url.split('.').pop().toLowerCase();

        //Json fix
        if(extension === "json") {extension = "js";}

        //Check valid type
        SCOPE.checkType(extension);

        //Load from extension type
        var loader = new LOADERS[extension]();
        loader.load(url, callback);
    };

    //Check if valid extension type
    this.checkType = function(extension) {
        if(!LOADERS[extension]) {
            throw new Error("File type not support : " + extension);
        }
    }
};
