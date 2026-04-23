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
    
    if (metRequirements <= 2) return { strength: "Weak", color: "text-red-400", width: "25%" };
    if (metRequirements <= 4) return { strength: "Fair", color: "text-yellow-400", width: "50%" };
    if (metRequirements <= 5) return { strength: "Good", color: "text-blue-400", width: "75%" };
    return { strength: "Strong", color: "text-emerald-400", width: "100%" };
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
    <div className="container">
      
      {/* Animated Background Elements */}
      <div className="bgLayer">
        <div className="orb1"></div>
        <div className="orb2"></div>
        <div className="orb3"></div>
        <div className="orb4"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="gridPattern" />

      <div className="wrapper">
        
        {/* Logo */}
        <div className="logoContainer">
          <div className="logoWrapper">
            <div className="logoGlow"></div>
            <div className="logoIcon">
              <FiHexagon className="text-3xl" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="glassCard">
          
          <div className="cardBody">
            
            {/* Header */}
            <div className="header">
              <h1 className="title">
                <span className="titleGradient">Schedule</span>
                <span className="text-white"> System</span>
              </h1>
              <p className="subtitle">
                {isRegister ? "Create your account to get started" : "Welcome back! Please enter your details"}
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alertError">
                <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                <span className="text-sm flex-1">{error}</span>
                <button 
                  onClick={() => setError("")}
                  className="closeButton"
                  aria-label="Dismiss error"
                >
                  <FiXCircle className="text-base" />
                </button>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="alertSuccess">
                <FiCheckCircle className="mt-0.5 flex-shrink-0" />
                <span className="text-sm flex-1">{success}</span>
              </div>
            )}

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Field (Register only) */}
              {isRegister && (
                <div className="formGroup">
                  <label className="label">
                    Full Name
                  </label>
                  <div className={`${"inputWrapper"} group`}>
                    <FiUser className="inputIcon" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className={`${"inputField"} ${
                        touchedFields.name && !isValidName(form.name) && form.name.length > 0
                          ? "inputFieldError"
                          : "inputFieldValid"
                      }`}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onBlur={() => handleFieldBlur('name')}
                      onFocus={() => setShowPasswordRequirements(false)}
                      disabled={loading}
                    />
                    {touchedFields.name && form.name.length > 0 && (
                      <div className="inputActionIcon">
                        {isValidName(form.name) ? (
                          <FiCheckCircle className="text-emerald-400 text-base" />
                        ) : (
                          <FiAlertCircle className="text-red-400 text-base" />
                        )}
                      </div>
                    )}
                  </div>
                  {touchedFields.name && !isValidName(form.name) && form.name.length > 0 && (
                    <p className="errorText">Name must be at least 2 characters</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="formGroup">
                <label className="label">
                  Email Address
                </label>
                <div className="inputWrapper">
                  <FiMail className="inputIcon" />
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    className={`${"inputField"} ${
                      touchedFields.email && !isValidEmail(form.email) && form.email.length > 0
                        ? "inputFieldError"
                        : "inputFieldValid"
                    }`}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onBlur={() => handleFieldBlur('email')}
                    onFocus={() => setShowPasswordRequirements(false)}
                    disabled={loading}
                  />
                  {touchedFields.email && form.email.length > 0 && (
                    <div className="inputActionIcon">
                      {isValidEmail(form.email) ? (
                        <FiCheckCircle className="text-emerald-400 text-base" />
                      ) : (
                        <FiAlertCircle className="text-red-400 text-base" />
                      )}
                    </div>
                  )}
                </div>
                {touchedFields.email && !isValidEmail(form.email) && form.email.length > 0 && (
                  <p className="errorText">Please enter a valid email address</p>
                )}
              </div>

              {/* Password Field */}
              <div className="formGroup" ref={passwordRef}>
                <label className="label">
                  Password
                </label>
                <div className="inputWrapper">
                  <FiLock className="inputIcon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={isRegister ? "Create password" : "••••••••"}
                    className={`${"inputField"} ${"inputFieldValid"}`}
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
                    className="passwordToggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                  </button>
                </div>

                {/* Password Strength Indicator (Register only) */}
                {isRegister && form.password.length > 0 && (
                  <div className="strengthContainer">
                    <div className="strengthHeader">
                      <span className="strengthLabel">Strength:</span>
                      <span className={`${"strengthValue"} ${passwordStrength.color}`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className="strengthBarBg">
                      <div 
                        className={`${"strengthBar"} ${
                          passwordStrength.strength === "Weak" ? "bg-red-400" :
                          passwordStrength.strength === "Fair" ? "bg-yellow-400" :
                          passwordStrength.strength === "Good" ? "bg-blue-400" :
                          "bg-emerald-400"
                        }`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                  </div>
                )}

                {/* Password Requirements Dropdown (Desktop) */}
                {isRegister && showPasswordRequirements && (
                  <div 
                    ref={requirementsRef}
                    className="reqDropdownDesktop"
                  >
                    <div className="reqHeaderDesktop">
                      <FiShield className="text-emerald-400 text-sm" />
                      <p className="reqTitleDesktop">
                        Requirements
                      </p>
                    </div>
                    <ul className="reqList">
                      {requirements.map((req) => {
                        const isValid = checkPasswordRequirements()[req.key];
                        return (
                          <li key={req.key} className="reqItem">
                            {isValid ? (
                              <FiCheckCircle className="text-emerald-400 flex-shrink-0 text-xs" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border-2 border-slate-600 flex-shrink-0" />
                            )}
                            <span className={isValid ? "text-slate-300" : "text-slate-500"}>
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
                  <div className="reqDropdownMobile">
                    <p className="reqHeaderMobile">
                      <FiShield className="text-emerald-400" />
                      Requirements
                    </p>
                    <div className="reqGridMobile">
                      {requirements.map((req) => {
                        const isValid = checkPasswordRequirements()[req.key];
                        return (
                          <div key={req.key} className="reqItemMobile">
                            {isValid ? (
                              <FiCheckCircle className="text-emerald-400 text-xs flex-shrink-0" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-600 flex-shrink-0" />
                            )}
                            <span className={`text-xs ${isValid ? "text-slate-300" : "text-slate-500"}`}>
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
                <div className="formGroup">
                  <label className="label">
                    Confirm Password
                  </label>
                  <div className={`${"inputWrapper"} group`}>
                    <FiLock className="inputIcon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Confirm password"
                      className={`${"inputField"} ${
                        form.confirmPassword && form.password !== form.confirmPassword
                          ? "inputFieldError"
                          : "inputFieldValid"
                      }`}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      onFocus={() => setShowPasswordRequirements(false)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="passwordToggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                    >
                      {showConfirmPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                    </button>
                    {form.confirmPassword && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        {form.password === form.confirmPassword ? (
                          <FiCheckCircle className="text-emerald-400 text-base" />
                        ) : (
                          <FiAlertCircle className="text-red-400 text-base" />
                        )}
                      </div>
                    )}
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="errorText">Passwords do not match</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`${"submitBtn"} group`}
              >
                {loading && (
                  <div className="shimmerEffect" />
                )}
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="tracking-wide">
                    {isRegister ? "Create Account" : "Sign In"}
                  </span>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="toggleContainer">
              <p className="toggleText">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                <button
                  onClick={toggleMode}
                  className="toggleBtn"
                  disabled={loading}
                >
                  {isRegister ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="footer">
          <p className="footerText">
            &copy; {new Date().getFullYear()} Schedule Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;