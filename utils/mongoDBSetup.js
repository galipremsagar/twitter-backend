// var mongoDB = require('mongodb');
// var MongoClient = mongoDB.MongoClient;
//
// var url = "mongodb://localhost:27017/";
//
// MongoClient.connect("mongodb://localhost:27017/mydb", function(err, db) {
//     if (err) throw err;
//     console.log("Database created!");
//     db.close();
// });
//
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myobj = { userName: "admin", sessionId: "", expirationTime: new Date() };
//     dbo.createCollection("session", function(err, res) {
//         if (err) throw err;
//         console.log("Collection created!");
//         dbo.collection("session").createIndex( { "userName": 1 , "sessionId": 1}, { unique: true } );
//         dbo.collection("session").insertOne(myobj, function(err, res) {
//             if (err) throw err;
//             console.log("1 document inserted");
//         });
//         db.close();
//     }, );
//
// });
//
//
// // MongoClient.connect(url, function(err, db) {
// //     if (err) throw err;
// //     var dbo = db.db("mydb");
// //
// //     dbo.collection("customers").insertOne(myobj, function(err, res) {
// //         if (err) throw err;
// //         console.log("1 document inserted");
// //         db.close();
// //     });
// // });