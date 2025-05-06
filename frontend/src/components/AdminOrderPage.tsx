import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrderPage.css";

interface Order {
  id: number;
  product: { name: string };
  user: { name: string; email: string };
  quantity: number;
  totalPrice: number;
  createdAt: string;
  status: string;
}

const AdminOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const handleCancel = async (orderId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Order cancelled.");
      fetchOrders();
    } catch (err) {
      alert("Failed to cancel order");
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/order/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="admin-orders-container">
      <h2 className="orders-heading">All Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders-text">No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className="order-card">
              <div className="order-info">
                <strong>Product:</strong> {order.product.name}<br />
                <strong>User:</strong> {order.user.name}<br />
                <strong>Email:</strong> {order.user.email}<br />
                <strong>Quantity:</strong> {order.quantity}<br />
                <strong>Total:</strong> ₹{order.totalPrice}<br />
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}<br />
                <strong>Status:</strong>{" "}
                {order.status === "cancelled" ? (
                  <span className="cancelled-status">Cancelled</span>
                ) : (
                  <select
                    value={order.status}
                    className={`status-dropdown ${order.status}`}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}
              </div> 

                <div className="order-actions">
                  {order.status !== "cancelled" && (
                    <button onClick={() => handleCancel(order.id)} className="cancel-order-button">
                      Cancel Order
                    </button>
                  )}
                </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminOrderPage;
