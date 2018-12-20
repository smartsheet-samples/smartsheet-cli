#!/usr/bin/env node
const row = require('./lib/row.js');
var program = require('commander');

function collect(val, memo) {
    memo.push(val);
    return memo;
}

program
    .command('get')
    .option('--sheet-id [sheetId]', 'Required. The id of the sheet whose rows we want to get.')
    .option('--row-ids [rowIds]', 'Required. A comma-delimited list of sheet row IDs.')
    .option('--output-file [outputFilePath]', 'Required. The full file path where successful API response should be saved. Assume stdout if not provided.')
    .option('--stdout', 'Optional. Stream successful response to stdout no matter if it is also being saved to an output file.')
    .action(function () {
        const info = program.args[program.args.length - 1];
        if (!info.sheetId){
            console.log("You must specify a value for the --sheet-id parameter.");
        } else if (!info.rowIds){
            console.log("You must specify a value for the --row-ids parameter.");
        } else if (!info.outputFile){
            console.log("You must specify a value for the --output-file parameter.");
        } else {
            row.getRows(info.sheetId, info.rowIds, info.outputFile, info.stdout);
        }
    });

program
    .command('add')
    .option('--sheet-id [sheetId]', 'Required. The id of the sheet where to add rows')
    .option('--input-file [inputFilePath]', 'Required. The full path to the file containing the rows to be added.')
    .option('--output-file [outputFilePath]', 'Optional. The full file path where successful API response should be saved. Assume stdout if not provided.')
    .option('--stdout', 'Optional. Stream successful response to stdout no matter if it is also being saved to an output file.')
    .action(function () {
        const info = program.args[program.args.length-1];
        if (!info.sheetId){
            console.log("You must specify a value for the --sheet-id parameter.");
        } else if (!info.inputFile){
            console.log("You must specify a value for the --input-file parameter.");
        } else {
            row.addRows(info.sheetId, info.inputFile, info.outputFile, info.stdout);
        }
    });

program
    .parse(process.argv);
