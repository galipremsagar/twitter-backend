var commnUtil = require('../utils/commUtil.js');

module.exports.getUserName = function (body) {
    if (!commnUtil.isNull(body.userName)) {
        return body.userName;
    } else {
        return '';
    }
};

module.exports.getPassword = function (body) {
    if (body.passWord != undefined) {
        return body.passWord;
    } else {
        return '';
    }
};