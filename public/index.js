#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var root = require('app-root-path').path;
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var options_1 = __importDefault(require("./options"));
//gets all html files
var views = [];
var jsViewsFile = "";
var main = function () {
    //runs error handling
    require('./errorhandling');
    views = fs_1.default.readdirSync(root + "/" + options_1.default.input).filter(function (file) {
        var regEx = /\.html$/;
        return regEx.test(file);
    });
    jsViewsFile = "if(!document.getElementById('" + options_1.default.appId + "')){\n        document.querySelector('body').innerHTML += '<div id=\"" + options_1.default.appId + "\"></div>'};\n";
    //gets to body from the html files and adds to to the file
    try {
        var fileVars = views.map(function (view) {
            var _a;
            return "const " + view.replace(/\.html$/, '') + " = `" + ((_a = fs_1.default.readFileSync(root + "/" + options_1.default.input + "/" + view).toString()
                .match(/<body>(.*?)<\/body>/gs)) === null || _a === void 0 ? void 0 : _a.toString().replace(/<body>|<\/body>/g, '').replace(/(\r\n|\n|\r)/gm, "").trim()) + "`;";
        });
        fileVars = fileVars.filter(function (fileVar, index) {
            if (/`undefined`$/.test(fileVar)) {
                views.splice(index, 1);
                return false;
            }
            return true;
        });
        if (fileVars.length <= 0) {
            console.error(chalk_1.default.red('Router Maker Error: No html files with a body tag were found'));
            process.exit();
        }
        fileVars.forEach(function (view) { return jsViewsFile += view + "\n"; });
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
        jsViewsFile += "        component = " + route.component + ";\n";
        jsViewsFile += "        break;\n\n";
    });
    jsViewsFile += '    };\n};';
    //active link class adder function
    if (options_1.default.addClassToActiveLinks)
        jsViewsFile += "\nconst setLinks = (path) => {\n        const links = [...document.querySelectorAll('a')];\n        links.forEach(link => link.classList.remove('" + options_1.default.activeLinksClass + "'));\n        links.filter(link => link.hash.replace(/#/,'') === path).forEach(link => link.classList.add('" + options_1.default.activeLinksClass + "'));\n    }";
    //adds the router logic
    jsViewsFile += "\nconst parseLocation = () => location.hash.slice(1).toLowerCase() || '/';\nconst router = () => {\n    const path = parseLocation();\n    setComponent(path);\n";
    //calls the function thats add classes to active links
    if (options_1.default.addClassToActiveLinks)
        jsViewsFile += "    setLinks(path);";
    jsViewsFile += "\n    document.getElementById('" + options_1.default.appId + "').innerHTML = component;\n};";
    // if user wants to package with moudle bundlers
    if (options_1.default.moduleBundler) {
        jsViewsFile += "\nexport const packageWithModuleBundler = () => {\n    window.addEventListener('hashchange', router);\n    window.addEventListener('load', router);\n};";
        // if not
    }
    else {
        jsViewsFile += "\nwindow.addEventListener('hashchange', router);\nwindow.addEventListener('load', router);";
    }
    //concat file if user wants
    if (options_1.default.concatFile)
        jsViewsFile = jsViewsFile.replace(/(\r\n|\n|\r)/gm, "");
};
var startUp = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        //if in watch mode
        if (options_1.default.watch) {
            //makes file
            main();
            //add change listeners for files
            views.forEach(function (fileName) {
                fs_1.default.watch(options_1.default.input + "/" + fileName, function () {
                    main();
                    //writes file
                    fs_1.default.writeFileSync(root + "/" + options_1.default.output + "/router.js", jsViewsFile);
                    console.log(chalk_1.default.green('Change Detected. Writing File'));
                });
            });
        }
        else {
            main();
            //writes file
            fs_1.default.writeFileSync(root + "/" + options_1.default.output + "/router.js", jsViewsFile);
            console.log(chalk_1.default.green('Writing file'));
        }
        return [2 /*return*/];
    });
}); };
startUp();
