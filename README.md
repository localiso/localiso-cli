@localiso/localiso-cli
======================

Localiso CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Build Status](https://travis-ci.org/localiso/localiso-cli.svg?branch=master)](https://travis-ci.org/localiso/localiso-cli)
[![Version](https://img.shields.io/npm/v/@localiso/localiso-cli.svg)](https://npmjs.org/package/@localiso/localiso-cli)
[![Codecov](https://codecov.io/gh/localiso/localiso-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/localiso/localiso-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@localiso/localiso-cli.svg)](https://npmjs.org/package/@localiso/localiso-cli)
[![License](https://img.shields.io/npm/l/@localiso/localiso-cli.svg)](https://github.com/localiso/localiso-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @localiso/localiso-cli
$ localiso-cli COMMAND
running command...
$ localiso-cli (-v|--version|version)
@localiso/localiso-cli/0.0.8 darwin-x64 node-v10.16.0
$ localiso-cli --help [COMMAND]
USAGE
  $ localiso-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`localiso-cli autocomplete [SHELL]`](#localiso-cli-autocomplete-shell)
* [`localiso-cli help [COMMAND]`](#localiso-cli-help-command)
* [`localiso-cli sync`](#localiso-cli-sync)
* [`localiso-cli update [CHANNEL]`](#localiso-cli-update-channel)

## `localiso-cli autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ localiso-cli autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ localiso-cli autocomplete
  $ localiso-cli autocomplete bash
  $ localiso-cli autocomplete zsh
  $ localiso-cli autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

## `localiso-cli help [COMMAND]`

display help for localiso-cli

```
USAGE
  $ localiso-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `localiso-cli sync`

describe the command here

```
USAGE
  $ localiso-cli sync

OPTIONS
  -a, --accessToken=accessToken                                                      (required) Your accessToken
  -h, --help                                                                         show CLI help
  -p, --projectId=projectId                                                          (required) Your projectId
  -t, --tenant=tenant                                                                (required) Your tenant
  --fileFormat=(typescript-enum|json|dart-json|java-enum|dart-enum|java-properties)  (required) Your fileFormat
  --filePath=filePath                                                                (required) Your filePath
  --platformId=platformId                                                            (required) Your platformId
```

_See code: [src/commands/sync.ts](https://github.com/localiso/localiso-cli/blob/v0.0.8/src/commands/sync.ts)_

## `localiso-cli update [CHANNEL]`

update the localiso-cli CLI

```
USAGE
  $ localiso-cli update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.10/src/commands/update.ts)_
<!-- commandsstop -->
