const path = require('path');
const os = require('os');

/**
 * Define constants
 *
 * @returns {void}
 */
function Constants() {
    Object.defineProperties(this, {
        'APP_DIR': {
            value: path.join(os.homedir(), '.smartsheet-cli'),
        },
        'TOKEN_FILE': {
            value: 'token.json',
        },
        'REDIRECT_URL': {
            value: 'http://localhost',
        },
        'REDIRECT_PORT': {
            value: '9012',
        },
        'CLIENT_ID': {
            value: ''
        },
        'CLIENT_SECRET': {
            value: ''
        }
    });
}

module.exports = new Constants();