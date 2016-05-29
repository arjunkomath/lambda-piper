var aws = require('aws-sdk');
var async = require('async');
var Promise = require('bluebird');

var Piper = module.exports = function (config) {
    if (!config) config = {};
    this.region = config.region;
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;
    if ('options' in config)
        this.options = config.options;
    else  this.options = {
        debug: false
    }
};

/**
 * Invoke a lambda function with payload
 * @param functionName
 * @param payload
 * @param cb
 */
Piper.prototype.invokeFunction = function (functionName, payload, cb) {
    var lambda = new aws.Lambda({
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
        region: this.region
    });
    lambda.invoke({
        FunctionName: functionName,
        Payload: JSON.stringify(payload)
    }, function (err, data) {
        if (err) return cb(err);
        else cb(null, data);
    });
};

/**
 * Pipe several functions
 * @param funcs Array of functions
 * @param payload Initial payload
 * @param cb Callback
 */
Piper.prototype.pipe = function (funcs, payload, cb) {

    if (!(this.region || this.accessKeyId || this.secretAccessKey))
        cb({
            error: 'Please initialize key, secret and region'
        });

    if (!funcs.length)
        cb({
            error: 'Invalid function names'
        });

    var _this = this;
    var callStack = [];

    var i = 0;
    Promise.each(funcs, function (functionName) {

        if (i == 0) {
            callStack.push(function (callback) {

                _this.invokeFunction(functionName, payload, function (err, data) {
                    if (err) callback(err);
                    callback(null, data);
                })

            })
        } else {
            callStack.push(function (arg, callback) {

                if (_this.options.debug)
                    console.log(arg);

                _this.invokeFunction(functionName, JSON.parse(arg.Payload), function (err, data) {
                    if (err) callback(err);
                    callback(null, data);
                })

            })
        }
        i++;

    }).then(function () {

        async.waterfall(callStack, function (err, result) {
            if (err)
                return cb(err);
            else return cb(null, result);
        });

    });

};
