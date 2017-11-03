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
    .command('attachments [subcommand]', 'Attachment-centric commands')
    .command('discussions [subcommand]', 'Discussion-oriented commands')
    .command('comments [subcommand]', 'Commands related to comments');

program
    .command('auth')
    .option('-f, --force', 'Force reauthentication')
    .description('this isn\'t ready yet. but when it is, you will be able to authenticate the Smartsheet API (add \'-f\' to force reauthentication)')

program
    .command('whoami')
    .description('shows which smartsheet account you\'re connected to');

// program
//     .command('*')
//     .action(function (argv) {
//         console.log('\'sscli %s\' is not a valid command use \'sscli -h\' for help', argv);
//         process.exit(2);
//     });

program.on('--help', function () {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ sscli sheet get --sheet-id <sheet-id> --csv --pdf --excel');
    console.log('    $ sscli sheet create --sheet-name "Breakfast" --column Food,TEXT_NUMBER --column Drink,TEXT_NUMBER --primary Food');
    console.log('    $ sscli row   export <row-ids>  --format <format> --filename <filename>');
    console.log('    $ sscli attachments upload --sheet-id <sheet-id> --file /Users/bacon/Downloads/fryingpan.jpg')
    console.log('    $ sscli discussions list --sheet-id <sheet-id> --include-flags comments')
    console.log('    $ sscli comments add --sheet-id <sheet-id> --discussion-id <discussion-id> --comment "Recipe for delicious breakfast"')
    console.log('');
});

program.parse(process.argv);
