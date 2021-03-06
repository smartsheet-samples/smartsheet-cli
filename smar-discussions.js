#!/usr/bin/env node
const discussions = require('./lib/discussions.js');
var program = require('commander');

program
    .command('list')
    .option('--sheet-id [id]', 'This is the id of your sheet')
    .option('--include-flags [include]', 'Comma separated flags you want to include. e.g. comments,attachments')
    .action(function () {
        const info = program.args[program.args.length-1];
        discussions.listDiscussions(info.sheetId, info.includeFlags);
    });

program
    .command('create')
    .option('--sheet-id [id]', 'This is the id of your sheet')
    .option('--title [title]', 'This is the title of your new discussion')
    .option('--comment [comment]', 'This is your desired comment')
    .action(function () {
        const info = program.args[program.args.length-1];
        discussions.createDiscussion(info.sheetId, info.title, info.comment);
    })

program
    .parse(process.argv);
