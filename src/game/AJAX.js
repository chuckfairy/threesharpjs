//Ajax helper functions
//By Chuck
THREE.AJAX = {


    get: function(url, data) {


    },


    //Send post data

    post: function(url, title, data, callback) {

        var request = new XMLHttpRequest();
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
