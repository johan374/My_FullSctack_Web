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
    
        } catch (error) {
            console.error("Login error details:", {
                status: error.response?.status,
                data: error.response?.data
            });
            
            setError(
                error.response?.data?.error || 
                error.response?.data?.detail || 
                "Invalid credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
            
            {error && (
                <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md" role="alert">
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