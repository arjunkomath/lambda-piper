# Lambda Piper
Pipe-And-Filter using lambda functions

------

A very simple, yet powerful architecture, that is also very robust. It consists of any number of components (filters) that transform or filter data, before passing it on via connectors (pipes) to other components. The filters are all working at the same time. The architecture is often used as a simple sequence, but it may also be used for very complex structures.

Use the Pipes and Filters architectural style to divide a larger processing task into a sequence of smaller, independent processing steps (Filters) that are connected by channels (Pipes).

Lambda Piper allows you to create a linear pipeline using AWS Lambda functions. You can pipe several Lambda function with an initial input. Lambda piper will invoke the first function with the initial input, then get the result of that function and feed it as the input to next function and this pipeline continues, finally returning the results of the last function.

![Pipeline](http://i.imgur.com/pHGjn5h.jpg)

## Install

```
npm install lambda-piper
```

## Usage

```javascript
var lambdaPiper = require('lambda-piper');

var piper = new lambdaPiper({
    region: 'aws region',
    accessKeyId: 'your key',
    secretAccessKey: 'your secret',
    options: {
        debug: false
    }
});
```

If debug is set to true, result of every lambda function will be logged to console.

### Pipe function
```
piper.pipe(<Array of function names>, <Initital input>, <Callback>);
```
Example:
```javascript
piper.pipe(['test1', 'test2'], {
    key3: 1
}, function (err, data) {
    console.log(err || data);
});
```

First function `test1` will be executed with the initial input, the output of that function is passed as input to the next function `test2` and finally the callback is called.

NOTE. If any of the function throws error, the pipeline execution will be stopped immediately.

## About Author
* Built with <3 by Arjun Komath / [arjunkomath@gmail.com](mailto:arjunkomath@gmail.com)

## License
- See the [LICENSE](https://github.com/arjunkomath/Feline-for-Product-Hunt/blob/master/LICENSE) file for license rights and limitations (MIT).
