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
        'SCOPE': {
            value: 'CREATE_SHEETS WRITE_SHEETS READ_SHEETS DELETE_SHEETS'
        },
        'TOKEN_FILE': {
            value: 'token.json',
        },
        'REDIRECT_URL': {
            value: 'http://localhost',
        },
        'REDIRECT_PORT': {
            value: '9013',
        },
        'CLIENT_ID': {
            value: 'hv4xx0t8v21wx4dw2g'
        },
        'CLIENT_SECRET': {
            value: 'w701bs5y9hs9v027rq'
        }
    });
}

module.exports = new Constants();