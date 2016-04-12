var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/zhihu.log', category: 'zhihu' }
    ]
});

var logger = log4js.getLogger('zhihu'); // get logger

module.exports = logger;