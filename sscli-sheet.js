#!/usr/bin/env node
const sheet = require('./lib/sheet.js');
var program = require('commander');

function collect(val, memo) {
  memo.push(val);
  return memo;
}

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
    .option('--column [column]', 'The different columns', collect, [])
    .option('--primary [columnName]', 'Make columnName your primary column')
    .action(function () {
        const info = program.args[program.args.length-1];
        if (!info.primary){
            console.log("You must specify one primary column.")
        } else {
            sheet.createSheet(info.sheetName, info.column, info.primary);
        }
    });

program
    .command('list')
    .action(function () {
        sheet.listSheets()
    });

program
    .command('import')
    .action(function () {
        console.log('Available information:');
        console.log(program.args);
    });

program
    .parse(process.argv);
