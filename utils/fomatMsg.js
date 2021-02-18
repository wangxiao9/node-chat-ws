const moment = require('moment');

function formatMsg(username, text) {
    return {
        username,
        text,
        time: moment().format('YYYY-MM-DD HH:mm:ss')
    };
};

module.exports = formatMsg;