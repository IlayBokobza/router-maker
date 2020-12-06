const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

let options = {
    output:'',
    input:'views',
    watch:false
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

export default options 