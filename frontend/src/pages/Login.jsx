// Login.jsx - Version me background të bardhë dhe kartë të madhe
import React, { useState, useEffect, useRef } from "react";
import http from "../api/http";
import { useNavigate } from "react-router-dom";
import { 
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const Login = ({ setUser }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const passwordRef = useRef(null);
  const requirementsRef = useRef(null);

  // Check password requirements
  const checkPasswordRequirements = () => {
    const requirements = {
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      lowercase: /[a-z]/.test(form.password),
      number: /[0-9]/.test(form.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
      match: form.password === form.confirmPassword && form.confirmPassword !== ""
    };
    return requirements;
  };

  // Form validation
  const validateForm = () => {
    if (isRegister) {
      if (!form.name.trim()) {
        setError("Full name is required");
        return false;
      }
      if (form.name.trim().length < 2) {
        setError("Name must be at least 2 characters");
        return false;
      }
      if (!form.email.trim()) {
        setError("Email is required");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(form.email)) {
        setError("Invalid email format");
        return false;
      }
      if (!form.password) {
        setError("Password is required");
        return false;
      }
      
      // Check all password requirements for register
      const req = checkPasswordRequirements();
      if (!req.length) {
        setError("Password must be at least 8 characters");
        return false;
      }
      if (!req.uppercase) {
        setError("Password must contain at least one uppercase letter");
        return false;
      }
      if (!req.lowercase) {
        setError("Password must contain at least one lowercase letter");
        return false;
      }
      if (!req.number) {
        setError("Password must contain at least one number");
        return false;
      }
      if (!req.special) {
        setError("Password must contain at least one special character");
        return false;
      }
      
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    } else {
      if (!form.email.trim()) {
        setError("Email is required");
        return false;
      }
      if (!form.password) {
        setError("Password is required");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // REGISTER - Dërgo te backend për të ruajtur në PostgreSQL
        const res = await http.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password
        });

        const { user, accessToken, refreshToken } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setUser(user);
        
        setSuccess(`Registration successful! Welcome ${user.name}`);
        
        // Navigate after successful registration
        setTimeout(() => {
          navigate("/");
        }, 2000);
        
      } else {
        // LOGIN - Dërgo te backend për të verifikuar kredencialet në PostgreSQL
        const res = await http.post("/auth/login", {
          email: form.email,
          password: form.password
        });

        const { user, accessToken, refreshToken } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setUser(user);
        
        setSuccess(`Login successful! Welcome ${user.name}`);
        
        // Navigate after successful login
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
      
    } catch (err) {
      console.error("Login/Register error:", err);
      
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 409) {
        setError("This email is already registered");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Please check your connection.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Server is not available. Please check if the server is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setSuccess("");
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowPasswordRequirements(false);
  };

  // Show password requirements when typing password
  const handlePasswordChange = (e) => {
    setForm({ ...form, password: e.target.value });
    if (isRegister && e.target.value.length > 0) {
      setShowPasswordRequirements(true);
    }
  };

  // Hide password requirements when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPasswordRequirements && 
          passwordRef.current && 
          requirementsRef.current &&
          !passwordRef.current.contains(e.target) && 
          !requirementsRef.current.contains(e.target)) {
        setShowPasswordRequirements(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPasswordRequirements]);

  const requirements = checkPasswordRequirements();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      {/* Kartë shumë e madhe - 576px */}
      <div className="large-login-container">
        {/* Login/Register Card - Shumë e madhe me background të bardhë */}
        <div className="large-login-card">
          <div className="card-content">
            
            {/* Header */}
            <div className="flex flex-col items-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 text-center mb-3">
                Schedule System
              </h1>
              <p className="text-xl text-gray-600 text-center">
                {isRegister ? "Create a new account" : "Login to your account"}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-10 rounded-xl bg-emerald-50 border border-emerald-200 px-8 py-5 text-lg text-emerald-800 text-center animate-fadeIn flex items-center justify-center gap-4">
                <FaCheckCircle size={22} className="text-emerald-600" />
                <span className="font-medium">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-10 rounded-xl bg-red-50 border border-red-200 px-8 py-5 text-lg text-red-800 text-center flex items-center justify-center gap-4 animate-pulse">
                <FaExclamationTriangle size={22} className="text-red-600" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-10">
              {isRegister && (
                <div className="animate-fadeIn">
                  <label className="block text-lg font-medium text-gray-700 mb-4">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-6 py-5 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300 hover:bg-gray-100"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required={isRegister}
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-4">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-6 py-5 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300 hover:bg-gray-100"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative" ref={passwordRef}>
                <label className="block text-lg font-medium text-gray-700 mb-4">
                  Password
                </label>
                <div className="password-field-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isRegister ? "At least 8 characters" : "Enter your password"}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-6 py-5 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300 hover:bg-gray-100"
                    value={form.password}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="eye-icon-button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                  </button>
                </div>

                {/* Password Requirements Tooltip */}
                {isRegister && showPasswordRequirements && form.password.length > 0 && (
                  <div 
                    ref={requirementsRef}
                    className="password-requirements-tooltip animate-fadeIn"
                    style={{
                      padding: "1.75rem",
                      borderRadius: "1rem",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <p className="text-lg font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-200">
                      Password requirements:
                    </p>
                    <ul className="text-lg space-y-4">
                      <li className="flex items-center gap-4">
                        <div className={`requirement-dot ${requirements.length ? 'fulfilled' : 'unfulfilled'}`} />
                        <span className={`flex-1 ${requirements.length ? 'text-emerald-600' : 'text-gray-600'}`}>
                          At least 8 characters
                        </span>
                        <span className="text-base text-gray-500">{form.password.length}/8</span>
                      </li>
                      <li className="flex items-center gap-4">
                        <div className={`requirement-dot ${requirements.uppercase ? 'fulfilled' : 'unfulfilled'}`} />
                        <span className={`flex-1 ${requirements.uppercase ? 'text-emerald-600' : 'text-gray-600'}`}>
                          One uppercase letter
                        </span>
                      </li>
                      <li className="flex items-center gap-4">
                        <div className={`requirement-dot ${requirements.lowercase ? 'fulfilled' : 'unfulfilled'}`} />
                        <span className={`flex-1 ${requirements.lowercase ? 'text-emerald-600' : 'text-gray-600'}`}>
                          One lowercase letter
                        </span>
                      </li>
                      <li className="flex items-center gap-4">
                        <div className={`requirement-dot ${requirements.number ? 'fulfilled' : 'unfulfilled'}`} />
                        <span className={`flex-1 ${requirements.number ? 'text-emerald-600' : 'text-gray-600'}`}>
                          One number (0-9)
                        </span>
                      </li>
                      <li className="flex items-center gap-4">
                        <div className={`requirement-dot ${requirements.special ? 'fulfilled' : 'unfulfilled'}`} />
                        <span className={`flex-1 ${requirements.special ? 'text-emerald-600' : 'text-gray-600'}`}>
                          One special character
                        </span>
                      </li>
                      {isRegister && (
                        <li className="flex items-center gap-4">
                          <div className={`requirement-dot ${requirements.match ? 'fulfilled' : 'unfulfilled'}`} />
                          <span className={`flex-1 ${requirements.match ? 'text-emerald-600' : 'text-gray-600'}`}>
                            Passwords must match
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {isRegister && (
                <div className="animate-fadeIn">
                  <label className="block text-lg font-medium text-gray-700 mb-4">
                    Confirm Password
                  </label>
                  <div className="password-field-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-6 py-5 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300 hover:bg-gray-100"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required={isRegister}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="eye-icon-button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-2xl py-6 text-white font-bold tracking-wide transition-all duration-300 text-xl
                  ${
                    loading
                      ? "bg-emerald-400 cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg hover:shadow-2xl hover:-translate-y-1 transform"
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-7 w-7 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xl">
                      {isRegister ? "Registering..." : "Logging in..."}
                    </span>
                  </div>
                ) : (
                  isRegister ? "Create Account" : "Sign In"
                )}
              </button>
            </form>

            {/* Toggle between Login/Register */}
            <div className="mt-16 pt-10 border-t border-gray-200">
              <div className="text-center">
                <p className="text-lg text-gray-600">
                  {isRegister ? "Already have an account?" : "Don't have an account?"}
                  <button
                    onClick={toggleMode}
                    disabled={loading}
                    className="ml-3 text-emerald-600 hover:text-emerald-700 font-bold transition-colors duration-300 disabled:text-gray-400 disabled:cursor-not-allowed text-xl"
                  >
                    {isRegister ? "Sign In" : "Create Account"}
                  </button>
                </p>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-16 text-center text-base text-gray-500">
              © {new Date().getFullYear()} Schedule Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;