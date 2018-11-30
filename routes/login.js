var express = require('express');
var userUtil = require('../utils/userUtils');
var commonUtil = require('../utils/commUtil');
var mongoUtil = require('../utils/dbUtil');
var router = express.Router();


/* GET request  */
router.get('/', function (req, res, next) {
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
                                // Log
                                // Possible Duplicate Session ID error.
                                res.send({"status": "error", "message": "Server error, contact Administrator."});
                            } else {
                                res.send({"sessionId": result.sessionId});
                            }
                        });
                    } else {
                        res.send({"status": "error", "message": "Invalid password."});
                    }
                });
            } else {
                res.send({"status": "error", "message": "Invalid username."});
            }
        });
    } else {
        res.send({"status": "error", "message": "Request params should be non-empty."});
    }
});

module.exports = router;