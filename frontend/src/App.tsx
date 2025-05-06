import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./components/AdminDashboard";
import ProductPage from "./components/ProductPage";
import LoginSignup from "./components/LoginSignup";
import Sidebar from "./components/Sidebar";
import SupplierPage from "./components/SupplierPage";
import CategoryPage from "./components/CategoryPage";
import ProfilePage from "./components/ProfilePage";
import UserManagement from "./components/UserManagement";
import UserProductPage from "./pages/UserProductPage";
import UserOrderPage from "./pages/UserOrderPage";
import AdminOrderPage from "./components/AdminOrderPage";

function App() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const isAuthPage = location.pathname === "/";

  return (
    <div className="app-container">
      {!isAuthPage && <Sidebar onSidebarToggle={handleSidebarToggle} />}

      <div className={`content-container ${!isAuthPage && isSidebarCollapsed ? "collapsed" : ""}`}>
        <Routes>
          <Route path="/" element={<LoginSignup />} />

          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/product"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <ProductPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <SupplierPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/category"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <CategoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminOrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <UserManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={['admin', 'user']}>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-product"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <UserProductPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-orders"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <UserOrderPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
