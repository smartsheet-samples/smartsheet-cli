# Smartsheet-CLI
This is a tool that allows you to interact with Smartsheet without leaving the command line.

As this is a **work in progress**, this is not yet available in the npmjs registry. So, to get it installed, clone this project, and then from the root of the project run: 

    npm install

And then run:

    npm link

This will link the `sscli` command to your system, and allow you to run the tool.

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