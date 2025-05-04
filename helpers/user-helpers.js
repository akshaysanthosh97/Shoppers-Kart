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
    },

    // Cart Functions
    addToCart: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                const cartObj = {
                    user: new ObjectId(userId),
                    products: [{
                        item: new ObjectId(productId),
                        quantity: 1
                    }]
                };

                // Check if user already has a cart
                const userCart = await database.collection('cart').findOne({ user: new ObjectId(userId) });

                if (userCart) {
                    // Check if product already exists in cart
                    const productExists = userCart.products.findIndex(product => 
                        product.item.toString() === productId.toString());

                    if (productExists !== -1) {
                        // Increment quantity if product already in cart
                        await database.collection('cart').updateOne(
                            { 
                                user: new ObjectId(userId), 
                                'products.item': new ObjectId(productId) 
                            },
                            { $inc: { 'products.$.quantity': 1 } }
                        );
                    } else {
                        // Add new product to cart
                        await database.collection('cart').updateOne(
                            { user: new ObjectId(userId) },
                            { 
                                $push: { 
                                    products: { item: new ObjectId(productId), quantity: 1 } 
                                } 
                            }
                        );
                    }
                } else {
                    // Create new cart for user
                    await database.collection('cart').insertOne(cartObj);
                }

                resolve();
            } catch (err) {
                console.error('Error adding to cart:', err);
                reject(err);
            }
        });
    },

    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                // Aggregate to get cart with product details
                const cartItems = await database.collection('cart').aggregate([
                    {
                        $match: { user: new ObjectId(userId) }
                    },
                    {
                        $unwind: '$products'
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'products.item',
                            foreignField: '_id',
                            as: 'productDetails'
                        }
                    },
                    {
                        $project: {
                            item: '$products.item',
                            quantity: '$products.quantity',
                            product: { $arrayElemAt: ['$productDetails', 0] }
                        }
                    }
                ]).toArray();

                resolve(cartItems);
            } catch (err) {
                console.error('Error getting cart products:', err);
                reject(err);
            }
        });
    },

    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                // Get cart count
                const count = await database.collection('cart').aggregate([
                    {
                        $match: { user: new ObjectId(userId) }
                    },
                    {
                        $project: {
                            count: { $size: '$products' }
                        }
                    }
                ]).toArray();

                if (count.length > 0) {
                    resolve(count[0].count);
                } else {
                    resolve(0);
                }
            } catch (err) {
                console.error('Error getting cart count:', err);
                reject(err);
            }
        });
    },

    // Update cart item quantity
    updateCartQuantity: (userId, productId, quantity) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }
                // Ensure quantity is at least 1
                const qty = Math.max(1, parseInt(quantity, 10));
                // Update the quantity for the specific product in the user's cart
                const result = await database.collection('cart').updateOne(
                    { user: new ObjectId(userId), 'products.item': new ObjectId(productId) },
                    { $set: { 'products.$.quantity': qty } }
                );
                if (result.modifiedCount === 0) {
                    reject(new Error('Failed to update cart quantity'));
                    return;
                }
                resolve();
            } catch (err) {
                console.error('Error updating cart quantity:', err);
                reject(err);
            }
        });
    },
    removeCartItem: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                // Remove the item from the products array
                await database.collection('cart').updateOne(
                    { user: new ObjectId(userId) },
                    { $pull: { products: { item: new ObjectId(productId) } } }
                );

                // Check if the cart is now empty
                const cart = await database.collection('cart').findOne({ user: new ObjectId(userId) });
                if (cart && (!cart.products || cart.products.length === 0)) {
                    // Delete the cart document if empty
                    await database.collection('cart').deleteOne({ user: new ObjectId(userId) });
                }

                resolve();
            } catch (err) {
                console.error('Error removing cart item:', err);
                reject(err);
            }
        });
    }
};