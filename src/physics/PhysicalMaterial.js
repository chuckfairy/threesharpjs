//Physical surfaces creation for CANNON.js
//By Chuck
THREE.PhysicalMaterial = function( options ) {

	var options = typeof( options ) === "object" ? options : {};

	var scope = this;

	CANNON.Material.call( scope, options.name || "ground" );
		
	//Main properties
	scope.contactAttributes = {
	
		friction: options.friction || 0.4,
		restitution: options.restitution || 0.3,
		contactEquationStiffness: options.stiffness || 1e8,
		contactEquationRelaxtion: options.relaxation || 3,
		frictionEquationStiffness: options.stiffness || 1e8,
		frictionEquationRegularizationTime: options.regularization || 3

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
