/**
 * @author: natumsol
 * @description: simulate logining in zhihu.com
 */
var https = require("https");
var cheerio = require('cheerio');
var async = require("async");
var querystring = require("querystring");
var config = require("./config/config");
// var fs = require("fs");
var mongoose = require("mongoose");
require("./config/mongoose.js")();
var Zhihu = mongoose.model("Zhihu");
var url = {
    home: "www.zhihu.com",
    login: "/login/email",
    activities: "/people/natumsol/activities"
}
var loginCookie; // store login info
var user = {}; // store user info
var xsrftoken; // store xsrf token



/* get _xsrf token */
var getToken = function(callback) {
    var options = {
        hostname: url.home,
        path: "/",
        port: 443,
        method: "GET"
    };
    var req = https.request(options, function(res) {
        var data = [];
        res.on('data', function(chunk) {
            data.push(chunk);
        });
        res.on('end', function() {
            data = Buffer.concat(data).toString("utf-8");
            var $ = cheerio.load(data);
            xsrftoken = $("input[name='_xsrf']").val();
            callback(null, {
                token: xsrftoken,
                cookie: res.headers['set-cookie']
            });
        })
    });

    req.end();
}

/* do login, get login in cookie */
var login = function(data, callback) {
    var postData = {
        password: config.password,
        remember_me: true,
        email: config.email,
        _xsrf: data.token

    }
    var options = {
        hostname: url.home,
        path: url.login,
        port: 443,
        method: "POST",
        headers: {
            "Cookie": data.cookie,
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.108 Safari/537.36",
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };

    var req = https.request(options, function(res) {
        loginCookie = res.headers["set-cookie"];
        for (var i = 0; i < loginCookie.length; i++) {
            if (loginCookie[i].indexOf("xsrf") != -1) {
                loginCookie[i] = loginCookie[i].replace("_xsrf=;", "_xsrf=" + xsrftoken + ";");
            }
        }
        callback(null, loginCookie);
    });

    req.write(querystring.stringify(postData));
    req.end();
}

/* get userInfo */
var getUserInfo = function(cookie, callback) {
    var options = {
        hostname: url.home,
        path: "/",
        port: 443,
        method: "GET",
        headers: {
            "Cookie": cookie,
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.108 Safari/537.36"

        }
    };
    var req = https.request(options, function(res) {
        var data = [];
        res.on('data', function(chunk) {
            data.push(chunk);
        });
        res.on('end', function() {
            data = Buffer.concat(data).toString("utf-8");
            var $ = cheerio.load(data);
            user.username = $(".top-nav-profile .name").text();
            callback(null, user.username);
        })
    });

    req.end();
}


var getActivities = function(err, username) {

    function getData(start){
      var postData = querystring.stringify({
          start: start,
          _xsrf: xsrftoken
      });
      var options = {
          hostname: url.home,
          port: 443,
          path: url.activities,
          method: "POST",
          headers: {
              "Cookie": loginCookie,
              "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.108 Safari/537.36",
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'Content-Length': postData.length
          }
      };
      var req = https.request(options, function(res) {
          var data = [];
          res.on('data', function(chunk) {
              data.push(chunk);
          });
          res.on('end', function() {
              data = JSON.parse(Buffer.concat(data).toString("utf-8")).msg['1'];
              var $ = cheerio.load(data);
              var likeData = [];
              var prefix = "http://www.zhihu.com";
              var member_voteup_answer = $("div.zm-item[data-type-detail='member_voteup_answer']");
              member_voteup_answer.each(function(index, value, array) {
                  var zhihu = new Zhihu({
                      date: $(".zm-profile-setion-time", this).text(),
                      question_title: $(".question_link", this).text(),
                      question_link: prefix + $(".question_link", this).attr("href"),
                      author: $(".author-link").text(),
                      author_link: prefix + $(".author-link").attr("href"),
                      vote: $(".zm-item-vote-count", this).text(),
                      answer: $(".zm-item-rich-text", this).html(),
                      answer_link: prefix + $(".zm-item-rich-text", this).attr("data-entry-url")
                  });
                  zhihu.save(function(err) {
                      if (err) throw (err);
                      else console.log("save ok!");
                  });
              });
              var start = $(member_voteup_answer[member_voteup_answer.length - 1]).attr("data-time");
              getData(start)
          })
      });

      req.write(postData);
      req.end()
    }

    getData("1460303451");
}
async.waterfall([getToken, login, getUserInfo], getActivities);
