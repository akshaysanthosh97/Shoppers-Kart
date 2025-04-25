const { MongoClient } = require('mongodb');
const State = {
    db: null,
    client: null
};

module.exports.connect = function(done){
    const url = 'mongodb://localhost:27017';
    const dbName = 'Shopping';

    // If already connected, use existing connection
    if (State.db) {
        console.log('Using existing database connection');
        if (done) done();
        return;
    }

    MongoClient.connect(url, { useUnifiedTopology: true })
        .then(client => {
            State.client = client;
            State.db = client.db(dbName);
            console.log('Database connection established successfully');
            if (done) done();
        })
        .catch(err => {
            console.error('Database connection error:', err);
            if (done) done(err);
        });
};

module.exports.get = function(){
    if (!State.db) {
        console.error('Database connection not established yet. Make sure to call connect() first.');
    }
    return State.db;
};
