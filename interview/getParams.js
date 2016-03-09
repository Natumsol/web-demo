
/**
 * @param url String
 */

function getParams(url) {
    var result = {};
    url = decodeURI(url);
    if (typeof url == "string" && url.indexOf("?") != -1) {
        var params = url.match(/\?.*/)[0].trim().replace(/^\?/, "").split("&");
        for (var i = 0; i < params.length; i++) {
            var temp = params[i].split("=");
            result[temp[0]] = temp[1];
        }
    }
    return result;
}