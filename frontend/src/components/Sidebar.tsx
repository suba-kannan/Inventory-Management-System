import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaBox,
  FaBoxes,
  FaTag,
  FaClipboardList,
  FaTruck,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import './Sidebar.css';
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
  onSidebarToggle: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSidebarToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    onSidebarToggle(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const adminMenuItems = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "/admin-dashboard" },
    { icon: <FaBox />, label: "Product", path: "/product" },
    { icon: <FaTag />, label: "Category", path: "/category" },
    { icon: <FaTruck />, label: "Suppliers", path: "/suppliers" },
    { icon: <FaClipboardList />, label: "Orders", path: "/orders" },
    { icon: <FaUsers />, label: "User", path: "/user" },
    { icon: <FaUserCircle />, label: "Profile", path: "/profile" },
  ];

  const userMenuItems = [
    { icon: <FaBox />, label: "Product", path: "/user-product" },
    { icon: <FaClipboardList />, label: "Orders", path: "/user-orders" },
    { icon: <FaUserCircle />, label: "Profile", path: "/profile" },
  ];

  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="logo-section" onClick={toggleSidebar}>
        <FaBoxes className="logo-icon" />
        {!collapsed && <span className="logo-text">InventoryPro</span>}
      </div>

      <ul className="menu">
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `menu-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="label">{item.label}</span>}
            </NavLink>
          </li>
        ))}
        <li>
          <div className="menu-item" onClick={handleLogout}>
            <span className="icon"><FaSignOutAlt /></span>
            {!collapsed && <span className="label">Logout</span>}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
