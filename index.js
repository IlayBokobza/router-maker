#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var fs = require('fs');
var root = require('app-root-path').path;
var chalk = require('chalk');
var options_1 = require("./options");
//gets all html files
var views = [];
var jsViewsFile = "";
var main = function () {
    views = fs.readdirSync(root + "/" + options_1["default"].input).filter(function (file) {
        var regEx = /\.html$/;
        return regEx.test(file);
    });
    jsViewsFile = "if(!document.getElementById('" + options_1["default"].appId + "')){\n        document.querySelector('body').innerHTML += '<div id=\"" + options_1["default"].appId + "\"></div>'}\n";
    //gets to body from the html files and adds to to the file
    try {
        views.map(function (view) { return "const " + view.replace(/\.html$/, '') + " = `" + fs.readFileSync(root + "/" + options_1["default"].input + "/" + view).toString()
            .match(/<body>(.*?)<\/body>/gs, '').toString()
            .replace(/<body>|<\/body>/g, '')
            .trim() + "`"; })
            .forEach(function (view) { return jsViewsFile += view + "\n"; });
    }
    catch (_a) { }
    //makes routes array
    var routes = [];
    views.forEach(function (view) {
        view = view.replace(/\.html$/, '');
        if (view === 'index') {
            routes.push({
                path: '/',
                component: view
            });
            return;
        }
        routes.push({
            path: "/" + view,
            component: view
        });
    });
    //adds the global component var and the start of the router
    jsViewsFile += "let component;\nconst setComponent = (path) => {\n    switch(path){\n";
    //ands a case for each view
    routes.forEach(function (route) {
        jsViewsFile += "        case '" + route.path + "':\n";
        jsViewsFile += "        component = " + route.component + "\n";
        jsViewsFile += "        break;\n\n";
    });
    //adds the router logic and closes off the router
    jsViewsFile += "    }\n}\nconst parseLocation = () => location.hash.slice(1).toLowerCase() || '/';\nconst router = () => {\n    const path = parseLocation();\n    setComponent(path)\n    document.getElementById('" + options_1["default"].appId + "').innerHTML = component;\n};";
    if (options_1["default"].moduleBundler) {
        jsViewsFile += "\nexport const packageWithModuleBundler = () => {\n    window.addEventListener('hashchange', router);\n    window.addEventListener('load', router);\n}";
    }
    else {
        jsViewsFile += "\nwindow.addEventListener('hashchange', router);\nwindow.addEventListener('load', router);";
    }
};
//if in watch mode
if (options_1["default"].watch) {
    //makes file
    main();
    //add change listeners for files
    views.forEach(function (fileName) {
        fs.watch(options_1["default"].input + "/" + fileName, function () {
            main();
            //writes file
            fs.writeFileSync(root + "/" + options_1["default"].output + "/router.js", jsViewsFile);
            console.log(chalk.green('Change Detected. Writing File'));
        });
    });
}
else {
    main();
    //writes file
    console.log(chalk.green('Writing file'));
    fs.writeFileSync(root + "/" + options_1["default"].output + "/router.js", jsViewsFile);
}
