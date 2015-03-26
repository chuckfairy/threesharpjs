//Gamethree homescreen webgl
//By Chuck

var world, camera, textMesh, isMobile = true;

initHomeGL();
initHomeText();
function initHomeGL() {

    world = new G3.World();
    world.init("header", {renderType: "webgl"});
    world.setScreenSize("container");

    var renderer = world.getRenderer();

    camera = world.getCamera();
    camera.position.set(250, 11, 0);
    camera.lookAt(new THREE.Vector3(0,0,0));
    var controls = new G3.OrbitControls(camera, renderer.domElement);

    var checkerboard = THREE.ImageUtils.loadTexture( '../examples/_assets/textures/checkerboard.jpg' );
    checkerboard.wrapS = checkerboard.wrapT = THREE.RepeatWrapping;
    checkerboard.repeat.set(4, 4);
    checkerboard.anisotropy = 1;


    var planegeo = new THREE.PlaneBufferGeometry(600, 100, 5);
    var plane = new THREE.Mesh(planegeo,  new THREE.MeshPhongMaterial({
        color: 0xffffff, ambient: 0xffffff,
        map: checkerboard
    }));

    plane.rotation.x = -(Math.PI / 2);
    plane.receiveShadow = true;

    //Create light
    spotLight = new THREE.SpotLight(0xffffff, 1.9, 400, 400);
    spotLight.position.set(300, 100, 0);

    spotLight.castShadow = true;
    spotLight.shadowBias = .0001;
    spotLight.shadowCameraNear = 40;
    spotLight.shadowCameraFar = 350;
    spotLight.shadowCameraFov = 30;
    spotLight.shadowMapHeight = 4096; //2048
    spotLight.shadowMapWidth = 4096;
    spotLight.shadowDarkness = .7;
    //spotLight.shadowCameraVisible = true;



    //Add to world
    world.addMesh(plane);
    world.addLight(spotLight);
    //world.addLight(new THREE.AmbientLight(0xffffff));



}

function initHomeText() {

    var normalMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, shading: THREE.FlatShading});

    world.universalLoad("_assets/gamethree_text.json", function(geometry) {
        textMesh = new THREE.Mesh(geometry, normalMaterial);
        textMesh.geometry.computeVertexNormals();
        textMesh.scale.set(4,4,4);
        textMesh.rotation.y = (Math.PI / 2);
        textMesh.position.set(100, 0, 0);
        textMesh.castShadow = true;
        textMesh.receiveShadow = true;
        textMesh.rotation.y = 1;

        world.addMesh(textMesh);

        world.on("screen-resize", function(eventData) {

            var size = eventData.size;
            if(size.x < 800 && !isMobile) {
                textMesh.scale.set(6,6,6);
                isMobile = true;
            }

            else if(size.x > 800 && isMobile) {
                textMesh.scale.set(10, 10, 10);
                isMobile = false;
            }

        });

        world.on("before-render", function(eventData) {
            textMesh.rotation.y -= eventData.delta / 10;
        });

        //Fix text from screensize
        world.screenResize();
    });


    //Render loop
    world.LaunchWorld();
}
