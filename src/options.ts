const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const rootPath = require('app-root-path').path
import chalk from 'chalk'
import { createConfigFile } from './createConfigFile'
import fs from 'fs'


//create a config file
if(argv.init){
    createConfigFile()
    console.log(chalk.blueBright('Created Confige File'))
    process.exit()
}

let options:{
    output:string,
    input:string,
    appId:string,
    watch:boolean,
    moduleBundler:boolean,
    addClassToActiveLinks:boolean,
    activeLinksClass:string,
    concatFile:boolean
};

if(fs.existsSync(`${rootPath}/routerconfig.js`)){
    options = require(`${rootPath}/routerconfig.js`)

    if(!options.output) options.output = './'
    if(!options.input) options.input = './views'
    if(!options.appId) options.appId = 'app'
    if(!options.moduleBundler) options.moduleBundler = false
    if(!options.addClassToActiveLinks) options.addClassToActiveLinks = false
    if(!options.activeLinksClass) options.activeLinksClass = 'active'
    if(!options.concatFile) options.concatFile = false

}else{
    options = {
        output:'./',
        input:'./views',
        appId:'app',
        watch:false,
        moduleBundler:false,
        addClassToActiveLinks:false,
        activeLinksClass:'active',
        concatFile:false
    }
    
    //output path
    if(argv.output){
        options.output = argv.output
    }
    
    //input path
    if(argv.input){
        options.input = argv.input
    }
    
    //package with module bundler
    if(argv.packageWithModuleBundler || argv.pwmb){
        options.moduleBundler = true
    }
    
    //change main id
    if(argv.appId){
        options.appId = argv.appId
    }
    
}

//watch mode
options.watch = false
if(argv.w){
    options.watch = true
}

export default options    