//Physical surfaces creation for CANNON.js
//By Chuck
THREE.PhysicalMaterial = function( options ) {

	var options = typeof( options ) === "object" ? options : {};

	var scope = this;

	CANNON.Material.call( scope, options.name || "ground" );
		
	var defaults = scope.contactAttributes;

	//Main properties
	scope.contactAttributes = {
	
		friction: options.friction || defaults.friction,
		restitution: options.restitution || defaults.restitution,
		contactEquationStiffness: options.stiffness || defaults.contactEquationStiffness,
		contactEquationRelaxtion: options.relaxation || defaults.contactEquationRelaxation,
		frictionEquationStiffness: options.stiffness || defaults.frictionEquationStiffness,
		frictionEquationRegularizationTime: options.regularization || deafults.frictionEquationRegularizationTime

	};

};

THREE.PhysicalMaterial.prototype = {

	constructor: THREE.PhysicalMaterial,

	contactAttributes: {
			
		friction: 0.4,
		restitution: 0.3,
		contactEquationStiffness: 1e8,
		contactEquationRelaxtion: 3,
		frictionEquationStiffness: 1e8,
		frictionEquationRegularizationTime: 3					
		
	},

	createContact: function( contact, options ) {
	
		var options = typeof( options ) === "object" ? options : {};

		return new CANNON.ContactMaterial( this, slipperyMaterial, this.contactAttributes );
		
	}	
	
};

THREE.PhysicalDefaultMaterial = new THREE.PhysicalMaterial({ name: "default" });

