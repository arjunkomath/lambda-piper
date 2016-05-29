var should = require('chai').should();
var lambdaPiper = require('./../index');

var piper = new lambdaPiper({
    region: 'us-east-1'
});

describe('Pipe two functions', function () {

    it('should return 26', function (done) {
        piper.pipe(['test1', 'test2'], {
            key3: 1
        }, function (err, d) {
            if (err) return done(err);
            var res = JSON.parse(d.Payload);
            res.key3.should.equal(26);
            done();
        });
    });

});