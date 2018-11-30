module.exports.isNull = function (value) {
    if (value == undefined || value == '')
        return true;
    else
        return false;
};

module.exports.validate = function (requestObject, dbObject, callback) {
    if (requestObject.userName === dbObject.userName && requestObject.passWord === dbObject.passWord) {
        callback(true);
    } else {
        callback(false);
    }
};