//Physical surfaces creation for CANNON.js
//By Chuck
THREE.PhysicalMaterial = function( options ) {

	var options = typeof( options ) === "object" ? options : {};

	var scope = this;

	CANNON.Material.call( scope, options.name || "ground" );

	scope.contactAttributes = {};

	var defaults = scope.defaultAttributes;

	for( var name in defaults ) {

		scope.contactAttributes[name] = typeof( options[name] ) !== "undefined" ?
			options[name] : defaults[name];	

	}

};

THREE.PhysicalMaterial.prototype = {

	constructor: THREE.PhysicalMaterial,

	contactAttributes: {},
		
	defaultAttributes: {
			
		friction: 1,
		restitution: 0.3,
		contactEquationStiffness: 1e8,
		contactEquationRelaxtion: 3,
		frictionEquationStiffness: 1e8,
		frictionEquationRegularizationTime: 3					
		
	},

	

	createContact: function( contact, options ) {
	
		var options = typeof( options ) === "object" ? options : {};

		return new CANNON.ContactMaterial( this, contact, this.contactAttributes );
		
	}	
	
};

THREE.PhysicalDefaultMaterial = new THREE.PhysicalMaterial({ name: "default" });

