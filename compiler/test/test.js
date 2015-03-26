//Compiler test
//By Chuck

var COMPILER = require("./compiler.js");
var FS = require("fs");

COMPILER.jsCompress("var asdffsadfa = 'asdfas asdfasd'    ;    ",  function(compressed) {
    FS.writeFile("check.txt", compressed, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
});
