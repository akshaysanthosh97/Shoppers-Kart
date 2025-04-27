const { MongoClient } = require('mongodb');
const State = {
    db: null,
    client: null
};

module.exports.connect = function(done){
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/Shopping';
    const dbName = url.split('/').pop().split('?')[0];

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
        // Return null to allow the caller to handle the error
    }
    return State.db;
};

// Close database connection when the application is shutting down
module.exports.close = function() {
    if (State.client) {
        console.log('Closing database connection');
        State.client.close()
            .then(() => {
                console.log('Database connection closed successfully');
                State.db = null;
                State.client = null;
            })
            .catch(err => {
                console.error('Error closing database connection:', err);
            });
    }
};
