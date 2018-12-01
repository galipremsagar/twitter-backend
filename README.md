# Twitter-backend

1. Install mongoDB and have the server running.
2. Set the mongodb url in `MongoDBSetupScripts/mongoDBSetup.js` and run it.
3. Set the mongodb url in `utils/dbUtil.js`.
4. Run `npm install`
5. Run `npm start`



The end points implemented are:

1. Registration
    
    End Point: `localhost:3000/signup`<br>
    Method: `POST`<br>
    Request Data: `"data": {
               "userName": "prem",
               "passWord": "hello"
             }`<br>
    Response: `{
                   "status": "success",
                   "message": "User successfully created."
               }`
            <br>
            
  2. Login
                
        End Point: `localhost:3000/login`<br>
                Method: `POST`<br>
                Request Data: `"data": {
                           "userName": "prem",
                           "passWord": "hello"
                         }`<br>
                Response: `{
                               "sessionId": "3caad271-af6f-437b-a79c-951d34629706"
                           }`
                    