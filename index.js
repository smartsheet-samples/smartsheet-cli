#!/usr/bin/env node

var package = require('./package.json');
var program = require('commander');
var path = require('path');
var lib = path.join(__dirname, './lib');

program
    .version(package.version);

program
    .command('auth')
    .option('-f, --force', 'Force reauthentication')
    .description('this isn\'t ready yet. but when it is, you will be able to authenticate the Smartsheet API (add \'-f\' to force reauthentication)')
    .action(require(lib + '/auth'));

program
    .command('whoami')
    .description('shows which smartsheet account you\'re connected to')
    .action(require(lib + '/whoami'));
    
program
    .command('*')
    .action(function (argv) {
        console.log('\'sscli %s\' is not a valid command use \'sscli -h\' for help', argv);
        process.exit(2);
    });
    
program.on('--help', function () {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ sscli sheet export <sheet-id> --format <format> --filename <filename>');
    console.log('');
});
    
program.parse(process.argv);
