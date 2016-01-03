/**
 * THREE utils
 */
THREE.Utils = {


    //Object to array

    arrayToObject: function( arr ) {

        var rv = {};

        for( var i = 0; i < arr.length; i++ ) {

            rv[arr[i]] = arr[i];

        }

        return rv;

    },


    //Array remove by value

    arrayRemove: function( array, value ) {

        var al = array.length;

        for( var i = 0; i < al; i ++ ) {

            if( array[ i ] === value ) {

                array.splice( i, 1 );
                return array;

            }

        }

    },


    //Is array polyfill

    isArray: function( array ) {

        if( typeof Array.isArray === "undefined" ) {

            return Object.prototype.toString.call( array ) === "[object Array]";

        } else {

            return Array.isArray( array );

        }

    },


    //In Array

    inArray: function( needle, haystack ) {

        var hl = haystack.length;

        for( var i = 0; i < hl; i ++ ) {

            if( needle === haystack[ i ] ) {

                return true;

            }

        }

        return false;

    },


    //Create a range of numbers

    createRange: function( start, end ) {

        var numArray = Array.apply( null, { length: end + 1 } );
        return numArray.map( Number.call, Number ).slice( start );

    },


    //Create a range of numbers into an object

    createRangeObject: function( start, end ) {

        return THREE.Utils.arrayToObject( THREE.Utils.createRange( start, end ) );

    },


    //Highly used as an inheritance

    setDefaults: function( object, defaults ) {

        var defaults = typeof( defaults ) === "object" ? defaults: {};
        var object = typeof( object ) === "object" ? object : defaults;

        if( object === defaults ) { return object; }

        for( var defaultName in defaults ) {

            var defaultVal = defaults[ defaultName ];
            var objectVal = object[ defaultName ];

            if( typeof( defaultVal ) === "object" ) {

                object[ defaultName ] = THREE.Utils.setDefaults( objectVal, defaultVal );

            } else if( typeof( objectVal ) === "undefined" ) {

                object[ defaultName ] = defaults[ defaultName ];

            }

        }

        return object;

    },



    //Multi event listeners

    addEvents: function( evt, array, fnc ) {

        var al = array.length;

        for( var i = 0; i < al; i ++ ) {

            THREE.Utils.addEvent( evt, array[ i ], fnc );

        }

    },


    //Add event listener

    addEvent: function( evt, obj, fnc ) {

        // W3C model
        if( obj.addEventListener ) {

            return obj.addEventListener( evt, fnc, false );

        }

        // Microsoft model
        else if( obj.attachEvent ) {

            return obj.attachEvent( 'on' + evt, fnc );

        }

        // Browser don't support W3C or MSFT model, go on with traditional
        else {

            evt = 'on'+evt;

            if(typeof obj[evt] === 'function'){

                // Object already has a function on traditional
                fnc = (function(f1,f2){
                    return function(){
                        f1.apply(this,arguments);
                        f2.apply(this,arguments);
                    }
                })(obj[evt], fnc);

            }

            return obj[evt] = fnc;

        }

    }

};
