#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const options = require('./options')
const root = require('app-root-path').path;

//gets all html files
const views = fs.readdirSync(`${root}/${options.input}`).filter(file => {
    const regEx = /\.html$/
    return regEx.test(file)
})
let jsViewsFile = ""

//gets to body from the html files and adds to to the file
views.map(view => "const " + view.replace(/\.html$/,'') + " = `" + fs.readFileSync(`${root}/${options.input}/${view}`).toString()
.match(/<body>(.*?)<\/body>/gs,'').toString()
.replace(/<body>|<\/body>/g,'')
.trim()
+ "`;")
.forEach(view => jsViewsFile += `${view}\n`)


//makes routes array
const routes = []
views.forEach(view => {
    view = view.replace(/\.html$/,'')

    if(view === 'index'){
        routes.push({
            path:'/',
            component:view  
        })
        return
    }

    routes.push({
      path:`/${view}`,
      component:view  
    })
})


//adds the global component var
jsViewsFile += "let component;\n"


//adds the router
jsViewsFile += `const setComponent = (path) => {
    switch(path){
`

routes.forEach(route => {
    jsViewsFile += "        case '" + route.path + "':\n"
    jsViewsFile += `        component = ${route.component}\n`
    jsViewsFile += "        break;\n\n"
})

jsViewsFile += "    }\n"
jsViewsFile += "}\n"

jsViewsFile += "const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';"

//adds router logic
jsViewsFile += `
const router = () => {
    const path = parseLocation();
    setComponent(path)
    document.getElementById('app').innerHTML = component;
};
`

jsViewsFile += `
window.addEventListener('hashchange', router);
window.addEventListener('load', router);`


//writes file
fs.writeFileSync(`${root}/${options.output}/router.js`,jsViewsFile)