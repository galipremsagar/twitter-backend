var express = require('express');
var userUtil = require('../utils/userUtils');
var commonUtil = require('../utils/commUtil');
var mongoUtil = require('../utils/dbUtil');
var router = express.Router();

/* GET request  */
router.get('/', function (req, res, next) {
    res.send({"status": "error", "message": "signup API accepts only calls of type POST"});
});

/* POST request  */
router.post('/', function (req, res, next) {
    var body = req.body;
    if (body != undefined) {
        var userName = userUtil.getUserName(body);
        var passWord = userUtil.getPassword(body);

        var userObject = {"userName": userName, "passWord": passWord};
        mongoUtil.insert(userObject, function (result, error, duplicate) {
            if (duplicate == true) {
                // Log
                res.send({"status": "error", "message": "Duplicate user id"});
            } else if (error != undefined) {
                // Log
                res.send({"status": "error", "message": "Please contact administrator"});
            } else {
                // Log
                res.send({"status": "success", "message": "User successfully created."})
            }
        });
    } else {
        res.send({"status": "error", "message": "Request params should be non-empty."});
    }
    // res.send(req.body);
});

module.exports = router;
