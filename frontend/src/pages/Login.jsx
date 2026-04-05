import React, { useState, useRef, useEffect } from "react";
import http from "../api/http";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiMonitor } from "react-icons/fi";

const Login = ({ setUser }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const requirementsRef = useRef(null);

  const checkPasswordRequirements = () => {
    return {
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      lowercase: /[a-z]/.test(form.password),
      number: /[0-9]/.test(form.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
      match: form.password === form.confirmPassword && form.confirmPassword !== ""
    };
  };

  const validateForm = () => {
    if (isRegister) {
      if (!form.name.trim() || form.name.trim().length < 2) {
        setError("Full name is required and must be at least 2 characters."); return false;
      }
      if (!/\S+@\S+\.\S+/.test(form.email)) {
        setError("Invalid email format."); return false;
      }
      const req = checkPasswordRequirements();
      if (!req.length || !req.uppercase || !req.lowercase || !req.number || !req.special) {
        setError("Password must meet all security requirements."); return false;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match."); return false;
      }
    } else {
      if (!form.email.trim() || !form.password) {
        setError("Email and Password are required."); return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister 
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const res = await http.post(endpoint, payload);
      const { user, accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);
      
      setSuccess(isRegister ? "Registration successful!" : "Login successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      if (err.response?.status === 401) setError("Invalid email or password");
      else if (err.response?.status === 409) setError("This email is already registered");
      else setError(err.response?.data?.error || "Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError(""); setSuccess("");
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setShowPasswordRequirements(false);
  };

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPasswordRequirements]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-inter text-slate-800">
      <div className="large-login-container">
        <div className="large-login-card">
          <div className="card-content">
            
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                  <FiMonitor className="text-2xl" />
                </div>
              </div>
              <h1 className="title font-bold text-slate-900 mb-2">Schedule System</h1>
              <p className="subtitle text-slate-500">{isRegister ? "Create a new account" : "Login to your account"}</p>
            </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 flex items-start gap-2 text-sm">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-100 flex items-start gap-2 text-sm">
              <FiCheckCircle className="mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text" required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-sm bg-slate-50 focus:bg-white"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email" required
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-sm bg-slate-50 focus:bg-white"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="relative" ref={passwordRef}>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required
                  placeholder={isRegister ? "At least 8 characters" : "Enter your password"}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-sm pr-10 bg-slate-50 focus:bg-white"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (isRegister) setShowPasswordRequirements(true);
                  }}
                  disabled={loading}
                />
                <button
                  type="button" tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 p-1 rounded-md hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {isRegister && showPasswordRequirements && form.password.length > 0 && (
                <div ref={requirementsRef} className="password-requirements-tooltip animate-fadeIn">
                  <p className="text-sm font-semibold text-slate-700 mb-3 border-b border-slate-100 pb-2">Security Requirements:</p>
                  <ul className="text-sm space-y-2">
                    {[
                      { key: 'length', text: 'At least 8 characters' },
                      { key: 'uppercase', text: 'One uppercase letter' },
                      { key: 'lowercase', text: 'One lowercase letter' },
                      { key: 'number', text: 'One number (0-9)' },
                      { key: 'special', text: 'One special character' },
                      { key: 'match', text: 'Passwords must match' }
                    ].map(req => {
                      if (req.key === 'match' && form.confirmPassword === "") return null;
                      const isValid = checkPasswordRequirements()[req.key];
                      return (
                        <li key={req.key} className="flex items-center gap-2">
                          <FiCheckCircle className={isValid ? "text-emerald-500" : "text-slate-300"} />
                          <span className={isValid ? "text-slate-800" : "text-slate-500 transition-colors"}>{req.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"} required
                    placeholder="Repeat your password"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-sm pr-10 bg-slate-50 focus:bg-white"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    disabled={loading}
                  />
                  <button
                    type="button" tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 p-1 rounded-md hover:bg-emerald-50 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#059669' }}
              className="w-full py-3 px-4 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (isRegister ? "Create Account" : "Sign In to System")}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600">
              {isRegister ? "Already have an account?" : "New to the system?"}
              <button 
                onClick={toggleMode}
                className="ml-2 text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                disabled={loading}
              >
                {isRegister ? "Sign In" : "Create an Account"}
              </button>
            </p>
          </div>
          
          </div>
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100 mb-0">
            <p className="text-xs text-slate-500 font-medium">
              © {new Date().getFullYear()} Schedule Management System v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;