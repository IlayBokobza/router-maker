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
        document.querySelector('body').innerHTML += '<div id="${options.appId}"></div>'};\n`
    
    //gets to body from the html files and adds to to the file
    try {
        let fileVars = views.map(view => "const " + view.replace(/\.html$/,'') + " = `" + fs.readFileSync(`${root}/${options.input}/${view}`).toString()
        .match(/<body>(.*?)<\/body>/gs)?.toString()
        .replace(/<body>|<\/body>/g,'')
        .replace(/(\r\n|\n|\r)/gm,"").trim() + "`;")
        
        fileVars = fileVars.filter((fileVar,index) => {
            if(/`undefined`$/.test(fileVar)){
                views.splice(index,1)
                return false
            }
            return true
        })

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
        jsViewsFile += `        component = ${route.component};\n`
        jsViewsFile += "        break;\n\n"
    })
    
    jsViewsFile += '    };\n};'

    //active link class adder function
    if(options.addClassToActiveLinks) jsViewsFile += `\nconst setLinks = (path) => {
        const links = [...document.querySelectorAll('a')];
        links.forEach(link => link.classList.remove('${options.activeLinksClass}'));
        links.filter(link => link.hash.replace(/#/,'') === path).forEach(link => link.classList.add('${options.activeLinksClass}'));
    }`

    //adds the router logic
    jsViewsFile += `
const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
const router = () => {
    const path = parseLocation();
    setComponent(path);\n`

    //calls the function thats add classes to active links
    if(options.addClassToActiveLinks) jsViewsFile += `    setLinks(path);`

    jsViewsFile += `
    document.getElementById('${options.appId}').innerHTML = component;
};`

    // if user wants to package with moudle bundlers
    if(options.moduleBundler){
        jsViewsFile += `
export const packageWithModuleBundler = () => {
    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);
};`
    // if not
    }else{
        jsViewsFile += `
window.addEventListener('hashchange', router);
window.addEventListener('load', router);`
    }

    //concat file if user wants
    if(options.concatFile) jsViewsFile = jsViewsFile.replace(/(\r\n|\n|\r)/gm,"")
}

const startUp = async () => {
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
        fs.writeFileSync(`${root}/${options.output}/router.js`,jsViewsFile)
        console.log(chalk.green('Writing file'))
    }
}

startUp()