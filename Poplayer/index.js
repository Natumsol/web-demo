function Poplayer(args) {
    this.isModal = args.isModal || false;
    this.moveable = args.moveable || moveable;
    this.content = args.content || "";
    this.width = args.width || 'auto';
    this.inData = args.inData || {};
    this.outData = args.outData;
    this.onShow = args.onShow || function(){};
    this.onClose = args.onClose || function(){};
    this.onDestroy = args.onDestroy || function(){};
    this.id = (Math.random()).toString("16").substring(2,10);
}

Poplayer.prototype.init = function(){
    var template = "<div class='poplayer-container'>" +  
                        "<div class='poplayer-header'>" + <
                    "</div>"
}


Poplayer.prototype.show = function(){

}

Poplayer.prototype.close = function(){

}

Poplayer.prototype.destroy = function(){

}