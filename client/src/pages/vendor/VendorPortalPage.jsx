import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";

const VendorPortalPage = () => {
  const { API, user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state for creating/editing
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "electronics",
    stock: 10,
    description: "",
    imageUrl: "",
  });

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch vendor products
  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products/vendor/my-products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch vendor products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      category: "electronics",
      stock: 10,
      description: "",
      imageUrl: "",
    });
    setFormError("");
    setShowAddModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "electronics",
      stock: product.stock !== undefined ? product.stock : 10,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
    });
    setFormError("");
    setShowAddModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.price || !formData.description) {
      setFormError("Please fill in required fields (Name, Price, Description)");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        imageUrl: formData.imageUrl.trim() || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      };

      if (editingProduct) {
        // Update existing product
        await API.put(`/products/${editingProduct._id}`, payload);
      } else {
        // Create new product
        await API.post("/products", payload);
      }

      setShowAddModal(false);
      setEditingProduct(null);
      fetchVendorProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product listing?")) return;

    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product: " + (err.response?.data?.message || err.message));
    }
  };

  const handleImageUploadSuccess = (data) => {
    if (data && data.url) {
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              🏬 Vendor Portal
            </div>
            <h1 className="text-3xl font-bold">Welcome, {user?.username} ({user?.role})!</h1>
            <p className="text-emerald-100 text-sm mt-1">
              Full vendor privileges: Add, edit, manage inventory, prices, descriptions, images & stock.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-md text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Products Listed</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{products.length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Active Inventory Count</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {products.reduce((acc, p) => acc + (p.stock || 0), 0)}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Vendor Powers</div>
            <div className="text-sm font-semibold text-emerald-600 mt-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Full Buy & Sell Access
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Your Product Listings</h2>
            <span className="text-xs text-gray-500">{products.length} items</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading your store listings...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 font-medium">You haven't listed any products yet.</p>
              <button
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
              >
                + Add your first product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category / Type</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 capitalize">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-gray-900">₹{product.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            product.stock > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-2.5 py-1.5 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-800 text-xs font-semibold px-2.5 py-1.5 rounded bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {editingProduct ? "Edit Product Listing" : "Add Product to Store"}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter product details including image, category/type, price, description, and stock quantity.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1299.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Category / Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category / Type *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none capitalize"
                >
                  <option value="electronics">electronics</option>
                  <option value="clothing">clothing</option>
                  <option value="home">home</option>
                  <option value="books">books</option>
                  <option value="sports">sports</option>
                  <option value="beauty">beauty</option>
                  <option value="toys">toys</option>
                  <option value="accessories">accessories</option>
                  <option value="general">general</option>
                </select>
              </div>

              {/* Product Image URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-2"
                />
                <p className="text-xs text-gray-500 mb-2">Or upload an image directly:</p>
                <ImageUpload onUploadSuccess={handleImageUploadSuccess} />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of features, materials, warranty, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingProduct ? "Update Product" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorPortalPage;
