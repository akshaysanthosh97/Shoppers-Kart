const { ObjectId } = require('mongodb');
const db = require('../config/connection');
const bcrypt = require('bcrypt');

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
    },

    // User Authentication Functions
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                // Check if email already exists
                const existingUser = await database.collection('users').findOne({ email: userData.email });
                if (existingUser) {
                    reject(new Error('Email already registered'));
                    return;
                }

                // Hash the password
                userData.password = await bcrypt.hash(userData.password, 10);
                
                // Add additional user fields
                userData.createdAt = new Date();
                userData.isActive = true;
                userData.role = 'user'; // Default role

                // Insert the user
                const result = await database.collection('users').insertOne(userData);
                resolve(result);
            } catch (err) {
                console.error('Error during signup:', err);
                reject(err);
            }
        });
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                // Find user with the provided email
                const user = await database.collection('users').findOne({ email: userData.email });
                
                if (!user) {
                    reject(new Error('Invalid email or password'));
                    return;
                }

                // Check if user is blocked
                if (!user.isActive) {
                    reject(new Error('Your account has been deactivated'));
                    return;
                }

                // Compare passwords
                const status = await bcrypt.compare(userData.password, user.password);
                
                if (status) {
                    // Don't send password to client
                    delete user.password;
                    resolve(user);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            } catch (err) {
                console.error('Error during login:', err);
                reject(err);
            }
        });
    },

    getUserById: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                const user = await database.collection('users').findOne({ _id: new ObjectId(userId) });
                
                if (user) {
                    // Don't send password to client
                    delete user.password;
                    resolve(user);
                } else {
                    reject(new Error('User not found'));
                }
            } catch (err) {
                console.error('Error getting user by ID:', err);
                reject(err);
            }
        });
    }
};