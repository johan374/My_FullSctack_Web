import { useState } from "react";
import api from '../../utils/api';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import "../../styles/Form.css";
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        try {
            const res = await api.post("/api/token/", { 
                login,
                password,
                remember_me: rememberMe 
            });
    
            console.log('Login response:', res); // For debugging
    
            // Check if we got tokens in the response
            if (res.data?.access) {
                // Always store tokens in localStorage for consistency
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                if (res.data.refresh) {
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                }
                
                // Store username
                localStorage.setItem('username', login);
                
                // Navigate to dashboard
                navigate("/dashboard");
            } else {
                setError("Invalid response from server");
            }
    
        }  catch (error) {
            console.error("Login error:", error.response);
            
            let errorMessage;
            switch (error.response?.status) {
                case 429:
                    errorMessage = "Too many attempts. Please try again later";
                    break;
                case 500:
                    errorMessage = "Server error. Please try again later";
                    break;
                case 401:
                case 403:
                    errorMessage = "Invalid credentials. Please try again";
                    break;
                default:
                    errorMessage = "Login failed. Please try again";
            }
            setError(errorMessage);
         } finally {
            setLoading(false);
         }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Login</h1>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            <input
                className="form-input"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Username or Email"
                required
                disabled={loading}
            />
    
            <div className="password-input-container ml-8">
                <input
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
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
                disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            <label className="remember-me">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
            </label>
    
            <div className="form-footer">
                Don't have an account? <Link to="/register">Create an account</Link>
            </div>
            <div className="form-footer">
                Forgot your password? <Link to="/forgot-password">Recover password</Link>
            </div>
        </form>
    );
}

export default Login;

/*case 200: // Success
case 201: // Created successfully
case 400: // Bad request - validation failed
case 401: // Unauthorized - invalid credentials
case 403: // Forbidden - lack permissions
case 404: // Not found
case 429: // Too many requests - rate limit
case 500: // Server error*/ 