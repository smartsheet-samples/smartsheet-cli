#!/usr/bin/env node
const comments = require('./lib/comments.js');
var program = require('commander');

program
    .command('add')
    .option('--sheet-id [id]', 'This is the id of your sheet')
    .option('--discussion-id [id]', 'This is the id of your comment')
    .option('--comment [comment]', 'This is the comment you will add')
    .action(function () {
        const info = program.args[program.args.length-1];
        comments.addComment(info.sheetId, info.discussionId, info.comment);
    });

program
    .parse(process.argv);
