var commnUtil = require('../utils/commUtil.js');

/*This function will return username from the given object, will return empty string if the attribute doesn't exist*/
module.exports.getUserName = function (body) {
    if (!commnUtil.isNull(body.userName)) {
        return body.userName;
    } else {
        return '';
    }
};

/*This function will return password from the given object, will return empty string if the attribute doesn't exist*/
module.exports.getPassword = function (body) {
    if (body.passWord != undefined) {
        return body.passWord;
    } else {
        return '';
    }
};