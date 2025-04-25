const { ObjectId } = require('mongodb');
const db = require('../config/connection');

module.exports = {
    addProduct: (product, callback) => {
        const database = db.get();
        if (!database) {
            console.error('Database connection not established');
            // Try to connect to the database if not already connected
            db.connect((err) => {
                if (err) {
                    console.error('Failed to establish database connection:', err);
                    callback(null);
                    return;
                }
                
                // Now try to get the database again
                const reconnectedDb = db.get();
                if (!reconnectedDb) {
                    console.error('Database connection still not established after reconnect attempt');
                    callback(null);
                    return;
                }
                
                // Now we have a connection, try to add the product
                reconnectedDb.collection('products').insertOne(product)
                    .then((data) => {
                        callback(data.insertedId);
                    })
                    .catch(err => {
                        console.error('Error adding product:', err);
                        callback(null);
                    });
            });
            return;
        }
        
        database.collection('products').insertOne(product)
            .then((data) => {
                callback(data.insertedId);
            })
            .catch(err => {
                console.error('Error adding product:', err);
                callback(null);
            });
    },
    
    getAllProducts: () => {
        return new Promise((resolve, reject) => {
            const database = db.get();
            if (!database) {
                console.error('Database connection not established');
                // Try to connect to the database if not already connected
                db.connect((err) => {
                    if (err) {
                        reject(new Error('Failed to establish database connection'));
                        return;
                    }
                    
                    // Now try to get the database again
                    const reconnectedDb = db.get();
                    if (!reconnectedDb) {
                        reject(new Error('Database connection still not established after reconnect attempt'));
                        return;
                    }
                    
                    // Now we have a connection, try to get the products
                    reconnectedDb.collection('products').find().toArray()
                        .then(products => {
                            resolve(products);
                        })
                        .catch(err => {
                            console.error('Error getting products:', err);
                            reject(err);
                        });
                });
                return;
            }
            
            database.collection('products').find().toArray()
                .then(products => {
                    resolve(products);
                })
                .catch(err => {
                    console.error('Error getting products:', err);
                    reject(err);
                });
        });
    },
    
    deleteProduct: (productId) => {
        return new Promise((resolve, reject) => {
            const database = db.get();
            if (!database) {
                console.error('Database connection not established');
                // Try to connect to the database if not already connected
                db.connect((err) => {
                    if (err) {
                        reject(new Error('Failed to establish database connection'));
                        return;
                    }
                    
                    // Now try to get the database again
                    const reconnectedDb = db.get();
                    if (!reconnectedDb) {
                        reject(new Error('Database connection still not established after reconnect attempt'));
                        return;
                    }
                    
                    // Now we have a connection, try to delete the product
                    reconnectedDb.collection('products').deleteOne({ _id: new ObjectId(productId) })
                        .then(result => {
                            resolve(result);
                        })
                        .catch(err => {
                            console.error('Error deleting product:', err);
                            reject(err);
                        });
                });
                return;
            }
            
            database.collection('products').deleteOne({ _id: new ObjectId(productId) })
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    console.error('Error deleting product:', err);
                    reject(err);
                });
        });
    },
    
    getProductDetails: (productId) => {
        return new Promise((resolve, reject) => {
            const database = db.get();
            if (!database) {
                console.error('Database connection not established');
                // Try to connect to the database if not already connected
                db.connect((err) => {
                    if (err) {
                        reject(new Error('Failed to establish database connection'));
                        return;
                    }
                    
                    // Now try to get the database again
                    const reconnectedDb = db.get();
                    if (!reconnectedDb) {
                        reject(new Error('Database connection still not established after reconnect attempt'));
                        return;
                    }
                    
                    // Now we have a connection, try to get the product details
                    reconnectedDb.collection('products').findOne({ _id: new ObjectId(productId) })
                        .then(product => {
                            resolve(product);
                        })
                        .catch(err => {
                            console.error('Error getting product details:', err);
                            reject(err);
                        });
                });
                return;
            }
            
            database.collection('products').findOne({ _id: new ObjectId(productId) })
                .then(product => {
                    resolve(product);
                })
                .catch(err => {
                    console.error('Error getting product details:', err);
                    reject(err);
                });
        });
    },
    
    updateProduct: (productId, productDetails) => {
        return new Promise((resolve, reject) => {
            const database = db.get();
            if (!database) {
                console.error('Database connection not established');
                // Try to connect to the database if not already connected
                db.connect((err) => {
                    if (err) {
                        reject(new Error('Failed to establish database connection'));
                        return;
                    }
                    
                    // Now try to get the database again
                    const reconnectedDb = db.get();
                    if (!reconnectedDb) {
                        reject(new Error('Database connection still not established after reconnect attempt'));
                        return;
                    }
                    
                    // Now we have a connection, try to update the product
                    reconnectedDb.collection('products').updateOne(
                        { _id: new ObjectId(productId) },
                        { $set: productDetails }
                    )
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        console.error('Error updating product:', err);
                        reject(err);
                    });
                });
                return;
            }
            
            database.collection('products').updateOne(
                { _id: new ObjectId(productId) },
                { $set: productDetails }
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.error('Error updating product:', err);
                reject(err);
            });
        });
    }
}