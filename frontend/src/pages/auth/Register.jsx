import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import "../../styles/Form.css";
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validateForm = () => {
        // Reset all error states
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setError("");
    
        let isValid = true;
    
        // Username validation
        if (username.length < 3) {
            setUsernameError("Username must be at least 3 characters");
            isValid = false;
        }
    
        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError("Please enter a valid email address");
            isValid = false;
        }
    
        // Password validation
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one uppercase letter");
            isValid = false;
        } else if (!/[a-z]/.test(password)) {
            setPasswordError("Password must contain at least one lowercase letter");
            isValid = false;
        } else if (!/[0-9]/.test(password)) {
            setPasswordError("Password must contain at least one number");
            isValid = false;
        }
    
        // Confirm password validation
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            isValid = false;
        }
    
        return isValid;
    };
    
    // Enhanced handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (loading) return;
        
        try {
            setLoading(true);
            // Reset all error states
            setUsernameError("");
            setEmailError("");
            setPasswordError("");
            setError("");
    
            if (!validateForm()) {
                setLoading(false);
                return;
            }
    
            const response = await api.post("/api/user/register/", {
                username,
                email,
                password,
                confirm_password: confirmPassword
            });
    
            console.log('Registration response:', response);
    
            if (response.status === 201) {
                alert("Registration successful! Please login.");
                navigate("/login");
                return;
            }
    
        } catch (error) {
            console.error("Full registration error:", error);
            console.error("Error response:", error.response);
            console.error("Error data:", error.response?.data);
            console.error("Error status:", error.response?.status);
            
            if (error.response) {
                const errorData = error.response.data;
                console.log("Detailed error data:", errorData);
        
                // More flexible error handling
                if (errorData.error) {
                    if (errorData.error.toLowerCase().includes('username')) {
                        setUsernameError(errorData.details ? errorData.details[0] : "Username already exists");
                    } else if (errorData.error.toLowerCase().includes('email')) {
                        setEmailError(errorData.details ? errorData.details[0] : "Email already exists");
                    } else {
                        setError(errorData.error);
                    }
                } else {
                    // Fallback error message
                    setError("Registration failed. Please try again");
                }
            } else if (error.request) {
                // The request was made but no response was received
                setError("No response from server. Please check your network connection.");
            } else {
                // Something happened in setting up the request
                setError("Error setting up the registration request");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Register</h1>

            {error && <div className="error-message">{error}</div>}
            
            {/* Username input - remains the same */}
            <input
                className={`form-input ${usernameError ? 'border-red-500' : ''}`}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                minLength={3}
            />
            {usernameError && <div className="text-red-500 text-sm mt-1">{usernameError}</div>}

            {/* Email input - remains the same */}
            <input
                className={`form-input ${emailError ? 'border-red-500' : ''}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}

            {/* Password input container */}
            <div className="password-input-container ml-8">
                <input
                    className={`form-input ${passwordError ? 'border-red-500' : ''}`}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    minLength={8}
                    disabled={loading}
                />
                <button
                    type="button"
                    className="password-toggle-button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                >
                    {showPassword ? 
                        <EyeOff className="eye-icon" size={20} /> : 
                        <Eye className="eye-icon" size={20} />
                    }
                </button>
            </div>
            {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}

            {/* Confirm Password input container - added error styling */}
            <div className="password-input-container ml-8">
                <input
                    className={`form-input ${passwordError ? 'border-red-500' : ''}`}
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    disabled={loading}
                    minLength={8}
                />
                <button
                    type="button"
                    className="password-toggle-button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                >
                    {showPassword ? 
                        <EyeOff className="eye-icon" size={20} /> : 
                        <Eye className="eye-icon" size={20} />
                    }
                </button>
            </div>

            {/* Terms and Privacy Policy section */}
            <div className="flex items-center justify-center gap-2 mb-3">
                <input 
                    type="checkbox" 
                    id="policy-terms"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    required
                />
                <label 
                    htmlFor="policy-terms"
                    className="text-gray-600"
                >
                    I accept the {' '}
                    <Link 
                        to="/terms" 
                        className="text-blue-600 hover:underline"
                    >
                        Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link 
                        to="/privacy" 
                        className="text-blue-600 hover:underline"
                    >
                        Privacy Policy
                    </Link>
                </label>
            </div>

            {/* Loading indicator and submit button */}
            {loading && <LoadingIndicator />}
            
            <button
                className="form-button"
                type="submit"
                disabled={loading || !username || !email || !password || !confirmPassword}
            >
                {loading ? "Loading..." : "Register"}
            </button>
    
            {/* Login link */}
            <div className="form-footer">
                Already have an account? <Link to="/login">Login here</Link>
            </div>
        </form>
    );
}

export default Register;