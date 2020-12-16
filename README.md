# Router Maker
Router Maker Automatically Create A Router For You Application.

## Installation
```bash
npm -D router-maker
```

## How Does The Package Work
The package will read your html files and create a router file that you can connect to your main html file.

The route name will be determined by the file name.

For Example:

`about.html` will be found at `YOUR-URL#/about`

If a file is named `index.html` it will be found at `YOUR-URL#/`

You html will be rendered into a div with an id of "app"

If you do not have an a div with an id of "app" it will be automatically be added to the bottom of the body.

Example:
```html
<!DOCTYPE html>
<html lang="en">
<head></head>
<body>
    <div id="app"></div>
    <script src="YOUR-PATH-TO-ROUTER/router.js"></script>
</body>
</html>
```

If you want to have html that will be rendered on every page you can add it outside of the app div.

Example:
```html
<!DOCTYPE html>
<html lang="en">
<head></head>
<body>
    <h1>I Will Be Here On Every Page.<h1>
    <div id="app"></div>
    <script src="YOUR-PATH-TO-ROUTER/router.js"></script>
</body>
</html>
```


## Usage
### Starting up
To begin with make a script in package.json.
```json
"scripts": {
  "create-router": "router-maker"
},
```

This will create a router file but you will probably want to configure it.
By default the package will look for html files in a "views" folder inside the root directory, and will output the router  file at the root directory.

### Configuration
#### Method 1: Config File
The best way to configure the router is with the router config file.
First create the router config file by writing this script in package.json.
```json
"scripts": {
  "init-router": "router-maker --init"
},
```
This will create the config file. The file has comments that explains what each setting does.
The file look like this.
```js
module.exports = {
    output:'./',                    // The path to create the router file
    input:'./views',                // The path to your html file for your pages
    appId:'app',                    // The id of the div that all the content from your html pages go to
    moduleBundler:false,            // Change it if you want to package your router with a module bundler
    addClassToActiveLinks:false,    // If set to true will add a class to active links
    activeLinksClass:'active',      // The class which will be added to active links
    concatFile:false                // If set to true will make the router file into one line
}
```
#### Method 2: Flags
If you only want some minor configuration or you don't want and extra file you can use flag.

#### Note: future features and some current ones may not be available with flags.

To configure the the location for the input (the folder with all of your html files). You can add the input file
For Example:
```json
"scripts": {
  "create-router": "router-maker --input src/views"
},
```

If you want to change the location of the generated router file you can add the output flag.
```json
"scripts": {
  "create-router": "router-maker --output public/js"
},
```

You can also change the id of the main div (default "app") You can use the `appId` flag

Example:
```json
"scripts": {
  "create-router": "router-maker --appId MyAppId"
},
```

If You would Like to have the router be rewritten on save you can use the watch flag
```json
"scripts": {
  "create-router": "router-maker -w"
},
```
### Links
In order to make links to a different page you will have to write the links slightly different.
```html
<a href="#/">Home</a>
<a href="#/about">About</a>
<a href="#/contact">Contact</a>
```

### Connect To Application
In order use your to use your new router you will just have to link it to your html like any other javascript file.
```html
<script src="YOUR-PATH-TO-ROUTER/router.js"></script>
```
If you would like to package the router with a module bundler you can configure it in the router config file, or adding the `packageWithModuleBundler` flag

Example:
In package.json
```json
"scripts": {
  "create-router": "router-maker --packageWithModuleBundler"
},
```
or
```json
"scripts": {
  "create-router": "router-maker --pwmb"
},
```
This will make it so the router.js file will export a function that allows you to use it in another file.
You can do it like so:
```js
import { packageWithModuleBundler } from './router'
packageWithModuleBundler()
```