import { useAppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart, user } = useAppContext();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    const res = await addToCart(product._id, 1);
    if (res.success) {
      navigate("/cart");
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-red-500">❤️</span> My Wishlist
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Your saved favorite products for future shopping
            </p>
          </div>
          <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
            {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ❤️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Your wishlist is empty
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Explore products and click the heart icon to save items here!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow relative"
              >
                {/* Remove from wishlist button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  title="Remove from wishlist"
                  className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow hover:bg-red-50 transition-colors"
                >
                  ❤️
                </button>

                <Link
                  to={`/products/${product._id}`}
                  className="block relative aspect-square bg-gray-100 overflow-hidden"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-gray-900 line-clamp-1">
                      <Link
                        to={`/products/${product._id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <div className="mt-2 text-lg font-bold text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <span>🛒</span> Add to Cart
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

export default WishlistPage;
