/*
/$$$$$$$$ /$$   /$$ /$$$$$$$  /$$$$$$$$ /$$$$$$$$ /$$ /$$
|__ $$__/| $$  | $$| $$__  $$| $$_____/| $$_____// $$/ $$
  | $$   | $$  | $$| $$  \ $$| $$      | $$     /$$$$$$$$$$
  | $$   | $$$$$$$$| $$$$$$$/| $$$$$   | $$$$$ |   $$  $$_/
  | $$   | $$__  $$| $$__  $$| $$__/   | $$__/  /$$$$$$$$$$
  | $$   | $$  | $$| $$  \ $$| $$      | $$    |_  $$  $$_/
  | $$   | $$  | $$| $$  | $$| $$$$$$$$| $$$$$$$$| $$| $$
  |__/   |__/  |__/|__/  |__/|________/|________/|__/|__/
Three#js | three.js + cannon.js game development suite

By Chuck
*/

THREE.SHARP = { revision: 1 };

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

	svg: {
		renderer: "SVGRenderer"
	},

    webgl: {
        renderer: "WebGLRenderer",
        defaults: {
            antialias: false,
            alpha: false, 
			devicePixelRation: window.devicePixelRatio || 1
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
