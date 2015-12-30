addEventListener("message", function (evt) {
    console.log("来自main.js的消息：" + evt.data);
});
postMessage("hello, main.js");