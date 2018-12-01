/* This utility will check if the given value is undefined/empty or not*/
module.exports.isNull = function (value) {
    if (value == undefined || value == '')
        return true;
    else
        return false;
};

/* This utility will compared username with password. Incase we plan to implement encryption of password we can do the validation here itself.*/
module.exports.validate = function (requestObject, dbObject, callback) {
    if (requestObject.userName === dbObject.userName && requestObject.passWord === dbObject.passWord) {
        callback(true);
    } else {
        callback(false);
    }
};