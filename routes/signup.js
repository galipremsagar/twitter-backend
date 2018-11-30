var express = require('express');
var userUtil = require('../utils/userUtils');
var commonUtil = require('../utils/commUtil');
var mongoUtil = require('../utils/dbUtil');
var router = express.Router();
var logger = require('./logger').createLogger('signup.log');

/* GET request  */
router.get('/', function (req, res, next) {
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    logger.info("GET Request form", ip);
    res.send({"status": "error", "message": "signup API accepts only calls of type POST"});
});

/* POST request  */
router.post('/', function (req, res, next) {
    var body = req.body;
    if (body != undefined) {
        var userName = userUtil.getUserName(body);
        var passWord = userUtil.getPassword(body);

        var userObject = {"userName": userName, "passWord": passWord};
        mongoUtil.insertUser(userObject, function (result, error, duplicate) {
            if (duplicate == true) {
                logger.info("Duplicate user creation attempt", userObject.userName);
                res.send({"status": "error", "message": "Duplicate user id"});
            } else if (error != undefined) {
                logger.error(error);
                res.send({"status": "error", "message": "Please contact administrator"});
            } else {
                logger.info("New user created", userObject.userName);
                res.send({"status": "success", "message": "User successfully created."})
            }
        });
    } else {
        logger.info("Request params are empty", req.body);
        res.send({"status": "error", "message": "Request params should be non-empty."});
    }
});

module.exports = router;
