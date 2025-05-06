import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import "./UserProductPage.css";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface Category {
  id: number;
  name: string;
}

const UserProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/products/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOrder = async () => {
    if (!selectedProductId || quantity <= 0) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/order",
        {
          productId: selectedProductId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order placed successfully!");
      setSelectedProductId(null);
      setQuantity(1);
      fetchProducts();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error("Error placing order:", err.message);
      alert(err.response?.data?.message || "Failed to place order");
    }
  };

  const handleCancel = () => {
    setSelectedProductId(null);
    setQuantity(1);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const product = products.find((p) => p.id === selectedProductId);
    setSelectedProduct(product || null);
  }, [selectedProductId, products]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === parseInt(categoryId));
    return category ? category.name : "No Category";
  };

  const filteredProducts = products.filter((product) => {
    const productNameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryName = getCategoryName(product.category);
    const categoryMatch = categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    return productNameMatch || categoryMatch;
  });

  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  return (
    <div className="user-product-page">
      <h2 className="page-title">Products</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredProducts.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <ul className="product-list">
          {filteredProducts.map((product) => (
            <li key={product.id} className="product-item">
              <div className="product-info">
                <div className="product-details">
                  <strong className="product-name">{product.name}</strong> <br />
                  <span className="product-description">{product.description}</span> <br />
                  <div className="product-attributes">
                    <div className="product-attribute">
                      <span className="label">Category:</span>
                      <span className="value">{getCategoryName(product.category)}</span>
                    </div>
                    <div className="product-attribute">
                      <span className="label">Price:</span>
                      <span className="value">₹{product.price}</span>
                    </div>
                    <div className="product-attribute">
                      <span className="label">Stock:</span>
                      <span className={`value ${product.stock > 0 ? 'stock-available' : 'stock-unavailable'}`}>
                        {product.stock > 0 ? product.stock : "Sold Out"}
                      </span>
                    </div>
                  </div>

                </div>
                {product.stock > 0 && (
                  <button
                    onClick={() => setSelectedProductId(product.id)}
                    className="order-button"
                  >
                    Order
                  </button>
                )}
              </div>

              {selectedProductId === product.id && product.stock > 0 && (
                <div className="order-form">
                  <label className="quantity-label">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="quantity-input"
                  />
                  <div className="total-price">
                    <strong>Total Price: </strong>
                    ₹{totalPrice.toFixed(2)}
                  </div>
                  <div className="order-actions">
                    <button
                      onClick={handleOrder}
                      className="place-order-button"
                    >
                      Place Order
                    </button>
                    <button
                      onClick={handleCancel}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProductPage;
