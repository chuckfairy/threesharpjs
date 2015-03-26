/**
 * @author @oosmoxiecode
 *
 * Based on http://devlog-martinsh.blogspot.se/2011/03/glsl-8x8-bayer-matrix-dithering.html
 */

THREE.DitherShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"grayScale": { type: "i", value: 0 },

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform int grayScale;",

		"varying vec2 vUv;",
		"float Scale = 2.0;",


		"float find_closest(int x, int y, float c0) {",

			"int dither[64];",

			"dither[0] = 0;",
			"dither[1] = 32;",
			"dither[2] = 8;",
			"dither[3] = 40;",
			"dither[4] = 2;",
			"dither[5] = 32;",
			"dither[6] = 10;",
			"dither[7] = 42;",
			"dither[8] = 48;",
			"dither[9] = 16;",
			"dither[10] = 56;",
			"dither[11] = 24;",
			"dither[12] = 50;",
			"dither[13] = 18;",
			"dither[14] = 58;",
			"dither[15] = 26;",
			"dither[16] = 12;",
			"dither[17] = 44;",
			"dither[18] = 4;",
			"dither[19] = 36;",
			"dither[20] = 14;",
			"dither[21] = 46;",
			"dither[22] = 6;",
			"dither[23] = 38;",
			"dither[24] = 60;",
			"dither[25] = 28;",
			"dither[26] = 52;",
			"dither[27] = 20;",
			"dither[28] = 62;",
			"dither[29] = 30;",
			"dither[30] = 54;",
			"dither[31] = 22;",
			"dither[32] = 3;",
			"dither[33] = 35;",
			"dither[34] = 11;",
			"dither[35] = 43;",
			"dither[36] = 1;",
			"dither[37] = 33;",
			"dither[38] = 9;",
			"dither[39] = 41;",
			"dither[40] = 51;",
			"dither[41] = 19;",
			"dither[42] = 59;",
			"dither[43] = 27;",
			"dither[44] = 49;",
			"dither[45] = 17;",
			"dither[46] = 57;",
			"dither[47] = 25;",
			"dither[48] = 15;",
			"dither[49] = 47;",
			"dither[50] = 7;",
			"dither[51] = 39;",
			"dither[52] = 13;",
			"dither[53] = 45;",
			"dither[54] = 5;",
			"dither[55] = 37;",
			"dither[56] = 63;",
			"dither[57] = 31;",
			"dither[58] = 55;",
			"dither[59] = 23;",
			"dither[60] = 61;",
			"dither[61] = 29;",
			"dither[62] = 53;",
			"dither[63] = 21;",

			"float limit = 0.0;",
			"if(x < 8) {",
				"int index = x + y*8;",
				//"limit = float(dither[index]+1)/64.0;",
				// sigh.....
				"if (index == 0) {limit = float(dither[0]+1)/64.0;};",
				"if (index == 1) {limit = float(dither[1]+1)/64.0;};",
				"if (index == 2) {limit = float(dither[2]+1)/64.0;};",
				"if (index == 3) {limit = float(dither[3]+1)/64.0;};",
				"if (index == 4) {limit = float(dither[4]+1)/64.0;};",
				"if (index == 5) {limit = float(dither[5]+1)/64.0;};",
				"if (index == 6) {limit = float(dither[6]+1)/64.0;};",
				"if (index == 7) {limit = float(dither[7]+1)/64.0;};",
				"if (index == 8) {limit = float(dither[8]+1)/64.0;};",
				"if (index == 9) {limit = float(dither[9]+1)/64.0;};",
				"if (index == 10) {limit = float(dither[10]+1)/64.0;};",
				"if (index == 11) {limit = float(dither[11]+1)/64.0;};",
				"if (index == 12) {limit = float(dither[12]+1)/64.0;};",
				"if (index == 13) {limit = float(dither[13]+1)/64.0;};",
				"if (index == 14) {limit = float(dither[14]+1)/64.0;};",
				"if (index == 15) {limit = float(dither[15]+1)/64.0;};",
				"if (index == 16) {limit = float(dither[16]+1)/64.0;};",
				"if (index == 17) {limit = float(dither[17]+1)/64.0;};",
				"if (index == 18) {limit = float(dither[18]+1)/64.0;};",
				"if (index == 19) {limit = float(dither[19]+1)/64.0;};",
				"if (index == 20) {limit = float(dither[20]+1)/64.0;};",
				"if (index == 21) {limit = float(dither[21]+1)/64.0;};",
				"if (index == 22) {limit = float(dither[22]+1)/64.0;};",
				"if (index == 23) {limit = float(dither[23]+1)/64.0;};",
				"if (index == 24) {limit = float(dither[24]+1)/64.0;};",
				"if (index == 25) {limit = float(dither[25]+1)/64.0;};",
				"if (index == 26) {limit = float(dither[26]+1)/64.0;};",
				"if (index == 27) {limit = float(dither[27]+1)/64.0;};",
				"if (index == 28) {limit = float(dither[28]+1)/64.0;};",
				"if (index == 29) {limit = float(dither[29]+1)/64.0;};",
				"if (index == 30) {limit = float(dither[30]+1)/64.0;};",
				"if (index == 31) {limit = float(dither[31]+1)/64.0;};",
				"if (index == 32) {limit = float(dither[32]+1)/64.0;};",
				"if (index == 33) {limit = float(dither[33]+1)/64.0;};",
				"if (index == 34) {limit = float(dither[34]+1)/64.0;};",
				"if (index == 35) {limit = float(dither[35]+1)/64.0;};",
				"if (index == 36) {limit = float(dither[36]+1)/64.0;};",
				"if (index == 37) {limit = float(dither[37]+1)/64.0;};",
				"if (index == 38) {limit = float(dither[38]+1)/64.0;};",
				"if (index == 39) {limit = float(dither[39]+1)/64.0;};",
				"if (index == 40) {limit = float(dither[40]+1)/64.0;};",
				"if (index == 41) {limit = float(dither[41]+1)/64.0;};",
				"if (index == 42) {limit = float(dither[42]+1)/64.0;};",
				"if (index == 43) {limit = float(dither[43]+1)/64.0;};",
				"if (index == 44) {limit = float(dither[44]+1)/64.0;};",
				"if (index == 45) {limit = float(dither[45]+1)/64.0;};",
				"if (index == 46) {limit = float(dither[46]+1)/64.0;};",
				"if (index == 47) {limit = float(dither[47]+1)/64.0;};",
				"if (index == 48) {limit = float(dither[48]+1)/64.0;};",
				"if (index == 49) {limit = float(dither[49]+1)/64.0;};",
				"if (index == 50) {limit = float(dither[50]+1)/64.0;};",
				"if (index == 51) {limit = float(dither[51]+1)/64.0;};",
				"if (index == 52) {limit = float(dither[52]+1)/64.0;};",
				"if (index == 53) {limit = float(dither[53]+1)/64.0;};",
				"if (index == 54) {limit = float(dither[54]+1)/64.0;};",
				"if (index == 55) {limit = float(dither[55]+1)/64.0;};",
				"if (index == 56) {limit = float(dither[56]+1)/64.0;};",
				"if (index == 57) {limit = float(dither[57]+1)/64.0;};",
				"if (index == 58) {limit = float(dither[58]+1)/64.0;};",
				"if (index == 59) {limit = float(dither[59]+1)/64.0;};",
				"if (index == 60) {limit = float(dither[60]+1)/64.0;};",
				"if (index == 61) {limit = float(dither[61]+1)/64.0;};",
				"if (index == 62) {limit = float(dither[62]+1)/64.0;};",
				"if (index == 63) {limit = float(dither[63]+1)/64.0;};",
			"}",

			"if(c0 < limit)",
			"return 0.0;",
			"return 1.0;",
		"}",

		"void main() {",

	
			"vec2 xy = gl_FragCoord.xy * Scale;",
			"int x = int(mod(xy.x, 8.0));",
			"int y = int(mod(xy.y, 8.0));",

			"if (grayScale == 0) {",
				"vec3 rgb = texture2D(tDiffuse, vUv.xy).rgb;",

				"vec3 finalRGB;",
				"finalRGB.r = find_closest(x, y, rgb.r);",
				"finalRGB.g = find_closest(x, y, rgb.g);",
				"finalRGB.b = find_closest(x, y, rgb.b);",

				"gl_FragColor = vec4(finalRGB, 1.0);",
			
			"} else {",
				"vec4 lum = vec4(0.299, 0.587, 0.114, 0.0);",
				"float grayscale = dot(texture2D(tDiffuse, vUv.xy), lum);",
				"float final = find_closest(x, y, grayscale);",
				"gl_FragColor = vec4(final, final, final, 1.0);",
			"}",

		"}"

	].join("\n")

};
