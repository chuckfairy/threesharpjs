//Simple fixes for using THREE.Vector3 instead of CANNON.Vec3
//By Chuck

//Zero point functions
THREE.Vector3.ZERO = new THREE.Vector3(0,0,0);
THREE.Vector3.prototype.setZero = function() {
    this.x = this.y = this.z = 0;
};

//Name changes
THREE.Vector3.prototype.norm = THREE.Vector3.prototype.length;
THREE.Vector3.prototype.vadd = THREE.Vector3.prototype.add;
THREE.Vector3.prototype.vsub = THREE.Vector3.prototype.sub;
THREE.Vector3.prototype.mult = THREE.Vector3.prototype.multiply;

//Not sure when this is used tbh. Taken from CANNON.Vec3 source
THREE.Vector3.prototype.unit = function(target){
    target = target || new THREE.Vector3();
    var ninv = this.length();
    if(ninv > 0.0){
        ninv = 1.0/ninv;
        target.x = x * ninv;
        target.y = y * ninv;
        target.z = z * ninv;
    } else {
        target.x = 1;
        target.y = 0;
        target.z = 0;
    }
    return target;
};

//returns true if at 0,0,0
THREE.Vector3.prototype.isZero = function() {
    return this.x===0 && this.y===0 && this.z===0;
};
