//Multi Compiler
//All public functions will need a callback
//By Chuck
module.exports = new function() {
    //Local object
    var SCOPE = this;

    //Built ins
    var FS = require("fs");
    var PATH = require("path");

    //File ignore DS_Store
    var IGNORE = /^\.DS_Store$/;

    //get fs module
    this.getFS = function() {return FS;}


    /********************File helper functions********************/

    //Check if file
    this.isFile = function(path) {
        return FS.existsSync(path);
    };

    //Check if directory
    this.isDir = function(path) {
        return SCOPE.getFileStats(path).isDirectory();
    };

    //Get node file stat object uses
    //isFile() isDirectory()
    this.getFileStats = function(path) {
        return FS.lstatSync(path);
    };

    //Get array of folders in a given directory
    this.getFolderFiles = function(dir) {
        return FS.readdirSync(dir);
    };

    //read contents of file return string
    this.getFileContents = function(path) {
        var data = FS.readFileSync(path);
        if(!data) {data = " ";}
        else {data = data.toString();}
        return data;
    };


    /********************Compile functions********************/

    //Load a config from json data
    this.compileFromConfigFile = function(configFile, callback) {

        //Check for file
        if(!SCOPE.isFile(configFile)) {throw new Error("Config file not found " + configFile);}

        //Config Data
        var rawConfig = FS.readFileSync(configFile).toString();
        var configData = JSON.parse(rawConfig);
        var folderName = PATH.dirname(configFile);

        //Check if config set a type
        if(!configData.type) {throw new Error("No Type created in compile");}

        //Use desired compiled
        //javascript
        if(configData.type === "js" ||
            configData.type === "javascript"
        ) {
            SCOPE.folderCompile(folderName, configData, function(precompile) {
                SCOPE.jsCompress(precompile, function(compile) {
                    //Send compiled js to callback
                    callback(compile);
                });
            });
        }

        //Use node-webkit
        else if(configData.type === "node-webkit") {
            SCOPE.nodeWebkitCompile(folderName, callback);
        }

        //Use atom shell
        else if(configData.type === "atom-shell") {
            SCOPE.atomShellCompile(configData, callback);
        }

        //Config type not valid
        else {
            throw new Error("Config type not found, valid = [js, css, node-webkit, atom-shell]");
        }
    };

    //Extract a path or folder
    this.extractPathData = function(path) {

    };

    //Watch for file changes on
    this.watchCompile = function(compileConfig, callback) {
        var COMPILE = function() {
            SCOPE.compileFromConfigFile(compileConfig, callback);
        };

        //Setup change event
        var isChanging = false;
        var CHANGE = function() {
            if(isChanging) {return;}
            isChanging = true;
            COMPILE();
            isChanging = false;
        };

        var WATCH = require("watch");
        var folderName = PATH.dirname(compileConfig);
        WATCH.createMonitor(folderName, function (monitor) {

            //Compile on created changed and removed
            monitor.on("created", CHANGE);
            monitor.on("changed", CHANGE);
            monitor.on("removed", CHANGE);
        });
    };

    //Compile thru folders and files
    this.folderCompile = function(folderName, configObject, callback) {

        var cl = configObject.compile.length;
        var compileString;
        for(var i = 0; i < cl; i++) {
            var filePath = folderName + "/" + configObject.compile[i];

            //Get stats object
            var fileStats = SCOPE.getFileStats(filePath);

            //Check file or folder
            var fileData = "";
            if(fileStats.isFile()) {
                console.log("\n> Getting data from " + filePath);
                fileData = SCOPE.getFileContents(filePath);
            } else if(fileStats.isDirectory()) {
                console.log("\n> Getting data from folder " + filePath);
                var folderFiles = SCOPE.getFolderFiles(filePath);
                var fl = folderFiles.length;
                for(var t = 0; t < fl; t++) {
                    //get filename and check ignore
                    var fileName = filePath + folderFiles[t];

                    //Global Ignore regex
                    if(IGNORE.test(folderFiles[t])) {continue;}

                    console.log("> > " + fileName);
                    fileData += SCOPE.getFileContents(fileName);
                }
            } else {
                continue;
            }

            //Append to compile string
            if(fileData) {
                compileString += fileData;
            } else {
                console.log("No data found for " + filePath);
            }
        }

        callback(compileString);
    };


    /********************Compressers and compilers********************/

    //Minify file
    this.minifyFile = function(filename, callback) {
        var MINIFY = require("minify");
        MINIFY(filename, callback);
    }

    //Minify and compress data
    this.minifyCompress = function(compileData, extension, callback) {
        var MINIFY = require("minify");

        //Use minify functions
        MINIFY({
            ext: extension,
            data: compileData
        },

        //Minify callback
        function(error, data) {
            if(!data) {
                console.log("ERROR: Failed to compile");
                data = compileData;
            }

            callback(data, error);
        });
    };

    //Compress using minify
    this.jsCompress = function(javascript, callback) {
        console.log("\nCompressing javascript");

        //SCOPE.yuiCompress(javascript, {type: "js"}, callback);
        SCOPE.minifyCompress(javascript, ".js", callback);
    };

    //Compress css with YUI
    this.cssCompress = function(cssData, callback) {
        console.log("\nCompressing CSS");
        SCOPE.minifyCompress(cssData, {ex: ".css"}, callback);
    };

    //Creating a Node Webkit app
    this.nodeWebkitCompile = function(folderName, callback) {
        //Chromium building and available platforms
        var NODEWEBKIT = require("node-webkit-builder");
        var PLATFORMS = ['osx32'];

        var ALLPLATFORMS = ['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64'];
        var nw = new NODEWEBKIT({
            files: (folderName + "/**/**"), // use the glob format
            platforms: PLATFORMS
        });

        //Log everything
        nw.on("log", console.log);

        //Build app
        nw.build();
    };

    //Atom shell compile to app
    this.atomShellCompile = function(configObject, calllback) {
        var ATOM = require("atom-shell");
    };
};
