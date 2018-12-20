#!/usr/bin/env node

const package = require('./package.json');
const program = require('commander');
const path = require('path');
const lib = path.join(__dirname, './lib');
// WARNING: If you use .action it will break all sub commands
process.title = "smar";

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
    console.log('    $ smar sheet get --sheet-id <sheet-id> --csv --pdf --excel');
    console.log('    $ smar sheet create --sheet-name "Breakfast" --column Food,TEXT_NUMBER --column Drink,TEXT_NUMBER --primary Food');
    console.log('    $ smar row   export <row-ids>  --format <format> --filename <filename>');
    console.log('    $ smar attachments upload --sheet-id <sheet-id> --file /Users/bacon/Downloads/fryingpan.jpg')
    console.log('    $ smar discussions list --sheet-id <sheet-id> --include-flags comments')
    console.log('    $ smar comments add --sheet-id <sheet-id> --discussion-id <discussion-id> --comment "Recipe for delicious breakfast"')
    console.log('');
});

program.parse(process.argv);
