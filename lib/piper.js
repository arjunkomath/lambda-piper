var aws = require('aws-sdk');
var async = require('async');
var Promise = require('bluebird');

module.exports = {

    accessKeyId: null,
    secretAccessKey: null,
    region: null,

    /**
     * If debug is true, every response of each function will be logged to console
     */
    options: {
        debug: false
    },

    /**
     * Initialize piper
     * @param region
     * @param accessKeyId
     * @param secretAccessKey
     * @param options
     */
    init: function (region, accessKeyId, secretAccessKey, options) {
        this.region = region;
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
        if(options)
            this.options = options;
    },

    /**
     * Invoke a lambda function with payload
     * @param functionName
     * @param payload
     * @param cb
     */
    invokeFunction: function (functionName, payload, cb) {
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
    },

    /**
     * Pipe several functions
     * @param funcs Array of functions
     * @param payload Initial payload
     * @param cb Callback
     */
    pipe: function (funcs, payload, cb) {

        if(!(this.region || this.accessKeyId || this.secretAccessKey))
            cb({
                error: 'Please initialize key, secret and region'
            });

        if(!funcs.length)
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

                    if(_this.options.debug)
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

    }

}
