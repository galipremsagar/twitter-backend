var mongoDB = require('mongodb');
const uuidv4 = require('uuid/v4');
var logger = require('logger').createLogger('mongoDB.log');
var moment = require('moment');

var MongoClient = mongoDB.MongoClient;

var url = "mongodb://localhost:27017";

/* Utiltiy to test the Mongo DB connection */
module.exports.testDBConnection = function (callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.close();
        logger.info("Connection Successful", url);
        callback("Database created!");
    });
};

/* Given the userObject({'userName':'abc'}) this function will return the entire user record. */
module.exports.getUser = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("users").find(userObject).toArray(function (err, res) {
            if (err) {
                logger.error(err, userObject);
                throw err;
            }
            db.close();
            callback(res);
        });
    });
};

/* Given the userObject({'userName':'abc'}) this function will check if the record exists. */
module.exports.isExists = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            logger.error(err, userObject);
            throw err;
        }
        var dbo = db.db("mydb");
        dbo.collection("users").find(userObject).toArray(function (err, res) {
            if (err) {
                logger.error(err, userObject);
                throw err;
            }
            db.close();
            callback(res.length !== 0)
        });
    });
};

/* Given the userObject({'userName':'abc', 'passWord': 'xyz'}) this function will insert into users collection. */
module.exports.insertUser = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            logger.error(err, userObject);
            throw err;
        }
        var dbo = db.db("mydb");
        dbo.collection("users").insertOne(userObject, function (err, res) {
            db.close();
            if (err) {
                if (err.code == 11000) {
                    callback(undefined, err, true);
                } else {
                    callback(undefined, err, false);
                }
            } else {
                callback(res);
            }
        });
    });
};


/*
* Given the userObject({'username':'abc'}) this function will return the sessionID of the user.
* Note: Before calling this function please call checkAndRenewSessionExpiry function
*/
module.exports.getSessionId = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            logger.error(err, userObject);
            throw err;
        }
        var dbo = db.db("mydb");
        var findObject = {"userName": userObject.userName};
        dbo.collection("session").findOne(findObject, function (err, res) {
            if (err) {
                callback(undefined);
            }
            db.close();
            callback(res.sessionId);
        });
    });
};

/*
* Given the userObject({'username':'abc'}) this function will check the sessionID expiry and renew it if it is about to expire. This function will return the sessionID.
*/
module.exports.checkAndRenewSessionExpiry = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            logger.error(err, userObject);
            throw err;
        }
        var dbo = db.db("mydb");
        var findObject = {"userName": userObject.userName};
        dbo.collection("session").findOne(findObject, function (err, res) {
            if (err) {
                callback(undefined);
            }
            db.close();
            var time = new Date(res.expirationTime);
            var diff = moment(new Date()).diff(time, 'minutes');
            if (diff < 2) {
                var insertObject = {};
                insertObject.userName = res.userName;
                insertObject.sessionId = res.sessionId;
                insertObject.expirationTime = new Date(new Date() + 2 * 60000);
                dbo.collection("session").findOneAndReplace(findObject, insertObject, {
                    upsert: true,
                    returnOriginal: false
                }, function (err, res) {
                    if (err) {
                        logger.error(err, findObject);
                        callback(undefined, err);
                    }
                    db.close();
                    callback(res.value.sessionId);
                });
            } else {
                callback(res.sessionId);
            }
        });
    });
};

/*
* Given the userObject({'username':'abc'}) this function will generate new sessionId and store it with 2 minutes of expiry time.
*/
module.exports.setSessionId = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            logger.error(err, userObject);
            throw err;
        }
        var dbo = db.db("mydb");
        var findObject = {"userName": userObject.userName};
        var insertObject = {};
        insertObject['userName'] = userObject.userName;
        insertObject['sessionId'] = uuidv4();
        var presentDate = new Date();
        insertObject['expiryTime'] = new Date(presentDate + 2 * 60000);
        dbo.collection("session").findOneAndReplace(findObject, insertObject, {
            upsert: true,
            returnOriginal: false
        }, function (err, res) {
            if (err) {
                logger.error(err, findObject);
                callback(undefined, err);
            }
            db.close();
            callback(res.value);
        });
    });
};
