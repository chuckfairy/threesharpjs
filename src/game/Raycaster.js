//Raycaster functions using THREE.Raycaster
//By Chuck
THREE.RaycasteringHelper = function() {
    //Public API
    this.hasCollisions = function(objects, destinationVector) {
        //loop thru each verticies of bounding box in new position
        BOUNDER.position.copy(destinationVector);
        BOUNDER.position.y += radius-20;

        for (var vertexIndex = 0; vertexIndex < boundingSphere.geometry.vertices.length; vertexIndex++) {
            var localVertex = boundingSphere.geometry.vertices[vertexIndex].clone();

            //Check if body and not just feet are touching
            if(localVertex.y < (boundingSphere.position.y-radius+20)) {continue;}

            var globalVertex = localVertex.applyMatrix4(boundingSphere.matrix);
            var directionVector = globalVertex.sub(boundingSphere.position);

            var ray = new THREE.Raycaster( destinationVector, directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects(objects);
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
                //console.log(collisionResults);
                return true;
            }
        }

        //No collisions found
        return false;
    };

    //Check one point collides
    this.pointCollides = function(pointVector) {
        pointVector.y += radius-20;
        raycaster.ray.origin.copy(pointVector);
        boundingSphere.position.copy(pointVector);

        var collisionResults = raycaster.intersectObjects(objects);
        if(collisionResults.length > 0 && collisionResults[0].distance < radius) {
            console.log("Its a hit", collisionResults);
            return true;
        }
        return false;
    };
}
