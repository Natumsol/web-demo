const router = require("koa-router")();

router.get("/", function*(next){
	this.body = "the path is" + this.path;
	yield next;
})

router.get("/home", function*() {
	this.body = "the path is " + this.path;
	yield next;
})
module.exports = router