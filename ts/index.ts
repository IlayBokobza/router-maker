#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const root = require('app-root-path').path;
const chalk = require('chalk')
import options from './options'

//gets all html files
let views:string[] = [];
let jsViewsFile:string = "";

const main = () => {

    views = fs.readdirSync(`${root}/${options.input}`).filter((file: string) => {
        const regEx = /\.html$/
        return regEx.test(file)
    })

    jsViewsFile = `if(!document.getElementById('app')){
        document.querySelector('body')?.innerHTML += "<div id=app></div>"}\n`
    
    //gets to body from the html files and adds to to the file
    try {
        views.map(view => "const " + view.replace(/\.html$/,'') + " = `" + fs.readFileSync(`${root}/${options.input}/${view}`).toString()
        .match(/<body>(.*?)<\/body>/gs,'').toString()
        .replace(/<body>|<\/body>/g,'')
        .trim() + "`")
        .forEach(view => jsViewsFile += `${view}\n`)
    }catch{}
    
    
    //makes routes array
    const routes:{
        path:string,
        component:string
    }[] = [];
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
    
    
    //adds the global component var and the start of the router
    jsViewsFile += `let component;
const setComponent = (path) => {
    switch(path){\n`

    //ands a case for each view
    routes.forEach(route => {
        jsViewsFile += "        case '" + route.path + "':\n"
        jsViewsFile += `        component = ${route.component}\n`
        jsViewsFile += "        break;\n\n"
    })
    
    //adds the router logic and closes off the router
    jsViewsFile += `    }
}
const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
const router = () => {
    const path = parseLocation();
    setComponent(path)
    document.getElementById('app').innerHTML = component;
};
window.addEventListener('hashchange', router);
window.addEventListener('load', router);`
}


if(options.watch){
    main()
    views.forEach(fileName => {
        fs.watch(`${options.input}/${fileName}`,() => {
            main()
            //writes file
            fs.writeFileSync(`${root}/${options.output}/router.js`,jsViewsFile)
            console.log(chalk.green('Change Detected. Writing File'))
        })
    })
}else{
    main()
    //writes file
    console.log(chalk.green('Writing file'))
    fs.writeFileSync(`${root}/${options.output}/router.js`,jsViewsFile)
}