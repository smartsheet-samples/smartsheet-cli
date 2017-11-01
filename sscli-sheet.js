#!/usr/bin/env node

var program = require('commander');

program
    .option('-f, --format [type]', 'The sheet format (either json or csv)');

program
    .command('create')
    .action(function () {
        console.log("\n\nCreating a sheet\n\n");
        console.log('Available information:');
        console.log(program.args);
    });

program
    .command('export [sheet-id]')
    .action(function () {
        console.log('Available information:');
        console.log(program.args);
    });

program
    .command('import')
    .action(function () {
        console.log('Available information:');
        console.log(program.args);
    });

program
    .parse(process.argv);
