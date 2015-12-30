(function () {
    var w = new Worker("worker.js");
    w.addEventListener("message", function (evt) {
        console.log("来自worker.js的消息：" + evt.data);
    });
    w.postMessage("hello, worker!!");
})();