// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import "./LoginSignup.css";

// const LoginSignup = () => {
//   const [action, setAction] = useState("Sign Up");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const API_BASE_URL = "http://localhost:5000";

//   const handleSignup = async () => {
//     if (!name || !email || !password || !phone || !role) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

//     if (!passwordRegex.test(password)) {
//       alert("Password must be at least 6 characters long and include at least 1 capital letter, 1 number, and 1 special character.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password, phone, role }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert("Signup successful! Please log in.");
//         setAction("Login");
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error("Error signing up:", error);
//     }
//   };

//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert("Please fill in your email and password.");
//       return;
//     }
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("role", data.role);
//         alert("Login successful!");
//         if (data.role === "admin") {
//           navigate("/admin-dashboard");
//         } else {
//           navigate("/user-product");
//         }
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="form-box">
//         <h2 className="form-title">{action}</h2>
//         <p className="form-subtext">
//           {action === "Sign Up" ? "Create a new account" : "Welcome back! Login to continue"}
//         </p>

//         <div className="form">
//           {action === "Sign Up" && (
//             <div className="form-group">
//               <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
//             </div>
//           )}

//           <div className="form-group">
//             <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//           </div>

//           <div className="form-group password-group">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>

//           {action === "Sign Up" && (
//             <>
//               <div className="form-group">
//                 <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
//               </div>

//               <div className="form-group">
//                 <input type="text" value={role} placeholder="admin/user" onChange={(e) => setRole(e.target.value)} />
//               </div>
//             </>
//           )}

//           <button className="primary-btn" onClick={action === "Sign Up" ? handleSignup : handleLogin}>
//             {action}
//           </button>

//           <div className="toggle-auth">
//             {action === "Sign Up" ? (
//               <p>Already have an account? <span onClick={() => setAction("Login")}>Sign In</span></p>
//             ) : (
//               <p>Don't have an account? <span onClick={() => setAction("Sign Up")}>Sign Up</span></p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginSignup;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5000";

  const handleSignup = async () => {
    if (!name || !email || !password || !phone || !role) {
      alert("Please fill in all fields.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!passwordRegex.test(password)) {
      alert("Password must be at least 6 characters long and include at least 1 capital letter, 1 number, and 1 special character.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful! Please log in.");
        setAction("Login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in your email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert("Login successful!");

        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-product");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    
    <div className="login-container">
      <div className="form-box">
        <div className="branding">
          <h1>InventoryPro</h1>
          <p className="branding-subtext">Smart Inventory & Order Management</p>
        </div>

        <h2 className="form-title">{action}</h2>
        <p className="form-subtext">
          {action === "Sign Up" ? "Create a new account" : "Welcome back! Login to continue"}
        </p>

        <div className="form">
          {action === "Sign Up" && (
            <div className="form-group">
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {action === "Sign Up" && (
            <>
              <div className="form-group">
                <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="form-group">
                <input type="text" value={role} placeholder="Role" onChange={(e) => setRole(e.target.value)} />
              </div>
            </>
          )}

          <button className="primary-btn" onClick={action === "Sign Up" ? handleSignup : handleLogin}>
            {action}
          </button>

          <div className="toggle-auth">
            {action === "Sign Up" ? (
              <p>Already have an account? <span onClick={() => setAction("Login")}>Sign In</span></p>
            ) : (
              <p>Don't have an account? <span onClick={() => setAction("Sign Up")}>Sign Up</span></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
