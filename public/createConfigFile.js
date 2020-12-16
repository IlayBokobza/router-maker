"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfigFile = void 0;
var fs = require('fs');
var path = require('app-root-path').path;
var file = "module.exports = {\n    output:'./',                    // The path to create the router file\n    input:'./views',                // The path to your html file for your pages\n    appId:'app',                    // The id of the div that all the content from your html pages go to\n    moduleBundler:false,            // Change it if you want to package your router with a module bundler\n    addClassToActiveLinks:false,    // If set to true will add a class to active links\n    activeLinksClass:'active',      // The class which will be added to active links\n    concatFile:false                // If set to true will make the router file into one line\n}";
var createConfigFile = function () { return fs.writeFileSync(path + "/routerconfig.js", file); };
exports.createConfigFile = createConfigFile;
