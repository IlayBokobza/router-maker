const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

let options:{
    output:string,
    input:string,
    appId:string,
    watch:boolean,
    moduleBundler:boolean,
} = {
    output:'',
    input:'views',
    appId:'app',
    watch:false,
    moduleBundler:false,
}

if(argv.output){
    options.output = argv.output
}

if(argv.input){
    options.input = argv.input
}

if(argv.w){
    options.watch = true
}

if(argv.packageWithModuleBundler || argv.pwmb){
    options.moduleBundler = true
}

if(argv.appId){
    options.appId = argv.appId
}

export default options 