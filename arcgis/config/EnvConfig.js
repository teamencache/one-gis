(function(global){
    global.arcgisAPI = 'http://localhost:8080/arcgis_js/arcgis_js_v414_api/arcgis_js_api/library/4.14/dojo/dojo.js';
    function loadResource(url, onLoad , onError){
        //判断js-css
        url.match(/.*\.js$/ig)
    }
    function getQueryObject() {
        var query = window.location.search;
        if (query.indexOf('?') > -1) {
            query = query.substr(1);
        }
        var pairs = query.split('&');
        var queryObject = {};
        for (var i = 0; i < pairs.length; i++) {
            var splits = decodeURIComponent(pairs[i]).split('=');
            queryObject[splits[0]] = splits[1];
        }
        return queryObject;
    }
})(window)