
var koa = require('koa');
var parse = require('co-body');

var app = module.exports = koa();

// POST .name to /uppercase
// co-body accepts application/json
// and application/x-www-form-urlencoded
var count = 1;
app.use(function* (next) {
  console.log('第' + (count ++) + "次穿过 404 中间件");
  yield next;
  console.log('第' + (count ++) + "次穿过 404 中间件");
  console.log(this.body);
  if(404 != this.status) return;

  this.status = 404;
  this.body = "Page Not Found";
});

app.use(function* (next) {
  if (this.path == "/") {
   this.body = {
     name: "liujia"
   }
  } else {
    yield next;
  }
});

if (!module.parent) app.listen(4000);
