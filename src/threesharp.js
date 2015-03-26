/*
 ______  ______  __    __  ______       ______ __  __  ______  ______  ______
/\  ___\/\  __ \/\ "-./  \/\  ___\     /\__  _/\ \_\ \/\  == \/\  ___\/\  ___\
\ \ \__ \ \  __ \ \ \-./\ \ \  __\     \/_/\ \\ \  __ \ \  __<\ \  __\\ \  __\
 \ \_____\ \_\ \_\ \_\ \ \_\ \_____\      \ \_\\ \_\ \_\ \_\ \_\ \_____\ \_____\
  \/_____/\/_/\/_/\/_/  \/_/\/_____/       \/_/ \/_/\/_/\/_/ /_/\/_____/\/_____/

Game Three (THREE) three.js + cannon.js game development suite

By Chuck
*/

//Renderers for THREE.js
THREE.RenderTypes = {
    canvas: {
        renderer: "CanvasRenderer"
    },

    CSS3D: {
        renderer: "CSS3DRenderer"
    },

    raytrace: {
        renderer: "RaytracingRenderer"
    },

    webgl: {
        renderer: "WebGLRenderer",
        defaults: {
            antialias: true,
            alpha: false, devicePixelRation: window.devicePixelRatio || 1
        }
    },

    webgldeferred: {
        renderer: "WebGLDeferredRenderer",
        defaults: {
            antialias: true,
            tonemapping: THREE.FilmicOperator,
            brightness: 1
        }
    }
};

//Light types
THREE.LightTypes = {
    ambient: THREE.AmbientLight,
    directional: THREE.DirectionalLight,
    hemisphere: THREE.HemisphereLight,
    point: THREE.PointLight,
    spot: THREE.SpotLight
};

//3D Material types
THREE.MaterialTypes = {
    lambert: "MeshLambertMaterial",
    phong: "MeshPhongMaterial",
    normal: "MeshNormalMaterial"
};

//Node.js and browersify check
if(typeof module !== 'undefined' && module.exports) {
    THREE.CANNON = CANNON;
    module.exports = THREE;
}
