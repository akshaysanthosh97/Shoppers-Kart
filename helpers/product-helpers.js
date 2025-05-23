const { ObjectId } = require('mongodb');
const db = require('../config/connection');

// Helper function to ensure database connection
const ensureDbConnection = async () => {
    let database = db.get();
    if (!database) {
        console.log('Database connection not established, attempting to connect...');
        return new Promise((resolve, reject) => {
            db.connect((err) => {
                if (err) {
                    console.error('Failed to establish database connection:', err);
                    reject(new Error('Failed to establish database connection'));
                    return;
                }
                
                const reconnectedDb = db.get();
                if (!reconnectedDb) {
                    console.error('Database connection still not established after reconnect attempt');
                    reject(new Error('Database connection still not established after reconnect attempt'));
                    return;
                }
                
                resolve(reconnectedDb);
            });
        });
    }
    return database;
};

module.exports = {
    searchProducts: (searchQuery) => {
        return new Promise((resolve, reject) => {
            // If search query is empty or less than 2 characters, return empty result
            if (!searchQuery || searchQuery.trim().length < 2) {
                resolve([]);
                return;
            }

            ensureDbConnection()
                .then(database => {
                    // Prepare search terms by splitting the query into words
                    const searchTerms = searchQuery.trim().split(/\s+/).filter(term => term.length >= 2);
                    
                    // Create regex patterns for each term
                    const regexPatterns = searchTerms.map(term => {
                        return new RegExp(term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
                    });

                    // Build the query with word boundaries for more accurate matching
                    const query = {
                        $or: [
                            { name: { $all: regexPatterns } },
                            { description: { $all: regexPatterns } },
                            { category: { $all: regexPatterns } }
                        ]
                    };
                    
                    database.collection('products').find(query)
                        .collation({ locale: 'en', strength: 2 }) // Case-insensitive matching
                        .toArray()
                        .then(products => {
                            // Sort results by relevance (exact matches first)
                            const sortedProducts = products.sort((a, b) => {
                                const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
                                const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
                                if (aNameMatch && !bNameMatch) return -1;
                                if (!aNameMatch && bNameMatch) return 1;
                                return 0;
                            });
                            resolve(sortedProducts);
                        })
                        .catch(err => {
                            console.error('Error searching products:', err);
                            reject(err);
                        });
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    
    addProduct: (product, callback) => {
        ensureDbConnection()
            .then(database => {
                database.collection('products').insertOne(product)
                    .then((data) => {
                        callback(data.insertedId);
                    })
                    .catch(err => {
                        console.error('Error adding product:', err);
                        callback(null);
                    });
            })
            .catch(err => {
                console.error('Database connection error:', err);
                callback(null);
            });
    },
    
    getAllProducts: () => {
        return new Promise((resolve, reject) => {
            ensureDbConnection()
                .then(database => {
                    database.collection('products').find().toArray()
                        .then(products => {
                            resolve(products);
                        })
                        .catch(err => {
                            console.error('Error getting products:', err);
                            reject(err);
                        });
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    
    deleteProduct: (productId) => {
        return new Promise((resolve, reject) => {
            ensureDbConnection()
                .then(database => {
                    database.collection('products').deleteOne({ _id: new ObjectId(productId) })
                        .then(result => {
                            resolve(result);
                        })
                        .catch(err => {
                            console.error('Error deleting product:', err);
                            reject(err);
                        });
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    
    getProductDetails: (productId) => {
        return new Promise((resolve, reject) => {
            ensureDbConnection()
                .then(database => {
                    database.collection('products').findOne({ _id: new ObjectId(productId) })
                        .then(product => {
                            resolve(product);
                        })
                        .catch(err => {
                            console.error('Error getting product details:', err);
                            reject(err);
                        });
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    
    updateProduct: (productId, productDetails) => {
        return new Promise((resolve, reject) => {
            ensureDbConnection()
                .then(database => {
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
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}