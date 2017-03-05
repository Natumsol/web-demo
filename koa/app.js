'use strict';

const koa = require('koa')
const cors = require('koa-cors');
const myRoute = require("./router.js");
const router = require("koa-router")();
const app = koa();

app.use(cors({
  origin: true,
  credentials: true
}));
router.use('/users', myRoute.routes(), myRoute.allowedMethods());
app.use(router.routes());
app.listen(4000)