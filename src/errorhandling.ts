const root = require('app-root-path').path;

import options from './options'
import fs from 'fs'
import chalk from 'chalk'
import path from 'path'

const error = (message:string) => {
    console.error(chalk.red(`Router Maker Error: ${message}`));
    process.exit();
}

//checks for input path
if(!fs.existsSync(options.input)){
    error(`Input path ${path.resolve(root + '/' + options.input)} not found.`)
}

//checks for output path
if(!fs.existsSync(options.output)){
    error(`Output path ${path.resolve(root + '/' + options.output)} not found.`)
}

//checks if no html files in input dir
if(fs.readdirSync(options.input).filter(filename => /\.html$/.test(filename)).length <= 0){
    error(`No html files found in ${path.resolve(root + '/' + options.input)}`)
}