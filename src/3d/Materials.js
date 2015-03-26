//THREE.js materials
//By Chuck
THREE.Materials = new function() {
    var SCOPE = this;
    var M = {
        "greylambert" : new THREE.MeshLambertMaterial({
            ambient: 0x000000, color: 0x828282, shading: THREE.FlatShading
        }),

        "greytest": new THREE.MeshPhongMaterial({
            ambient: 0x000000, color: 0x828282, specular: 0xffffff, shininess: 10,
            shading: THREE.SmoothShading, reflectivity: 0,
            side: THREE.DoubleSide, castShadow: true, recieveShadow: true
        }),

        "greyphong": new THREE.MeshPhongMaterial({
            ambient: 0x000000, color: 0xdddddd, specular: 0xffffff, shininess: 10,
            shading: THREE.SmoothShading, reflectivity: 0, skinning:true,
            side: THREE.DoubleSide, castShadow:true, recieveShadow: true
        }),

        "redwire": new THREE.MeshLambertMaterial({color: 0xff0000, wireframe:true})

    };

    SCOPE.get = function(materialname) {
        if(!M[materialname]) {throw new Error("Material name not found " + materialname);}
        return M[materialname];
    };
};
