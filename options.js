"use strict";
exports.__esModule = true;
var yargs = require('yargs/yargs');
var hideBin = require('yargs/helpers').hideBin;
var argv = yargs(hideBin(process.argv)).argv;
var options = {
    output: '',
    input: 'views',
    watch: false
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
exports["default"] = options;
