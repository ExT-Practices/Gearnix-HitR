const { getProductById } = require("../services/productService");

let globalWishlistItems = [];

const getWishlist = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            data: globalWishlistItems
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
        const primaryImage = productData.images && productData.images.length > 0 
            ? (productData.images.find(img => img.is_primary) || productData.images[0])
            : null;
            
        let imageUrl = null;
        if (primaryImage && primaryImage.image) {
            imageUrl = primaryImage.image.startsWith('http') 
                ? primaryImage.image 
                : `http://localhost:5000/${primaryImage.image}`;
        }

        const exists = globalWishlistItems.find(item => item.product_id === product_id);
        if (!exists) {
            globalWishlistItems.push({
                product_id: product_id,
                name: prod.name,
                price: price,
                image: imageUrl
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
