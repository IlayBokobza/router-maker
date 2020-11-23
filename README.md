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

YOU MUST HAVE THIS DIV OR THE ROUTER WONT WORK!

Example:
```html
<!DOCTYPE html>
<html lang="en">
<head></head>
<body>
    <div id="app"></div>
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
</body>
</html>
```


## Usage
### Creating Router And configuration
in package.json
```json
  "scripts": {
    "create-router": "router-maker"
  },
```

By default the package will look for html files in a "views" folder inside the root directory, and will output the router  file at the root directory.

You can config this behavior by adding some flags.

```json
  "scripts": {
    "create-router": "router-maker --input src/views --output public/js"
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