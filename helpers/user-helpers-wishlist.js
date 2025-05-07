// Wishlist helper functions
const { ObjectId } = require('mongodb');
const db = require('../config/connection');

module.exports = {
    // Get wishlist items for a user
    getWishlistItems: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                // Aggregate to get wishlist with product details
                const wishlistItems = await database.collection('wishlist').aggregate([
                    {
                        $match: { user: new ObjectId(userId) }
                    },
                    {
                        $unwind: '$products'
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'products',
                            foreignField: '_id',
                            as: 'productDetails'
                        }
                    },
                    {
                        $project: {
                            _id: { $arrayElemAt: ['$productDetails._id', 0] },
                            name: { $arrayElemAt: ['$productDetails.name', 0] },
                            price: { $arrayElemAt: ['$productDetails.price', 0] },
                            description: { $arrayElemAt: ['$productDetails.description', 0] },
                            category: { $arrayElemAt: ['$productDetails.category', 0] },
                            image: { $arrayElemAt: ['$productDetails.image', 0] }
                        }
                    }
                ]).toArray();

                resolve(wishlistItems);
            } catch (err) {
                console.error('Error getting wishlist items:', err);
                reject(err);
            }
        });
    },

    // Add item to wishlist
    addToWishlist: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                // Check if user already has a wishlist
                const userWishlist = await database.collection('wishlist').findOne({ user: new ObjectId(userId) });

                if (userWishlist) {
                    // Check if product already exists in wishlist
                    const productExists = userWishlist.products.some(product => 
                        product.toString() === productId.toString());

                    if (productExists) {
                        // Product already in wishlist, no need to add again
                        resolve();
                        return;
                    }

                    // Add new product to wishlist
                    await database.collection('wishlist').updateOne(
                        { user: new ObjectId(userId) },
                        { 
                            $push: { 
                                products: new ObjectId(productId) 
                            } 
                        }
                    );
                } else {
                    // Create new wishlist for user
                    await database.collection('wishlist').insertOne({
                        user: new ObjectId(userId),
                        products: [new ObjectId(productId)]
                    });
                }

                resolve();
            } catch (err) {
                console.error('Error adding to wishlist:', err);
                reject(err);
            }
        });
    },

    // Remove item from wishlist
    removeFromWishlist: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const database = db.get();
                if (!database) {
                    reject(new Error('Database connection not established'));
                    return;
                }

                // Remove the item from the products array
                await database.collection('wishlist').updateOne(
                    { user: new ObjectId(userId) },
                    { $pull: { products: new ObjectId(productId) } }
                );

                // Check if the wishlist is now empty
                const wishlist = await database.collection('wishlist').findOne({ user: new ObjectId(userId) });
                if (wishlist && (!wishlist.products || wishlist.products.length === 0)) {
                    // Delete the wishlist document if empty
                    await database.collection('wishlist').deleteOne({ user: new ObjectId(userId) });
                }

                resolve();
            } catch (err) {
                console.error('Error removing wishlist item:', err);
                reject(err);
            }
        });
    }
};