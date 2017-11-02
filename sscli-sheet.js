#!/usr/bin/env node
const sheet = require('./lib/sheet.js');
var program = require('commander');

program
    .option('-f, --format [type]', 'The sheet format (either json or csv)');

program
    .command('get')
    .option('--sheet-id [id]', 'This is the name of your sheet')
    .option('--csv', 'Get the sheet as a CSV file')
    .option('--pdf', 'Get the sheet as a PDF file')
    .option('--excel', 'Get the sheet as an Excel file')
    .action(function () {
        const info = program.args[program.args.length-1];
        sheet.getSheet(info.sheetId, info.csv, info.pdf, info.excel);
    });

program
    .command('create')
    .option('--sheet-name [name]', 'This is the name of your sheet')
    .action(function () {
        const info = program.args[program.args.length-1];
        sheet.createSheet(info.sheetName);
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
