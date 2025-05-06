import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import './SupplierPage.css';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
}

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  });

  const token = localStorage.getItem("token");

  const fetchSuppliers = async () => {
    const res = await axios.get("http://localhost:5000/api/suppliers");
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/suppliers/${editing.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/suppliers", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ name: "", email: "", phone: "", address: "", company: "" });
      setEditing(null);
      setShowForm(false);
      fetchSuppliers();
    } catch (err) {
      console.error("Error saving supplier:", err);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditing(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      company: supplier.company,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/suppliers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSuppliers();
  };

  const filteredSuppliers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return suppliers.filter((s) =>
      s.name.toLowerCase().includes(lowerSearch) ||
      s.email.toLowerCase().includes(lowerSearch) ||
      s.phone.includes(lowerSearch) ||
      s.address.toLowerCase().includes(lowerSearch) ||
      s.company.toLowerCase().includes(lowerSearch)
    );
  }, [suppliers, searchTerm]);

  const columns = useMemo<ColumnDef<Supplier>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "address", header: "Address" },
      { accessorKey: "company", header: "Company" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div>
            <button onClick={() => handleEdit(row.original)}>Edit</button>{" "}
            <button onClick={() => handleDelete(row.original.id)}>Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredSuppliers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="supplier-page">
      <h2>Supplier Management</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          placeholder="Search supplier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => {
          setFormData({ name: "", email: "", phone: "", address: "", company: "" });
          setEditing(null);
          setShowForm(true);
        }}>
          Add Supplier
        </button>
      </div>

      {showForm && (
        <div className="overlay">
          <form onSubmit={handleSubmit} className="supplier-form modal">
            <h3>{editing ? "Edit Supplier" : "Add Supplier"}</h3>
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
            <div className="modal-buttons">
              <button type="submit">{editing ? "Update" : "Add"} Supplier</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <table className="supplier-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierPage;
