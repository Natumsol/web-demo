/**
 * 可读流例子
 */
var ReadStream = require("stream").Readable;
var rs = new ReadStream();
rs.push("hello,");
rs.push("world\n");
rs.push(null); // 通知数据接收者数据发送完毕
rs.pipe(process.stdout);