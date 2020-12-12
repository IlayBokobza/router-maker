#!/usr/bin/env node
const root = require('app-root-path').path;
import fs from 'fs'
import chalk from 'chalk'
import options from './options'

//gets all html files
let views:string[] = [];
let jsViewsFile:string = "";

const main = () => {

    //runs error handling
    require('./errorhandling')

    views = fs.readdirSync(`${root}/${options.input}`).filter((file: string) => {
        const regEx = /\.html$/
        return regEx.test(file)
    })

    jsViewsFile = `if(!document.getElementById('${options.appId}')){
        document.querySelector('body').innerHTML += '<div id="${options.appId}"></div>'}\n`
    
    //gets to body from the html files and adds to to the file
    try {
        let fileVars = views.map(view => "const " + view.replace(/\.html$/,'') + " = `" + fs.readFileSync(`${root}/${options.input}/${view}`).toString()
        .match(/<body>(.*?)<\/body>/gs)?.toString()
        .replace(/<body>|<\/body>/g,'')
        .trim() + "`")
        
        fileVars = fileVars.filter(fileVar => !fileVar.match(/`undefined`$/))

        if(fileVars.length <= 0){
            console.error(chalk.red('Router Maker Error: No html files with a body tag were found'))
            process.exit()
        }

        fileVars.forEach(view => jsViewsFile += `${view}\n`)
        
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
    document.getElementById('${options.appId}').innerHTML = component;
};`
if(options.moduleBundler){
    jsViewsFile += `
export const packageWithModuleBundler = () => {
    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);
}`
}else{
    jsViewsFile += `
window.addEventListener('hashchange', router);
window.addEventListener('load', router);`
}
}

//if in watch mode
if(options.watch){
    //makes file
    main()
    //add change listeners for files
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