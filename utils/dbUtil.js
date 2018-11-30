var mongoDB = require('mongodb');
const uuidv3 = require('uuid/v3');


var MongoClient = mongoDB.MongoClient;

var url = "mongodb://localhost:27017";

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     console.log("Database created!");
//     db.close();
// });

module.exports.isExists = function (userObject, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("users").find(userObject).toArray(function (err, res) {
            if (err) throw err;
            db.close();
            callback(res.length !== 0)
        });
    });
};

module.exports.insert = function (userObject, callback) {
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
            }else{
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
        insertObject['sessionId'] = uuidv3(userObject.userName, uuidv3.name);
        var presentDate = new Date();
        insertObject['expiryTime'] = new Date(presentDate + 2 * 60000);
        dbo.collection("session").findOneAndReplace(findObject, insertObject, {upsert: true}, function (err, res) {
            if (err) {
                if (err.code == 11000) {
                    callback(undefined, err, true);
                } else {
                    callback(undefined, err, false);
                }
            }
            db.close();
            callback(res);
        });
    });
};

// module.exports.isExists(function (result) {
//     console.log(result);
// });