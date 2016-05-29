var aws = require('aws-sdk');
var async = require('async');
var Promise = require('bluebird');

module.exports = {

    accessKeyId: null,
    secretAccessKey: null,
    region: null,
    
    init: function (region, accessKeyId, secretAccessKey) {
        this.region = region;
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
    },

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
                        if (err) console.log(err);
                        callback(null, data);
                    })
                })
            } else {
                callStack.push(function (arg, callback) {
                    _this.invokeFunction(functionName, JSON.parse(arg.Payload), function (err, data) {
                        if (err) console.log(err);
                        callback(null, data);
                    })
                })
            }
            i++;

        }).then(function () {

            async.waterfall(callStack, function (err, result) {
                if (err)
                    cb(err);
                else cb(null, result);
            });

        });

    }

}
