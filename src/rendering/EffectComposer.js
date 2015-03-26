//@author alteredq / http://alteredqualia.com/
//and Chuck
THREE.EffectComposer = function(renderer, renderTarget) {

	this.renderer = renderer;

	if ( renderTarget === undefined ) {

		var width = window.innerWidth || 1;
		var height = window.innerHeight || 1;
		var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

		renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

	}

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	if ( THREE.CopyShader === undefined ) {
		throw new Error( "THREE.EffectComposer relies on THREE.CopyShader" );
	}

	this.copyPass = new THREE.ShaderPass( THREE.CopyShader );
};


THREE.EffectComposer.prototype = {

	//Swap read and write
	swapBuffers: function() {
		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;
	},

	//Add effect to renderer
	addEffect: function(effectName, uniformValues) {
		//Check if effect is in list
		if(!this.effects[effectName]) {
			console.log("Effect not found " + effectName);
			return;
		}

		//Get shader pass effect
		var effect = this.effects[effectName];

		//Set preferred
		for(uniformName in uniformValues) {
			effect.uniforms[uniformName].value = uniformValues[uniformName];
		}

		//Add pass to rendering passes
		this.addPass(effect);
	},

	addPass: function (pass) {
		this.passes.push(pass);
	},

	insertPass: function (pass, index) {
		this.passes.splice(index, 0, pass);
	},

	removePass: function(effectName) {

	},

	render: function (delta) {
		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for (i = 0; i < il; i ++) {

			pass = this.passes[ i ];

			if (!pass.enabled) {continue;}

			pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

			if (pass.needsSwap) {

				if (maskActive) {
					var context = this.renderer.context;
					context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );
					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );
					context.stencilFunc( context.EQUAL, 1, 0xffffffff );
				}

				this.swapBuffers();
			}

			if (pass instanceof THREE.MaskPass) {
				maskActive = true;
			}

			else if (pass instanceof THREE.ClearMaskPass) {
				maskActive = false;
			}
		}
	},

	//Reset render targets sizes from arg1
	reset: function (renderTarget) {
		if (renderTarget === undefined) {
			renderTarget = this.renderTarget1.clone();
			renderTarget.width = window.innerWidth;
			renderTarget.height = window.innerHeight;
		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;
	},

	//Readjust size of rendering
	setSize: function (width, height) {
		var renderTarget = this.renderTarget1.clone();

		renderTarget.width = width;
		renderTarget.height = height;

		this.reset(renderTarget);
	}
};
