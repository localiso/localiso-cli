#!/usr/bin/env node
"use strict";
var chalk = require('chalk');
var figlet = require('figlet');
var path = require('path');
var program = require('commander');
var axios = require('axios');
var fs = require('fs');
console.log(chalk.blue(figlet.textSync('phrases-generator', { horizontalLayout: 'full' })));
program
    .version('0.0.1')
    .description("An example CLI for ordering pizza's")
    .requiredOption('-a, --accessToken <accessToken>', 'Your accessToken')
    .requiredOption('-t, --tenant <tenant>', 'Your tenant')
    .requiredOption('-p, --projectId <projectId>', 'Your projectId')
    .requiredOption('-pl, --platformId <platformId>', 'Your platformId')
    .requiredOption('-ff, --fileFormat <format>', 'Your fileFormat')
    .requiredOption('-fp, --filePath <format>', 'Your filePath')
    .parse(process.argv);
var publicApiEndpoint = 'http://{tenant}.phrases.wildlabs.io/pub-api/translations/{projectId}?platformIds[]={platformId}';
var url = encodeURI(publicApiEndpoint
    .replace('{tenant}', program.tenant)
    .replace('{projectId}', program.projectId)
    .replace('{platformId}', program.platformId));
console.log(chalk.blue('Endpoint: ' + url));
axios.get(url, {
    headers: {
        'Access-Token': program.accessToken
    }
})
    .then(function (response) {
    var data = response.data;
    switch (program.fileFormat) {
        case 'typescript-enum':
            typescriptEnum(data, program.filePath);
            break;
        case 'json':
            json(data, program.filePath);
            break;
        case 'java-enum':
            javaEnum(data, program.filePath);
            break;
        case 'java-properties':
            javaProperties(data, program.filePath);
            break;
        default:
            throw "Formatter not supported";
    }
})
    .catch(function (error) {
    console.log(error);
});
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
function typescriptEnum(response, path) {
    var keysFileContent = 'export class I18nKeys {\n';
    response.translationKeys.forEach(function (translationKey) {
        var identifier = translationKey.key.toUpperCase();
        var regEx = new RegExp('\\.', "g");
        identifier = identifier.replace(regEx, '_');
        keysFileContent += '    static ' + identifier + ' = \'' + translationKey.key + '\'\n';
    });
    keysFileContent += "}";
    fs.writeFile(path, keysFileContent, function (err) {
        if (err) {
            return console.log(chalk.red(err));
        }
        console.log(chalk.green("The file was saved (" + path + ")!"));
    });
}
function javaEnum(response, path) {
    var keysFileContent = 'package io.wildlabs.phrases.infrastructure.config; \n\npublic enum I18nKey {\n';
    response.translationKeys.forEach(function (translationKey) {
        var identifier = translationKey.key.toUpperCase();
        var regEx = new RegExp('\\.', "g");
        identifier = '  ' + identifier.replace(regEx, '_');
        keysFileContent += identifier + ',\n';
    });
    keysFileContent += "}";
    fs.writeFile(path, keysFileContent, function (err) {
        if (err) {
            return console.log(chalk.red(err));
        }
        console.log(chalk.green("The file was saved (" + path + ")!"));
    });
}
function javaProperties(response, path) {
    response.languages.forEach(function (language) {
        var languageFileContent = '';
        language.translationEntries.forEach(function (translationEntry, key) {
            languageFileContent += translationEntry.key + '=' + translationEntry.value + '\n';
        });
        fs.writeFile(path + '/messages_' + language.locale.languageTag.replace('-', '_') + '.properties', languageFileContent, function (err) {
            if (err) {
                return console.log(err);
            }
        });
        console.log("The file was saved!");
    });
}
function json(response, path) {
    response.languages.forEach(function (language) {
        var languageFileContent = '{\n';
        language.translationEntries.forEach(function (translationEntry, key) {
            languageFileContent += '    "' + translationEntry.key + '": "' + translationEntry.value + '"';
            if (key < language.translationEntries.length - 1) {
                languageFileContent += ',';
            }
            languageFileContent += '\n';
        });
        languageFileContent += '}';
        fs.writeFile(path + '/' + language.locale.languageTag + '.json', languageFileContent, function (err) {
            if (err) {
                return console.log(err);
            }
        });
        console.log("The file was saved!");
    });
}
