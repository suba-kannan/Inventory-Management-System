// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./UserOrderPage.css";

// interface Product {
//   id: number;
//   name: string;
//   price: number;
// }

// interface Order {
//   id: number;
//   product: Product;
//   quantity: number;
//   status: string;
//   createdAt: string;
//   totalPrice?: number;
// }

// const UserOrderPage = () => {
//   const [orders, setOrders] = useState<Order[]>([]);

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("http://localhost:5000/api/order/user", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const ordersWithTotalPrice = response.data.map((order: Order) => ({
//         ...order,
//         totalPrice: order.totalPrice || order.product.price * order.quantity,
//       }));

//       setOrders(ordersWithTotalPrice);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   const handleCancel = async (orderId: number) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:5000/api/order/${orderId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       alert("Order cancelled successfully.");
//       fetchOrders(); 
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//       alert((error as { response?: { data: { message: string } } })?.response?.data?.message || "Failed to cancel order.");
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className="user-order-page">
//       <h2 className="page-title">Your Orders</h2>
//       {orders.length === 0 ? (
//         <p className="no-orders">No orders found.</p>
//       ) : (
//         <ul className="order-list">
//           {orders.map((order) => (
//             <li key={order.id} className="order-item">
//               <div className="order-details">
//                 <div>
//                   <strong className="product-name">{order.product.name}</strong> <br />
//                   <span className="order-info">
//                     Quantity: {order.quantity} <br />
//                     Total: ₹{order.totalPrice?.toFixed(2)} <br />
//                     Status: {order.status} <br />
//                     Date & Time: {new Date(order.createdAt).toLocaleString()} <br />
//                   </span>
//                 </div>
//                 {order.status !== "cancelled" && (
//                   <button
//                     className="cancel-button"
//                     onClick={() => handleCancel(order.id)}
//                   >
//                     Cancel Order
//                   </button>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default UserOrderPage;
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHourglassHalf, FaCheckCircle, FaBoxOpen, FaEnvelopeOpenText, FaTimesCircle } from "react-icons/fa";

import "./UserOrderPage.css";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Order {
  id: number;
  product: Product;
  quantity: number;
  status: string;
  createdAt: string;
  totalPrice?: number;
}

const UserOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/order/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ordersWithTotalPrice = response.data.map((order: Order) => ({
        ...order,
        totalPrice: order.totalPrice || order.product.price * order.quantity,
      }));

      setOrders(ordersWithTotalPrice);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleCancel = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Order cancelled successfully.");
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert((error as { response?: { data: { message: string } } })?.response?.data?.message || "Failed to cancel order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="user-order-page">
      <h2 className="page-title">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-details">
                <div>
                  <strong className="product-name">{order.product.name}</strong> <br />
                  <span className="order-info">
                    Quantity: {order.quantity} <br />
                    Total: ₹{order.totalPrice?.toFixed(2)} <br />
                    Date & Time: {new Date(order.createdAt).toLocaleString()} <br />
                    {/* Status: {order.status} */}
                    <div className={`status ${order.status}`}>
                      <span className="status-icon">
                        {order.status === "pending" && <FaHourglassHalf />}
                        {order.status === "confirmed" && <FaCheckCircle />}
                        {order.status === "shipped" && <FaBoxOpen />}
                        {order.status === "delivered" && <FaEnvelopeOpenText />}
                        {order.status === "cancelled" && <FaTimesCircle />}
                      </span>

                      {order.status}
                    </div>
                  </span>
                </div>
                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <button
                    className="cancel-button"
                    onClick={() => handleCancel(order.id)}
                  >
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

export default UserOrderPage;
