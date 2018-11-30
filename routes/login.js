var express = require('express');
var userUtil = require('../utils/userUtils');
var commonUtil = require('../utils/commUtil');
var mongoUtil = require('../utils/dbUtil');
var router = express.Router();
var logger = require('logger').createLogger('login.log');

/* GET request  */
router.get('/', function (req, res, next) {
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    logger.info("GET Request from", ip);
    res.send({"status": "error", "message": "login API accepts only calls of type POST"});
});


/* POST request  */
router.post('/', function (req, res, next) {
    var body = req.body;
    if (body != undefined) {
        var userName = userUtil.getUserName(body);
        var passWord = userUtil.getPassword(body);

        var userObject = {"userName": userName, "passWord": passWord};
        mongoUtil.getUser(userObject, function (result) {
            if (result.length != 0) {
                commonUtil.validate(userObject, result[0], function (isValid) {
                    if (isValid) {
                        mongoUtil.setSessionId(userObject, function (result, error) {
                            if (error) {
                                logger.error("Possible duplicate session ID error", error);
                                res.send({
                                    "status": "error",
                                    "message": "Server error, contact Administrator or please retry again after sometime."
                                });
                            } else {
                                logger.info("Sending session id", result.sessionId, " to user", userObject.userName);
                                res.send({"sessionId": result.sessionId});
                            }
                        });
                    } else {
                        logger.info("Invalid(password) login attempt for user ", userObject.userName);
                        res.send({"status": "error", "message": "Invalid password."});
                    }
                });
            } else {
                logger.info("Invalid(username) login attempt for user ", userObject.userName);
                res.send({"status": "error", "message": "Invalid username."});
            }
        });
    } else {
        logger.info("Request is empty ", req.body);
        res.send({"status": "error", "message": "Request params should be non-empty."});
    }
});

module.exports = router;