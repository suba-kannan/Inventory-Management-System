import { useEffect, useState } from "react";
import axios from "axios";
import './CategoryPage.css';

interface Category {
  id?: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Category>({
    name: "",
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (form.id) {
      try {
        const res = await axios.put(`http://localhost:5000/api/categories/${form.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(
          categories.map((cat) =>
            cat.id === form.id ? { ...cat, ...res.data } : cat
          )
        );
        setShowForm(false);
      } catch (err) {
        console.error("Error updating category", err);
      }
    } else {
      try {
        const res = await axios.post("http://localhost:5000/api/categories", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories([...categories, res.data]);
        setShowForm(false);
      } catch (err) {
        console.error("Error saving category", err);
      }
    }

    setForm({ name: "", description: "" });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categories.filter((cat) => cat.id !== id));
      } catch (err) {
        console.error("Error deleting category", err);
      }
    }
  };

  const handleEdit = (category: Category) => {
    setForm(category);
    setShowForm(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery)
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-container">
      <h2 className="category-title">Categories</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Categories..."
          className="search-input"
          onChange={handleSearch}
        />
      </div>

      <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Create Category"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <input
            type="text"
            placeholder="Category Name"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="input-field description-input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
         
          <button type="submit" className="submit-button">
            {form.id ? "Update Category" : "Save Category"}
          </button>
        </form>
      )}

      <div className="category-list">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="category-card-header">
                <h3>{cat.name}</h3>
                <div className="category-actions">
                  <button
                    className="action-button"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(cat.id!)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p>{cat.description}</p>
             
            </div>
          ))
        ) : (
          <p>No categories found</p>
        )}
      </div>
    </div>
  );
}
