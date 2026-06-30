import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

/**
 * Add item to cart or update quantity if item already exists
 * (Business logic extracted)
 */
export const addToCartLogic = async (userId, productId, quantity = 1) => {
    // Validate quantity is positive and is a valid number
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
        const error = new Error("Quantity must be a positive number");
        error.statusCode = 400;
        throw error;
    }

    // Validate product exists in database
    const product = await Product.findById(productId);
    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    // Check if cart exists for user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        // Create new cart for user if doesn't exist
        cart = new Cart({
            user: userId,
            items: [
                {
                    product: productId,
                    quantity: qty,
                    price: product.price,
                    discountPrice: product.discountPrice || 0,
                }
            ]
        });
    } else {
        // Cart exists - check if item already exists in it
        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            // Item exists - increment quantity and update price if it changed
            existingItem.quantity += qty;
            existingItem.price = product.price;
            existingItem.discountPrice = product.discountPrice || 0;
        } else {
            // Item doesn't exist - add new item to cart
            cart.items.push({
                product: productId,
                quantity: qty,
                price: product.price,
                discountPrice: product.discountPrice || 0,
            });
        }
    }

    // Calculate total price by summing all items (original price * quantity)
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Calculate total payable (using discountPrice if available, else original price)
    cart.totalDiscountPrice = cart.items.reduce((total, item) => {
        const finalPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
        return total + (finalPrice * item.quantity);
    }, 0);
    // Save cart to database and populate product details for response
    await cart.save();
    await cart.populate('items.product', 'title price discountPrice images slug');

    return cart;
};

/**
 * Retrieve the current user's cart with all items and product details
 */
export const getCartLogic = async (userId) => {
    // Fetch user's cart and populate product details (title, price, images, slug)
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'title price discountPrice images slug');

    if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
    }

    return cart;
};

/**
 * Update quantity of an item in the cart
 */
export const updateCartItemLogic = async (userId, itemId, quantity) => {
    // Validate quantity is positive and is a valid number
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
        const error = new Error("Quantity must be a positive number");
        error.statusCode = 400;
        throw error;
    }

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
    }

    // Find specific cart item by ID using Mongoose's .id() method
    // itemId should be the _id of the item in the cart.items array, not the product ID
    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
        const error = new Error("Item not found in cart");
        error.statusCode = 404;
        throw error;
    }

    // Update the item quantity
    cartItem.quantity = qty;

    // Recalculate total price after quantity change
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Recalculate total payable
    cart.totalDiscountPrice = cart.items.reduce((total, item) => {
        const finalPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
        return total + (finalPrice * item.quantity);
    }, 0);

    // Save updated cart and populate product details
    await cart.save();
    await cart.populate('items.product', 'title price discountPrice images slug');

    return cart;
};

/**
 * Remove an item from the cart
 */
export const removeFromCartLogic = async (userId, itemId) => {
    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
    }

    // Find item by ID
    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
        const error = new Error("Item not found in cart");
        error.statusCode = 404;
        throw error;
    }

    // Delete the item from cart array using Mongoose's deleteOne() method
    cart.items.id(itemId).deleteOne();

    // Recalculate total price after item removal
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Recalculate total payable
    cart.totalDiscountPrice = cart.items.reduce((total, item) => {
        const finalPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
        return total + (finalPrice * item.quantity);
    }, 0);

    // Save updated cart and populate product details for response
    await cart.save();
    await cart.populate('items.product', 'title price discountPrice images slug');

    // Return the updated cart (and a message is generated by the controller)
    return { cart, itemId };
};