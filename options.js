"use strict";
exports.__esModule = true;
var yargs = require('yargs/yargs');
var hideBin = require('yargs/helpers').hideBin;
var argv = yargs(hideBin(process.argv)).argv;
var options = {
    output: '',
    input: 'views',
    appId: 'app',
    watch: false,
    moduleBundler: false
};
if (argv.output) {
    options.output = argv.output;
}
if (argv.input) {
    options.input = argv.input;
}
if (argv.w) {
    options.watch = true;
}
if (argv.packageWithModuleBundler || argv.pwmb) {
    options.moduleBundler = true;
}
if (argv.appId) {
    options.appId = argv.appId;
}
exports["default"] = options;
