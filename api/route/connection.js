/*  connecting to mongo db 
const mongo = require('mongodb');
const url = "mongodb://localhost:27017";

var dbo=null;
mongo.connect(url, {useNewUrlParser: true}, (err, db) => {
    if(err) {
        console.log(err);
        process.exit(0);
     }else{
        console.log('database connected!');
        dbo = db.db('node_rest_shop');
     }
        
});
*/

const mongoose = require('mongoose');

// Configuring the database
const dbConfig = module.exports = {
    url: 'mongodb://localhost:27017/node_rest_shop'
};

mongoose.Promise = global.Promise;


// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

//export the servlet to the server
module.exports = mongoose;