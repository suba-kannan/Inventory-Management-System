import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import './UserManagement.css';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  password?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  });

  const [search, setSearch] = useState('');
  const BASE_URL = 'http://localhost:5000';

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${BASE_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData(user);
  };

  const handleAdd = () => {
    const emptyUser: User = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
    };
    setEditingUser(emptyUser);
    setFormData(emptyUser);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleFormSubmit = async () => {
    const { name, email, phone, password, role } = formData;
  
    if (!name.trim() || !email.trim() || !phone.trim() || !role) {
      alert('All fields are required.');
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      alert('Email must end with @gmail.com');
      return;
    }
  
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }
  
    if (editingUser?.id === 0) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
  
      if (!password?.trim()) {
        alert('Password is required for new users.');
        return;
      }
  
      if (!passwordRegex.test(password)) {
        alert(
          'Password must be at least 6 characters and include at least 1 uppercase letter, 1 number, and 1 special character.'
        );
        return;
      }
    }
  
    const token = localStorage.getItem('token');
    try {
      if (formData.id === 0) {
        await axios.post(`${BASE_URL}/api/users`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const { password, ...updatedData } = formData;
        await axios.put(`${BASE_URL}/api/users/${formData.id}`, updatedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };
  
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'phone', header: 'Phone' },
      { accessorKey: 'role', header: 'Role' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="editt-button"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
        <div className="user-management-page">
        <h1 className="user-management-title">User Management</h1>

        <div className="search-add-bar">
          <input
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleAdd}>
            Add User/Admin
          </button>
        </div>

        <table className="user-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {editingUser && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="modal-title">
                {editingUser.id === 0 ? 'Add' : 'Edit'} User/Admin
              </h2>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleFormChange}
                className="form-input"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleFormChange}
                className="form-input"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="form-input"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                className="form-input"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {editingUser.id === 0 && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="form-input"
                />
              )}
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
                <button className="submit-button" onClick={handleFormSubmit}>
                  {editingUser.id === 0 ? 'Create' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default UserManagement;
