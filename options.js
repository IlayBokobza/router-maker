const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

let options = {
    output:'',
    input:'views'
}

if(argv.output){
    options.output = argv.output
}

if(argv.input){
    options.input = argv.input
}

module.exports = options