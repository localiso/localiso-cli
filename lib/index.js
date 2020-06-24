#!/usr/bin/env node
"use strict";
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var program = require('commander');
var axios = require('axios');
console.log(chalk.blue(figlet.textSync('phrases-generator', { horizontalLayout: 'full' })));
program
    .version('0.0.1')
    .description("An example CLI for ordering pizza's")
    .requiredOption('-t, --tenant <tenant>', 'Your tenant')
    .requiredOption('-p, --projectId <projectId>', 'Your projectId')
    .requiredOption('-pl, --platformId <platformId>', 'Your platformId')
    .option('-kp, --keysPath <keysPath>', 'Your keysPath')
    .option('-tp, --translationPath <translationPath>', 'Your translationPath')
    .parse(process.argv);
var publicApiEndpoint = 'http://{tenant}.phrases.wildlabs.io/pub-api/translations/{projectId}?platformIds[]={platformId}';
var url = encodeURI(publicApiEndpoint
    .replace('{tenant}', program.tenant)
    .replace('{projectId}', program.projectId)
    .replace('{platformId}', program.platformId));
console.log(chalk.blue('Endpoint: ' + url));
axios.get(url)
    .then(function (response) {
    var data = response.data;
    console.log(data);
})
    .catch(function (error) {
    console.log(error);
});
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
