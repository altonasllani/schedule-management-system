import React, { useState, useRef, useEffect, useCallback } from "react";
import http from "../api/http";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiMail,
  FiLock,
  FiUser,
  FiHexagon,
  FiXCircle,
  FiShield
} from "react-icons/fi";

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
  const [touchedFields, setTouchedFields] = useState({});

  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const requirementsRef = useRef(null);
  const formRef = useRef(null);

  // Memoized password requirements check
  const checkPasswordRequirements = useCallback(() => {
    const password = form.password || "";
    const confirmPassword = form.confirmPassword || "";
    
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>[\]]/.test(password),
      match: password === confirmPassword && confirmPassword !== "",
    };
  }, [form.password, form.confirmPassword]);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Name validation
  const isValidName = (name) => {
    return name && name.trim().length >= 2;
  };

  // Get password strength
  const getPasswordStrength = useCallback(() => {
    const req = checkPasswordRequirements();
    const metRequirements = Object.values(req).filter(v => v === true).length;
    
    if (metRequirements <= 2) return { strength: "Weak", color: "login-strength-weak", bar: "login-strength-bar-weak", width: "login-strength-width-weak" };
    if (metRequirements <= 4) return { strength: "Fair", color: "login-strength-fair", bar: "login-strength-bar-fair", width: "login-strength-width-fair" };
    if (metRequirements <= 5) return { strength: "Good", color: "login-strength-good", bar: "login-strength-bar-good", width: "login-strength-width-good" };
    return { strength: "Strong", color: "login-strength-strong", bar: "login-strength-bar-strong", width: "login-strength-width-strong" };
  }, [checkPasswordRequirements]);

  const validateForm = () => {
    if (isRegister) {
      // Name validation
      if (!isValidName(form.name)) {
        setError("Full name must be at least 2 characters.");
        return false;
      }
      
      // Email validation
      if (!isValidEmail(form.email)) {
        setError("Please enter a valid email address.");
        return false;
      }
      
      // Password requirements
      const req = checkPasswordRequirements();
      if (!req.length || !req.uppercase || !req.lowercase || !req.number || !req.special) {
        setError("Password must meet all security requirements.");
        return false;
      }
      
      // Password match
      if (!req.match) {
        setError("Passwords do not match.");
        return false;
      }
    } else {
      // Login validation
      if (!form.email.trim()) {
        setError("Email address is required.");
        return false;
      }
      if (!isValidEmail(form.email)) {
        setError("Please enter a valid email address.");
        return false;
      }
      if (!form.password) {
        setError("Password is required.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? { 
            name: form.name.trim(), 
            email: form.email.trim().toLowerCase(), 
            password: form.password 
          }
        : { 
            email: form.email.trim().toLowerCase(), 
            password: form.password 
          };

      const res = await http.post(endpoint, payload);
      const { user, accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);

      setSuccess(isRegister ? "Account created successfully! Redirecting..." : "Login successful! Redirecting...");
      
      // Clear form
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      
      // Redirect after delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (err) {
      console.error("Auth error:", err);
      
      if (!err.response) {
        setError("Network error. Please check your connection and try again.");
      } else {
        switch (err.response.status) {
          case 401:
            setError("Invalid email or password. Please try again.");
            break;
          case 409:
            setError("This email is already registered. Please log in instead.");
            break;
          case 429:
            setError("Too many attempts. Please try again later.");
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError(err.response?.data?.error || "An unexpected error occurred. Please try again.");
        }
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
    setShowPasswordRequirements(false);
    setTouchedFields({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handlePasswordFocus = () => {
    if (isRegister) {
      setShowPasswordRequirements(true);
    }
  };

  // Close requirements when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showPasswordRequirements &&
        passwordRef.current &&
        requirementsRef.current &&
        !passwordRef.current.contains(e.target) &&
        !requirementsRef.current.contains(e.target)
      ) {
        setShowPasswordRequirements(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPasswordRequirements]);

  const requirements = [
    { key: "length", text: "At least 8 characters", icon: FiCheckCircle },
    { key: "uppercase", text: "One uppercase letter (A-Z)", icon: FiCheckCircle },
    { key: "lowercase", text: "One lowercase letter (a-z)", icon: FiCheckCircle },
    { key: "number", text: "One number (0-9)", icon: FiCheckCircle },
    { key: "special", text: "One special character (!@#$%^&*)", icon: FiCheckCircle },
  ];

  const passwordStrength = getPasswordStrength();

  return (
    <div className="login-page">
      
      {/* Animated Background Elements */}
      <div className="login-bg-layer">
        <div className="login-orb-1"></div>
        <div className="login-orb-2"></div>
        <div className="login-orb-3"></div>
        <div className="login-orb-4"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="login-grid-pattern" />

      <div className="login-wrapper">
        
        {/* Logo */}
        <div className="login-logo-container">
          <div className="login-logo-wrapper">
            <div className="login-logo-glow"></div>
            <div className="login-logo-icon">
              <FiHexagon className="icon-3xl" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="login-card">
          
          <div className="login-card-body">
            
            {/* Header */}
            <div className="login-header">
              <h1 className="login-title">
                <span className="login-title-gradient">Schedule</span>
                <span className="login-title-plain"> System</span>
              </h1>
              <p className="login-subtitle">
                {isRegister ? "Create your account to get started" : "Welcome back! Please enter your details"}
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="login-alert-error">
                <FiAlertCircle className="icon-alert" />
                <span className="login-alert-text">{error}</span>
                <button 
                  onClick={() => setError("")}
                  className="login-close-button"
                  aria-label="Dismiss error"
                >
                  <FiXCircle className="icon-base" />
                </button>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="login-alert-success">
                <FiCheckCircle className="icon-alert" />
                <span className="login-alert-text">{success}</span>
              </div>
            )}

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="login-form">
              
              {/* Name Field (Register only) */}
              {isRegister && (
                <div className="login-form-group">
                  <label className="login-label">
                    Full Name
                  </label>
                  <div className="login-input-wrapper">
                    <FiUser className="login-input-icon" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className={`${"login-input"} ${
                        touchedFields.name && !isValidName(form.name) && form.name.length > 0
                          ? "login-input-error"
                          : "login-input-valid"
                      }`}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onBlur={() => handleFieldBlur('name')}
                      onFocus={() => setShowPasswordRequirements(false)}
                      disabled={loading}
                    />
                    {touchedFields.name && form.name.length > 0 && (
                      <div className="login-input-action">
                        {isValidName(form.name) ? (
                          <FiCheckCircle className="login-validation-success" />
                        ) : (
                          <FiAlertCircle className="login-validation-error" />
                        )}
                      </div>
                    )}
                  </div>
                  {touchedFields.name && !isValidName(form.name) && form.name.length > 0 && (
                    <p className="login-error-text">Name must be at least 2 characters</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="login-form-group">
                <label className="login-label">
                  Email Address
                </label>
                <div className="login-input-wrapper">
                  <FiMail className="login-input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    className={`${"login-input"} ${
                      touchedFields.email && !isValidEmail(form.email) && form.email.length > 0
                        ? "login-input-error"
                        : "login-input-valid"
                    }`}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onBlur={() => handleFieldBlur('email')}
                    onFocus={() => setShowPasswordRequirements(false)}
                    disabled={loading}
                  />
                  {touchedFields.email && form.email.length > 0 && (
                    <div className="login-input-action">
                      {isValidEmail(form.email) ? (
                        <FiCheckCircle className="login-validation-success" />
                      ) : (
                        <FiAlertCircle className="login-validation-error" />
                      )}
                    </div>
                  )}
                </div>
                {touchedFields.email && !isValidEmail(form.email) && form.email.length > 0 && (
                  <p className="login-error-text">Please enter a valid email address</p>
                )}
              </div>

              {/* Password Field */}
              <div className="login-form-group" ref={passwordRef}>
                <label className="login-label">
                  Password
                </label>
                <div className="login-input-wrapper">
                  <FiLock className="login-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={isRegister ? "Create password" : "••••••••"}
                    className={`${"login-input"} ${"login-input-valid"}`}
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      if (isRegister && !showPasswordRequirements) {
                        setShowPasswordRequirements(true);
                      }
                    }}
                    onFocus={handlePasswordFocus}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff className="icon-base" /> : <FiEye className="icon-base" />}
                  </button>
                </div>

                {/* Password Strength Indicator (Register only) */}
                {isRegister && form.password.length > 0 && (
                  <div className="login-strength">
                    <div className="login-strength-header">
                      <span className="login-strength-label">Strength:</span>
                      <span className={`strengthValue ${passwordStrength.color}`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className="login-strength-track">
                      <div 
                        className={`strengthBar ${passwordStrength.bar} ${passwordStrength.width}`}
                      />
                    </div>
                  </div>
                )}

                {/* Password Requirements Dropdown (Desktop) */}
                {isRegister && showPasswordRequirements && (
                  <div 
                    ref={requirementsRef}
                    className="login-req-desktop"
                  >
                    <div className="login-req-header-desktop">
                      <FiShield className="login-req-shield" />
                      <p className="login-req-title-desktop">
                        Requirements
                      </p>
                    </div>
                    <ul className="login-req-list">
                      {requirements.map((req) => {
                        const isValid = checkPasswordRequirements()[req.key];
                        return (
                          <li key={req.key} className="login-req-item">
                            {isValid ? (
                              <FiCheckCircle className="login-req-icon-valid" />
                            ) : (
                              <div className="login-req-icon-empty" />
                            )}
                            <span className={isValid ? "login-req-text-valid" : "login-req-text-muted"}>
                              {req.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                {/* Password Requirements (Mobile) */}
                {isRegister && showPasswordRequirements && (
                  <div className="login-req-mobile">
                    <p className="login-req-header-mobile">
                      <FiShield className="login-req-shield-mobile" />
                      Requirements
                    </p>
                    <div className="login-req-grid-mobile">
                      {requirements.map((req) => {
                        const isValid = checkPasswordRequirements()[req.key];
                        return (
                          <div key={req.key} className="login-req-item-mobile">
                            {isValid ? (
                              <FiCheckCircle className="login-req-icon-valid-mobile" />
                            ) : (
                              <div className="login-req-icon-empty-mobile" />
                            )}
                            <span className={`login-req-text-mobile ${isValid ? "login-req-text-valid" : "login-req-text-muted"}`}>
                              {req.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field (Register only) */}
              {isRegister && (
                <div className="login-form-group">
                  <label className="login-label">
                    Confirm Password
                  </label>
                  <div className="login-input-wrapper">
                    <FiLock className="login-input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Confirm password"
                      className={`${"login-input"} ${
                        form.confirmPassword && form.password !== form.confirmPassword
                          ? "login-input-error"
                          : "login-input-valid"
                      }`}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      onFocus={() => setShowPasswordRequirements(false)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                    >
                    {showConfirmPassword ? <FiEyeOff className="icon-base" /> : <FiEye className="icon-base" />}
                    </button>
                    {form.confirmPassword && (
                      <div className="login-confirm-status">
                        {form.password === form.confirmPassword ? (
                          <FiCheckCircle className="login-validation-success" />
                        ) : (
                          <FiAlertCircle className="login-validation-error" />
                        )}
                      </div>
                    )}
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="login-error-text">Passwords do not match</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="login-submit"
              >
                {loading && (
                  <div className="login-shimmer" />
                )}
                {loading ? (
                  <div className="login-submit-spinner" />
                ) : (
                  <span className="login-submit-text">
                    {isRegister ? "Create Account" : "Sign In"}
                  </span>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="login-toggle-container">
              <p className="login-toggle-text">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                <button
                  onClick={toggleMode}
                  className="login-toggle-button"
                  disabled={loading}
                >
                  {isRegister ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="login-footer">
          <p className="login-footer-text">
            &copy; {new Date().getFullYear()} Schedule Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

