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
    },

    toggleUserStatus: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                // First get the current user to check their status
                const user = await database.collection('users').findOne({ _id: new ObjectId(userId) });
                if (!user) {
                    reject(new Error('User not found'));
                    return;
                }

                // Toggle the isActive status
                const newStatus = !user.isActive;
                const result = await database.collection('users').updateOne(
                    { _id: new ObjectId(userId) },
                    { $set: { isActive: newStatus } }
                );

                if (result.modifiedCount === 0) {
                    reject(new Error('Failed to update user status'));
                    return;
                }

                // Return the updated user
                const updatedUser = await database.collection('users').findOne({ _id: new ObjectId(userId) });
                resolve(updatedUser);
            } catch (err) {
                console.error('Error toggling user status:', err);
                reject(err);
            }
        });
    }
};