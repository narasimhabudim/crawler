var log4js = require('log4js'); // include log4js
log4js.configure({ // configure to use all types in different files.
    appenders: [
        {   type: 'file',
            filename: "./logs/error.log", // specify the path where u want logs folder error.log
            category: 'error',
            maxLogSize: 20480,
            backups: 10
        },
        {   type: "file",
            filename: "./logs/info.csv", // specify the path where u want logs folder info.log
            category: 'info',
            maxLogSize: 20480,
            backups: 10
        },
        {   type: 'file',
            filename: "./logs/debug.log", // specify the path where u want logs folder debug.log
            category: 'debug',
            maxLogSize: 20480,
            backups: 10
        }
    ]
});
exports.log = {
        log  : function (fn) { defaultLogger.log.apply(defaultLogger, arguments);   },
        debug: function (fn) { defaultLogger.debug.apply(defaultLogger, arguments); },
        info : function (fn) { defaultLogger.info.apply(defaultLogger, arguments);  },
        warn : function (fn) { defaultLogger.warn.apply(defaultLogger, arguments);  },
        error: function (fn) { defaultLogger.error.apply(defaultLogger, arguments); },
}

exports.logger = function(name) {
        var logger = (typeof name == 'undefined')? defaultLogger : log4js.getLogger(name);
        logger.setLevel("DEBUG");
        return logger;
}

