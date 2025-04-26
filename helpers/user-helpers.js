const { ObjectId } = require('mongodb');
const db = require('../config/connection');

module.exports = {
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            const database = db.get();
            if (!database) {
                reject(new Error('Database connection not established'));
                return;
            }
            
            database.collection('users').find().toArray()
                .then(users => {
                    resolve(users);
                })
                .catch(err => {
                    console.error('Error getting users:', err);
                    reject(err);
                });
        });
    },

    getTotalUsers: () => {
        return new Promise((resolve, reject) => {
            const database = db.get();
            if (!database) {
                reject(new Error('Database connection not established'));
                return;
            }
            
            database.collection('users').countDocuments()
                .then(count => {
                    resolve(count);
                })
                .catch(err => {
                    console.error('Error getting user count:', err);
                    reject(err);
                });
        });
    }
};