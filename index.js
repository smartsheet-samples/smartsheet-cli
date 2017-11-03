#!/usr/bin/env node

const package = require('./package.json');
const program = require('commander');
const path = require('path');
const lib = path.join(__dirname, './lib');
// WARNING: If you use .action it will break all sub commands
program
    .version(package.version);

program
    .command('sheet [subcommand]', 'Commands for working with sheets')
    .command('row   [subcommand]', 'Commands for working with rows')
    .command('auth  [subcommand]', 'Authorization')
    .command('user [subcommand]', 'User functions')
    .command('search [searchterm]', 'Search your Smartsheet account')
    .command('attachments [subcommand]', 'Attachment-centric commands')
    .command('discussions [subcommand]', 'Discussion-oriented commands')
    .command('comments [subcommand]', 'Commands related to comments')
    .command('whoami', 'shows which smartsheet account is connected');
    
program.on('--help', function () {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ sscli sheet export <sheet-id> --format <format> --filename <filename>');
    console.log('    $ sscli row   export <row-ids>  --format <format> --filename <filename>');
    console.log('');
});

program.parse(process.argv);
