window.onerror = function(e) {
    console.log(e);
}

window.addEventListener("error", function(e){
    console.log(e);
}, true)

Image.prototype.onerror = function(){
    alert();
}

