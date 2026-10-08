const { getProductById } = require("../services/productService");

let globalWishlistItems = [];

const getWishlist = async (req, res) => {
    try {
        const formattedItems = globalWishlistItems.map(item => {
            let fixedImage = item.image;
            if (fixedImage && fixedImage.startsWith("http://localhost:5000//")) {
                fixedImage = fixedImage.replace("http://localhost:5000//", "/");
            } else if (fixedImage && fixedImage.startsWith("http://localhost:5000/")) {
                fixedImage = fixedImage.replace("http://localhost:5000/", "/");
            }
            return {
                ...item,
                wishlist_item_id: item.wishlist_item_id || item.product_id,
                image: fixedImage
            };
        });

        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            data: formattedItems
        });
    } catch (error) {
        console.error("Wishlist Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const productData = await getProductById(product_id);
        
        if (!productData || !productData.product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const prod = productData.product;
        const price = prod.discount_price || prod.price;
        const images = productData.images || [];
        const primaryImage = images.find(img => img.is_primary) || images[0];
        const imagePath =
            primaryImage?.image ||
            primaryImage?.image_path ||
            primaryImage?.image_url ||
            prod.primary_image ||
            prod.image ||
            prod.image_path;

        const exists = globalWishlistItems.find(item => item.product_id === product_id);
        if (!exists) {
            globalWishlistItems.push({
                wishlist_item_id: product_id,
                product_id: product_id,
                name: prod.name,
                price: price,
                image: imagePath
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Added to wishlist successfully"
        });

    } catch (error) {
        console.error("Wishlist Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        globalWishlistItems = globalWishlistItems.filter(item => item.product_id !== productId);
        
        return res.status(200).json({ 
            success: true, 
            message: "Removed from wishlist successfully" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

const clearWishlist = async (req, res) => {
    try {
        globalWishlistItems = [];
        return res.status(200).json({ success: true, message: "Wishlist cleared" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
};
