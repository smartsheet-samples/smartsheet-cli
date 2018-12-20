#!/usr/bin/env node
const sheet = require('./lib/sheet.js');
const program = require('commander');

function collect(val, memo) {
  memo.push(val);
  return memo;
}

program
    .command('get')
    .option('--sheet-id [id]', 'This is the id of your sheet')
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
    .option('--column [column]', 'A column and type that you want to add.  e.g. Comment,TEXT_NUMBER', collect, [])
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
    .option('--include-flags [include]', '(Optional) Comma separated flags you want to include. e.g. ownerInfo,sheetVersion,source')
    .option('--modified-since [modifiedSince]', '(Optional) Response only includes the objects that are modified on or after the date and time specified e.g. 2015-06-05T20:05:43Z')
    .action(function () {
        const info = program.args[program.args.length-1];
        sheet.listSheets(info.includeFlags, info.modifiedSince);
    });

program
    .parse(process.argv);
