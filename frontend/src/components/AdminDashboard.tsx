import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaBoxOpen, FaTags, FaClipboardList, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

type Stats = {
  products: number;
  categories: number;
  orders: number;
  users: number;
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true); // State to manage the welcome message visibility
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();

    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const fetchStats = async () => {
    const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
      fetch('http://localhost:5000/api/products'),
      fetch('http://localhost:5000/api/categories'),
      fetch('http://localhost:5000/api/order/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
      fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    ]);

    const products = await productsRes.json();
    const categories = await categoriesRes.json();
    const orders = await ordersRes.json();
    const users = await usersRes.json();

    setStats({
      products: products.length,
      categories: categories.length,
      orders: orders.length,
      users: users.length,
    });

    setRecentOrders(orders.slice(-5).reverse());
    setLastUpdated(new Date().toLocaleString());
  };

  const chartData = [
    {
      name: 'Overview',
      Products: stats.products,
      Categories: stats.categories,
      Orders: stats.orders,
      Users: stats.users,
    },
  ];

  const handleCardClick = (page: string) => {
    navigate(`/${page}`);
  };

  const Card = ({
    title,
    count,
    icon,
    color,
    onClick,
  }: {
    title: string;
    count: number;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
  }) => (
    <div className={`dashboard-card ${color}`} onClick={onClick}>
      <div className="dashboard-icon">{icon}</div>
      <div>
        <h3 className="dashboard-card-title">{title}</h3>
        <p className="dashboard-card-count">Total: {count}</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-date">Last updated: {lastUpdated}</p>

      {showWelcomeMessage && <div className="welcome-message">Welcome Back, Admin!</div>}

      <div className="tabs" role="tablist">
        <div
          role="tab"
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </div>
        <div
          role="tab"
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </div>
      </div>

      <div role="tabpanel" hidden={activeTab !== 'overview'}>
        <div className="dashboard-cards">
          <Card
            title="Products"
            count={stats.products}
            icon={<FaBoxOpen />}
            color="bg-blue"
            onClick={() => handleCardClick('product')}
          />
          <Card
            title="Categories"
            count={stats.categories}
            icon={<FaTags />}
            color="bg-green"
            onClick={() => handleCardClick('category')}
          />
          <Card
            title="Orders"
            count={stats.orders}
            icon={<FaClipboardList />}
            color="bg-purple"
            onClick={() => handleCardClick('orders')}
          />
          <Card
            title="Users"
            count={stats.users}
            icon={<FaUsers />}
            color="bg-orange"
            onClick={() => handleCardClick('user')}
          />
        </div>

        <div className="recent-orders-section">
          <h2 className="section-title">Recent Orders</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Order ID</th>
                <th>User</th>
                <th>Product</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{order.id}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>{order.product?.name || 'N/A'}</td>
                  <td>{order.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div role="tabpanel" hidden={activeTab !== 'analytics'}>
        <div className="dashboard-chart">
          <h2 className="chart-title">System Summary</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Products" fill="#3b82f6" />
              <Bar dataKey="Categories" fill="#10b981" />
              <Bar dataKey="Orders" fill="#8b5cf6" />
              <Bar dataKey="Users" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
