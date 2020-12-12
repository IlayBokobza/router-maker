const fs = require('fs')
const path = require('app-root-path').path

const file = `module.exports = {
    output:'./',              // The path to create the router file
    input:'./views',          // The path to your html file for your pages
    appId:'app',              // The id of the div that all the content from your html pages go to
    moduleBundler:false,      // Change it if you want to package your router with a module bundler
}`

export const createConfigFile = () => fs.writeFileSync(`${path}/routerconfig.js`,file)