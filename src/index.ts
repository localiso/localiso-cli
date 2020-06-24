#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const axios = require('axios');

console.log(
    chalk.blue(
        figlet.textSync('phrases-generator', {horizontalLayout: 'full'})
    )
);

program
    .version('0.0.1')
    .description("An example CLI for ordering pizza's")
    .requiredOption('-t, --tenant <tenant>', 'Your tenant')
    .requiredOption('-p, --projectId <projectId>', 'Your projectId')
    .requiredOption('-pl, --platformId <platformId>', 'Your platformId')
    .option('-kp, --keysPath <keysPath>', 'Your keysPath')
    .option('-tp, --translationPath <translationPath>', 'Your translationPath')
    .parse(process.argv);

const publicApiEndpoint = 'http://{tenant}.phrases.wildlabs.io/pub-api/translations/{projectId}?platformIds[]={platformId}'


let url = encodeURI(
    publicApiEndpoint
        .replace('{tenant}', program.tenant)
        .replace('{projectId}', program.projectId)
        .replace('{platformId}', program.platformId)
);

console.log(chalk.blue('Endpoint: ' + url));

axios.get(url)
    .then((response: any) => {
        var data = response.data;
        console.log(data);
    })
    .catch((error: any) => {
        console.log(error);
    });

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
