import {Command, flags} from '@oclif/command'
import axios from 'axios'
import * as fs from 'fs'
import * as chalk from 'chalk'

const supportedFileFormats = [
  'typescript-enum',
  'json',
  'dart-json',
  'java-enum',
  'dart-enum',
  'java-properties',
]

export default class Sync extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    tenant: flags.string({char: 't', required: true, description: 'Your tenant'}),
    accessToken: flags.string({char: 'a', required: true, description: 'Your accessToken'}),
    projectId: flags.integer({char: 'p', required: true, description: 'Your projectId'}),
    platformId: flags.integer({required: true, description: 'Your platformId'}),
    fileFormat: flags.enum({options: supportedFileFormats, required: true, description: 'Your fileFormat'}),
    filePath: flags.string({required: true, description: 'Your filePath'}),
  }

  async run() {
    const {flags} = this.parse(Sync)

    const publicApiEndpoint = 'http://{tenant}.localiso.co/pub-api/translations/{projectId}?platformIds[]={platformId}'
    const url = encodeURI(
      publicApiEndpoint
      .replace('{tenant}', flags.tenant)
      .replace('{projectId}', flags.projectId.toLocaleString())
      .replace('{platformId}', flags.platformId.toLocaleString())
    )
    axios.get(url, {headers: {'Access-Token': flags.accessToken}}).then(response => {
      switch (flags.fileFormat) {
      case 'typescript-enum':
        this.typescriptEnum(response.data, flags.filePath)
        break
      case 'json':
        this.json(response.data, flags.filePath)
        break
      case 'dart-json':
        this.dartJson(response.data, flags.filePath)
        break
      case 'java-enum':
        this.javaEnum(response.data, flags.filePath)
        break
      case 'dart-enum':
        this.dartEnum(response.data, flags.filePath)
        break
      case 'java-properties':
        this.javaProperties(response.data, flags.filePath)
        break
      default:
        throw new Error('Formatter not supported')
      }
    })
  }

  typescriptEnum(response: any, path: string) {
    let keysFileContent = 'export class I18nKeys {\n'

    response.translationKeys.forEach(function (translationKey: any) {
      let identifier = translationKey.key.toUpperCase()
      const regEx = new RegExp('\\.', 'g')
      identifier = identifier.replace(regEx, '_')
      keysFileContent += '    static ' + identifier + ' = \'' + translationKey.key + '\'\n'
    })

    keysFileContent += '}'

    fs.writeFile(path, keysFileContent, (err: any) => {
      if (err) {
        this.log(chalk.red(err))
      }

      this.log(chalk.green('The file was saved (' + path + ')!'))
    })
  }

  dartEnum(response: any, path: string) {
    let keysFileContent = 'class I18n {\n'

    response.translationKeys.forEach(function (translationKey: any) {
      let identifier = translationKey.key.toUpperCase()
      const regEx = new RegExp('\\.', 'g')
      identifier = identifier.replace(regEx, '_')
      keysFileContent += '    static const String ' + identifier + ' = \'' + translationKey.key + '\';\n'
    })

    keysFileContent += '}'

    fs.writeFile(path, keysFileContent, (err: any) => {
      if (err) {
        return this.log(chalk.red(err))
      }

      this.log(chalk.green('The file was saved (' + path + ')!'))
    })
  }

  javaEnum(response: any, path: string) {
    let keysFileContent = 'package io.wildlabs.phrases.infrastructure.config; \n\npublic enum I18nKey {\n'

    response.translationKeys.forEach(function (translationKey: any) {
      let identifier = translationKey.key.toUpperCase()
      const regEx = new RegExp('\\.', 'g')
      identifier = '  ' + identifier.replace(regEx, '_')
      keysFileContent += identifier + ',\n'
    })

    keysFileContent += '}'

    fs.writeFile(path, keysFileContent, (err: any) => {
      if (err) {
        return this.log(chalk.red(err))
      }

      this.log(chalk.green('The file was saved (' + path + ')!'))
    })
  }

  javaProperties(response: any, path: string) {
    response.languages.forEach((language: any) => {
      let languageFileContent = ''

      language.translationEntries.forEach(function (translationEntry: any, _key: any) {
        languageFileContent += translationEntry.key + '=' + translationEntry.value + '\n'
      })

      fs.writeFile(path + '/messages_' + language.locale.languageTag.replace('-', '_') + '.properties', languageFileContent, (err: any) => {
        if (err) {
          return this.log(err)
        }
      })

      this.log('The file was saved!')
    })
  }

  json(response: any, path: string) {
    response.languages.forEach((language: any) => {
      let languageFileContent = '{\n'

      language.translationEntries.forEach(function (translationEntry: any, key: any) {
        languageFileContent += '    "' + translationEntry.key + '": "' + translationEntry.value + '"'
        if (key < language.translationEntries.length - 1) {
          languageFileContent += ','
        }

        languageFileContent += '\n'
      })

      languageFileContent += '}'

      fs.writeFile(path + '/' + language.locale.languageTag + '.json', languageFileContent, (err: any) => {
        if (err) {
          return this.log(err)
        }
      })

      this.log('The file was saved!')
    })
  }

  dartJson(response: any, path: string): void {
    response.languages.forEach((language: any) => {
      let languageFileContent = '[\n'

      language.translationEntries.forEach(function (translationEntry: any, key: any) {
        languageFileContent += '{"key" : "' + translationEntry.key + '",\n  "value" : "' + translationEntry.value + '"}'

        if (key < language.translationEntries.length - 1) {
          languageFileContent += ','
        }

        languageFileContent += '\n'
      })

      languageFileContent += ']'

      fs.writeFile(path + '/' + language.locale.languageTag + '.json', languageFileContent, (err: any) => {
        if (err) {
          return this.log(err)
        }
      })

      this.log('The file was saved!')
    })
  }
}
