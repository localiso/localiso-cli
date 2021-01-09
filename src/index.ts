#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const axios = require('axios');
const fs = require('fs');

console.log(
    chalk.blue(
        figlet.textSync('localiso-cli (Yeah!)', {horizontalLayout: 'full'})
    )
);

program
    .version('0.0.1')
    .description("The localiso cli lets you manage your translation files from the command line.")
    .requiredOption('-a, --accessToken <accessToken>', 'Your accessToken')
    .requiredOption('-t, --tenant <tenant>', 'Your tenant')
    .requiredOption('-p, --projectId <projectId>', 'Your projectId')
    .requiredOption('-pl, --platformId <platformId>', 'Your platformId')
    .requiredOption('-ff, --fileFormat <format>', 'Your fileFormat')
    .requiredOption('-fp, --filePath <format>', 'Your filePath')
    .parse(process.argv);

const publicApiEndpoint = 'http://{tenant}.localiso.co/pub-api/translations/{projectId}?platformIds[]={platformId}'

let url = encodeURI(
    publicApiEndpoint
        .replace('{tenant}', program.tenant)
        .replace('{projectId}', program.projectId)
        .replace('{platformId}', program.platformId)
);

console.log(chalk.blue('Endpoint: ' + url));

axios.get(url, {
    headers: {
        'Access-Token': program.accessToken
    }
})
    .then((response: any) => {
        var data = response.data;
        switch (program.fileFormat) {
            case 'typescript-enum':
                typescriptEnum(data, program.filePath);
                break;
            case 'json':
                json(data, program.filePath);
                break;
            case 'dart-json':
                dartJson(data, program.filePath);
                break;
            case 'java-enum':
                javaEnum(data, program.filePath);
                break;
            case 'dart-enum':
                dartEnum(data, program.filePath);
                break;
            case 'java-properties':
                javaProperties(data, program.filePath);
                break;
            default:
                throw "Formatter not supported";
        }
    })
    .catch((error: any) => {
        console.log(error);
    });

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

function typescriptEnum(response: any, path: string) {
    var keysFileContent = 'export class I18nKeys {\n';

    response.translationKeys.forEach(function (translationKey: any) {
        var identifier = translationKey.key.toUpperCase();
        const regEx = new RegExp('\\.', "g");
        identifier = identifier.replace(regEx, '_');
        keysFileContent += '    static ' + identifier + ' = \'' + translationKey.key + '\'\n';
    });

    keysFileContent += "}";

    fs.writeFile(path, keysFileContent, function (err: any) {
        if (err) {
            return console.log(chalk.red(err));
        }

        console.log(chalk.green("The file was saved (" + path + ")!"));
    });
}

function dartEnum(response: any, path: string) {
    var keysFileContent = 'class I18n {\n';

    response.translationKeys.forEach(function (translationKey: any) {
        var identifier = translationKey.key.toUpperCase();
        const regEx = new RegExp('\\.', "g");
        identifier = identifier.replace(regEx, '_');
        keysFileContent += '    static const String ' + identifier + ' = \'' + translationKey.key + '\';\n';
    });

    keysFileContent += "}";

    fs.writeFile(path, keysFileContent, function (err: any) {
        if (err) {
            return console.log(chalk.red(err));
        }

        console.log(chalk.green("The file was saved (" + path + ")!"));
    });
}

function javaEnum(response: any, path: string) {
    var keysFileContent = 'package io.wildlabs.phrases.infrastructure.config; \n\npublic enum I18nKey {\n';

    response.translationKeys.forEach(function (translationKey: any) {
        var identifier = translationKey.key.toUpperCase();
        const regEx = new RegExp('\\.', "g");
        identifier = '  ' + identifier.replace(regEx, '_');
        keysFileContent += identifier + ',\n';
    });

    keysFileContent += "}";

    fs.writeFile(path, keysFileContent, function (err: any) {
        if (err) {
            return console.log(chalk.red(err));
        }

        console.log(chalk.green("The file was saved (" + path + ")!"));
    });
}

function javaProperties(response: any, path: string) {
    response.languages.forEach(function (language: any) {
        var languageFileContent = '';

        language.translationEntries.forEach(function (translationEntry: any, key: any) {
            languageFileContent += translationEntry.key + '=' + translationEntry.value + '\n';
        });

        fs.writeFile(path + '/messages_' + language.locale.languageTag.replace('-', '_') + '.properties', languageFileContent, function (err: any) {
            if (err) {
                return console.log(err);
            }
        });


        console.log("The file was saved!");
    });
}


function json(response: any, path: string) {
    response.languages.forEach(function (language: any) {
        var languageFileContent = '{\n';

        language.translationEntries.forEach(function (translationEntry: any, key: any) {
            languageFileContent += '    "' + translationEntry.key + '": "' + translationEntry.value + '"';
            if (key < language.translationEntries.length - 1) {
                languageFileContent += ',';
            }

            languageFileContent += '\n'
        });

        languageFileContent += '}'

        fs.writeFile(path + '/' + language.locale.languageTag + '.json', languageFileContent, function (err: any) {
            if (err) {
                return console.log(err);
            }
        });


        console.log("The file was saved!");
    });
}

function dartJson(response: any, path: string) {
    response.languages.forEach(function (language: any) {
        var languageFileContent = '[\n';

        language.translationEntries.forEach(function (translationEntry: any, key: any) {
            languageFileContent += '{"key" : "' + translationEntry.key + '",\n  "value" : "' + translationEntry.value + '"}';

            if (key < language.translationEntries.length - 1) {
                languageFileContent += ',';
            }

            languageFileContent += '\n'
        });

        languageFileContent += ']'

        fs.writeFile(path + '/' + language.locale.languageTag + '.json', languageFileContent, function (err: any) {
            if (err) {
                return console.log(err);
            }
        });


        console.log("The file was saved!");
    });
}
