const { ObjectId } = require('mongodb');
const db = require('../config/connection');

module.exports = {
    getAllOrders: () => {
        return new Promise((resolve, reject) => {
            const database = db.get();
            if (!database) {
                reject(new Error('Database connection not established'));
                return;
            }
            
            database.collection('orders').find().toArray()
                .then(orders => {
                    resolve(orders);
                })
                .catch(err => {
                    console.error('Error getting orders:', err);
                    reject(err);
                });
        });
    },

    getTotalOrders: () => {
        return new Promise((resolve, reject) => {
            const database = db.get();
            if (!database) {
                reject(new Error('Database connection not established'));
                return;
            }
            
            database.collection('orders').countDocuments()
                .then(count => {
                    resolve(count);
                })
                .catch(err => {
                    console.error('Error getting order count:', err);
                    reject(err);
                });
        });
    },

    getPendingOrders: () => {
        return new Promise((resolve, reject) => {
            const database = db.get();
            if (!database) {
                reject(new Error('Database connection not established'));
                return;
            }
            
            database.collection('orders').countDocuments({ status: 'pending' })
                .then(count => {
                    resolve(count);
                })
                .catch(err => {
                    console.error('Error getting pending order count:', err);
                    reject(err);
                });
        });
    },

    getTotalRevenue: () => {
        return new Promise((resolve, reject) => {
            const database = db.get();
            if (!database) {
                reject(new Error('Database connection not established'));
                return;
            }
            
            database.collection('orders').aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' }
                    }
                }
            ]).toArray()
                .then(result => {
                    resolve(result[0]?.total || 0);
                })
                .catch(err => {
                    console.error('Error calculating total revenue:', err);
                    reject(err);
                });
        });
    }
};