//Ajax helper functions
//
THREE.AJAX = {

    //Request

    createRequest: function() {

        try { return new XMLHttpRequest(); }
        catch( e ) {}
        try { return new ActiveXObject( 'Msxml2.XMLHTTP.6.0' ); }
        catch (e) {}
        try { return new ActiveXObject( 'Msxml2.XMLHTTP.3.0' ); }
        catch (e) {}
        try { return new ActiveXObject( 'Microsoft.XMLHTTP' ); }
        catch (e) {}
        return false;

    },


    //Basic GET

    get: function( url, callback ) {

        var request = THREE.AJAX.createRequest();

        request.onreadystatechange = function() {

            if( request.readyState === 4 && request.status === 200 ) {

                callback( this.responseText.toString() );

            }

        };

        request.open( "GET", url, true );
        request.send();

    },

    //Send post data

    post: function(url, title, data, callback) {

        var request = THREE.AJAX.createRequest();
        request.open("POST", url);

        request.onreadystatechange = function() {

            if( request.readyState === 4 && request.status === 200 ) {

        		var responseText = this.response;
                if(callback) { callback(responseText); }

        	}

        };

        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	    postData = title + "=" + encodeURIComponent(JSON.stringify(data));
        request.send(postData);

    }



};
