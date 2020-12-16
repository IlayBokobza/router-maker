"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require('yargs/yargs');
var hideBin = require('yargs/helpers').hideBin;
var argv = yargs(hideBin(process.argv)).argv;
var rootPath = require('app-root-path').path;
var chalk_1 = __importDefault(require("chalk"));
var createConfigFile_1 = require("./createConfigFile");
var fs_1 = __importDefault(require("fs"));
//create a config file
if (argv.init) {
    createConfigFile_1.createConfigFile();
    console.log(chalk_1.default.blueBright('Created Confige File'));
    process.exit();
}
var options;
if (fs_1.default.existsSync(rootPath + "/routerconfig.js")) {
    options = require(rootPath + "/routerconfig.js");
    if (!options.output)
        options.output = './';
    if (!options.input)
        options.input = './views';
    if (!options.appId)
        options.appId = 'app';
    if (!options.moduleBundler)
        options.moduleBundler = false;
    if (!options.addClassToActiveLinks)
        options.addClassToActiveLinks = false;
    if (!options.activeLinksClass)
        options.activeLinksClass = 'active';
    if (!options.concatFile)
        options.concatFile = false;
}
else {
    options = {
        output: './',
        input: './views',
        appId: 'app',
        watch: false,
        moduleBundler: false,
        addClassToActiveLinks: false,
        activeLinksClass: 'active',
        concatFile: false
    };
    //output path
    if (argv.output) {
        options.output = argv.output;
    }
    //input path
    if (argv.input) {
        options.input = argv.input;
    }
    //package with module bundler
    if (argv.packageWithModuleBundler || argv.pwmb) {
        options.moduleBundler = true;
    }
    //change main id
    if (argv.appId) {
        options.appId = argv.appId;
    }
}
//watch mode
options.watch = false;
if (argv.w) {
    options.watch = true;
}
exports.default = options;
