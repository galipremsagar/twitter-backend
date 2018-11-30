var mongoDB = require('mongodb');
const uuidv4 = require('uuid/v4');


var MongoClient = mongoDB.MongoClient;

var url = "mongodb://localhost:27017";

module.exports.testDBConnection = function (callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.close();
        callback("Database created!");
    });
};

module.exports.getUser = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("users").find(userObject).toArray(function (err, res) {
            if (err) throw err;
            db.close();
            callback(res);
        });
    });
};

module.exports.isExists = function (userObject, callback) {
    module.exports.getUser(userObject, function (res) {
        callback(res.length !== 0)
    });
    // MongoClient.connect(url, function (err, db) {
    //     if (err) throw err;
    //     var dbo = db.db("mydb");
    //     dbo.collection("users").find(userObject).toArray(function (err, res) {
    //         if (err) throw err;
    //         db.close();
    //         callback(res.length !== 0)
    //     });
    // });
};


module.exports.insertUser = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
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


module.exports.getSessionId = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("session").find(userObject, function (err, res) {
            if (err) {
                callback(undefined);
            }
            db.close();
            callback(res);
        });
    });
};

module.exports.setSessionId = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
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
                callback(undefined, err);
            }
            db.close();
            callback(res.value);
        });
    });
};

// module.exports.isExists(function (result) {
//     console.log(result);
// });