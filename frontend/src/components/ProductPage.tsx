import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import './ProductPage.css';

interface Product {
  id: number;
  name: string;
  category: string | number;
  supplier: string;
  price: number;
  stock: number;
}

interface Category {
  isActive: boolean;
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    supplier: "",
    price: "",
    stock: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [uploadData, setUploadData] = useState<Product[]>([]);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  const fetchSuppliers = async () => {
    const res = await axios.get("http://localhost:5000/api/suppliers");
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    };

    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/products/${editing.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/products", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({ name: "", category: "", supplier: "", price: "", stock: "" });
      setEditing(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setFormData({
      name: product.name,
      category: product.category.toString(),
      supplier: product.supplier,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setShowForm(true);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (typeof bstr !== "string" && !(bstr instanceof ArrayBuffer)) return;

      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      type ExcelProductRow = {
        name: string;
        category: string;
        supplier: string;
        price: string | number;
        stock: string | number;
      };

      const rawData = XLSX.utils.sheet_to_json<ExcelProductRow>(sheet);

      const cleanedData: Product[] = rawData.map((item) => ({
        id: 0,
        name: item.name,
        category: item.category,
        supplier: item.supplier,
        price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
        stock: typeof item.stock === "string" ? parseInt(item.stock, 10) : item.stock,
      }));

      setUploadData(cleanedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleConfirmUpload = async () => {
    try {
      for (const product of uploadData) {
        await axios.post("http://localhost:5000/api/products", product, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setUploadData([]);
      fetchProducts();
      setShowUploadOptions(false);
    } catch (err) {
      console.error("Error uploading products:", err);
    }
  };

  const getCategoryName = (categoryId: string | number) => {
    const category = categories.find((cat) => cat.id === Number(categoryId));
    return category ? category.name : categoryId.toString();
  };

  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    return products.filter((p) => {
      const categoryName = getCategoryName(p.category);
      return (
        p.name.toLowerCase().includes(lowerSearch) ||
        categoryName.toLowerCase().includes(lowerSearch) ||
        p.supplier.toLowerCase().includes(lowerSearch) ||
        p.price.toString().includes(lowerSearch)
      );
    });
  }, [products, searchTerm, categories]);

  return (
    <div className="product-page">
      <h2>Product Management</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {
            setFormData({ name: "", category: "", supplier: "", price: "", stock: "" });
            setEditing(null);
            setShowForm(true);
          }}
        >
          Add Product
        </button>
        <button onClick={() => setShowUploadOptions(!showUploadOptions)}>
          {showUploadOptions ? "Cancel Upload" : "Upload File"}
        </button>
      </div>

      {showUploadOptions && (
        <div className="upload-options">
          <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} />
          {uploadData.length > 0 && (
            <div>
              <button onClick={handleConfirmUpload}>Confirm Upload</button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="product-form">
          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select name="supplier" value={formData.supplier} onChange={handleChange} required>
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
          </select>
          <input
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
          <button type="submit">{editing ? "Update" : "Add"} Product</button>
          <button type="button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{getCategoryName(product.category)}</td>
              <td>{product.supplier}</td>
              <td>₹{product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPage;
