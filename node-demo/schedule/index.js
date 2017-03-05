var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();

rule.second = [0, 10, 20, 30, 40, 50];

var job = schedule.scheduleJob(rule, function(){
    console.log(new Date());
})