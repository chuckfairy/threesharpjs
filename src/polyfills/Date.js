// Date polyfill
// By Chuck
if ( Date.now === undefined ) {

    Date.now = function () {

        return new Date().valueOf();

    };

}
