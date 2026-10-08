import { useEffect, useState } from "react";
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from "../../utils/imageUrl";
import api from "../../services/api";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const response = await api.get("/wishlist");

      setWishlist(response.data.data || []);

    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);


  const removeWishlist = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);

      setWishlist((prev) =>
        prev.filter((item) => item.wishlist_item_id !== id)
      );

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to remove product"
      );
    }
  };


  const clearWishlist = async () => {
    if (!window.confirm("Clear your wishlist?")) {
      return;
    }

    try {
      await api.delete("/wishlist");

      setWishlist([]);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to clear wishlist"
      );
    }
  };


  const moveToCart = async (item) => {
    try {
      await api.post("/cart", {
        product_id: item.product_id,
        quantity: 1,
      });

      await api.delete(`/wishlist/${item.wishlist_item_id}`);

      setWishlist((prev) =>
        prev.filter(
          (wishlistItem) =>
            wishlistItem.wishlist_item_id !== item.wishlist_item_id
        )
      );

      alert("Product moved to cart");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to move product to cart"
      );
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading wishlist...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">

      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black mb-6 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm transition duration-200 w-fit"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              My Wishlist
            </h1>

            <p className="text-gray-500 mt-1">
              {wishlist.length} product
              {wishlist.length !== 1 ? "s" : ""}
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-red-500 hover:text-red-700"
            >
              Clear Wishlist
            </button>
          )}

        </div>


        {wishlist.length === 0 ? (

          <div className="bg-white rounded-xl p-12 text-center shadow-sm">

            <FaHeart className="text-5xl text-gray-300 mx-auto mb-5" />

            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mb-6">
              Save products you love here.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {wishlist.map((item) => (

              <div
                key={item.wishlist_item_id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >

                <div
                  className="h-64 bg-gray-100 cursor-pointer"
                  onClick={() =>
                    navigate(`/products/${item.product_id}`)
                  }
                >

                  <img
                    src={getImageUrl(
                      item.primary_image ||
                        item.image ||
                        item.image_path ||
                        item.image_url
                    )}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = DEFAULT_PRODUCT_IMAGE;
                    }}
                  />

                </div>


                <div className="p-4">

                  <h3
                    className="font-semibold cursor-pointer hover:text-gray-600"
                    onClick={() =>
                      navigate(`/products/${item.product_id}`)
                    }
                  >
                    {item.name}
                  </h3>


                  <div className="mt-2">

                    {item.discount_price ? (
                      <div className="flex gap-2">

                        <span className="font-bold">
                          ₹{item.discount_price}
                        </span>

                        <span className="text-gray-400 line-through">
                          ₹{item.price}
                        </span>

                      </div>
                    ) : (
                      <span className="font-bold">
                        ₹{item.price}
                      </span>
                    )}

                  </div>


                  <div className="flex gap-2 mt-4">

                    <button
                      onClick={() => moveToCart(item)}
                      disabled={item.stock <= 0}
                      className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg disabled:bg-gray-400"
                    >
                      <FaShoppingCart />
                      Cart
                    </button>

                    <button
                      onClick={() =>
                        removeWishlist(item.wishlist_item_id)
                      }
                      className="w-10 flex items-center justify-center border border-red-200 text-red-500 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;