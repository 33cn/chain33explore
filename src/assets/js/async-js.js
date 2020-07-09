//接受单个url或者url array，异步加载资源
export function loadScript (url, callback) {
    var urls = [] , newUrl = "";
    if ( typeof url === "object" ){
        newUrl = url.shift();
        urls = url ;
    }else{
        newUrl = url ;
    }
    if (!newUrl){
        return false ;
    }
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                if ( urls.length == 0 ){
                    callback();
                }else{
                    loadScript( urls , callback );
                }
            }
        };
    } else { //Others
        script.onload = function() {
            if ( urls.length == 0 ){
                callback();
            }else{
                loadScript( urls , callback );
            }
        };
    }
    script.src = newUrl;
    document.getElementsByTagName("head")[0].appendChild(script);
}
