"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var root = require('app-root-path').path;
var options_1 = __importDefault(require("./options"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var error = function (message) {
    console.error(chalk_1.default.red("Router Maker Error: " + message));
    process.exit();
};
//checks for input path
if (!fs_1.default.existsSync(options_1.default.input)) {
    error("Input path " + path_1.default.resolve(root + '/' + options_1.default.input) + " not found.");
}
//checks for output path
if (!fs_1.default.existsSync(options_1.default.output)) {
    error("Output path " + path_1.default.resolve(root + '/' + options_1.default.output) + " not found.");
}
//checks if no html files in input dir
if (fs_1.default.readdirSync(options_1.default.input).filter(function (filename) { return /\.html$/.test(filename); }).length <= 0) {
    error("No html files found in " + path_1.default.resolve(root + '/' + options_1.default.input));
}
