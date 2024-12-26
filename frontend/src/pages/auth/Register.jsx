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

    const validateForm = () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return false;
        }
        if (username.length < 3) {
            setError("Username must be at least 3 characters");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Invalid email format");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent submission if already loading
        if (loading) return;
        
        try {
            setLoading(true);
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
            console.error("Registration error:", error.response);
            
            let errorMessage = "";

            // Check for specific error messages from backend
            if (error.response?.data?.error) {
                const errorText = error.response.data.error;
                if (errorText.includes('username already exists')) {
                    errorMessage = "Username already exists";
                } else if (errorText.includes('email already exists')) {
                    errorMessage = "Email already exists";
                } else {
                    errorMessage = errorText;
                }
            } else {
                // Handle by status code if no specific message
                switch (error.response?.status) {
                    case 429:
                        errorMessage = "Too many attempts. Please try again later";
                        break;
                    case 500:
                        errorMessage = "Server error. Please try again later";
                        break;
                    case 400:
                        errorMessage = "Invalid input. Please check your details.";
                        break;
                    case 409:
                        errorMessage = "Username or email already exists";
                        break;
                    default:
                        errorMessage = "Registration failed. Please try again";
                }
            }
            
            setError(errorMessage);
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Register</h1>

            {error && <div className="error-message">{error}</div>}
            
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                minLength={3}
            />
    
            <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
    
            <div className="password-input-container ml-8">
                <input
                    className="form-input"
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

            <div className="password-input-container ml-8">
                <input
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
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

            {loading && <LoadingIndicator />}
            
            <button
                className="form-button"
                type="submit"
                disabled={loading || !username || !email || !password || !confirmPassword}
            >
                {loading ? "Loading..." : "Register"}
            </button>

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
    
            <div className="form-footer">
                Already have an account? <Link to="/login">Login here</Link>
            </div>
        </form>
    );
}

export default Register;