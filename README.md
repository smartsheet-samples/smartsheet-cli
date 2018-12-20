# Smartsheet-CLI
This is a tool that allows you to interact with Smartsheet without leaving the command line.

To get it installed, run the following command on the command-line:

    npm install -g smartsheet-cli

Then, to use the cli use the `smar` command. To login run:

    smar auth login

To get the rest of the command/subcommand combinations run:

    smar --help


Currently, here are the functions that can be accomplished with the Smartsheet-CLI:

* Sheets
    * Create sheet
    * Get sheet
    * List sheets
* Rows
    * Get row
    * Add row
* Discussions
    * List discussions
    * Create discussion
* Users
    * Add
    * Update
    * Delete
    * List
* Auth
    * Login (OAuth)
    * Logout
* Attachments
    * List
    * Get
    * Upload
    * Delete
* WhoAmI
    * Displays info for the current user