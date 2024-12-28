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

 validateForm = () => {
    // 1. Reset Error States
    // Clear all previous error messages before starting new validation
    // This ensures only current validation errors are displayed
    setUsernameError("");     // Clear username-specific error
    setEmailError("");        // Clear email-specific error
    setPasswordError("");     // Clear password-specific error
    setError("");             // Clear general form error

    // 2. Validation Tracking Variable
    // Initialize a flag to track overall form validity
    // Starts as true, becomes false if any validation fails
    let isValid = true;

    // 3. Username Validation
    // Check if username meets minimum length requirement
    if (username.length < 3) {
        // Set specific error message if username is too short
        setUsernameError("Username must be at least 3 characters");
        // Mark form as invalid
        isValid = false;
    }

    // 4. Email Validation
    // Use a regular expression to validate email format
    // Breakdown of regex:
    // ^[^\s@]+     : Start of string, one or more characters that are not whitespace or @
    // @            : Literal @ symbol
    // [^\s@]+      : One or more characters that are not whitespace or @
    // \.           : Literal dot
    // [^\s@]+      : One or more characters that are not whitespace or @
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        // Set error message for invalid email format
        setEmailError("Please enter a valid email address");
        // Mark form as invalid
        isValid = false;
    }

    // 5. Password Validation
    // Comprehensive password strength checks
    
    // 5.1 Minimum Length Check
    if (password.length < 8) {
        // Ensure password is at least 8 characters long
        setPasswordError("Password must be at least 8 characters");
        isValid = false;
    } 
    // 5.2 Uppercase Letter Check
    else if (!/[A-Z]/.test(password)) {
        // Ensure password contains at least one uppercase letter
        setPasswordError("Password must contain at least one uppercase letter");
        isValid = false;
    } 
    // 5.3 Lowercase Letter Check
    else if (!/[a-z]/.test(password)) {
        // Ensure password contains at least one lowercase letter
        setPasswordError("Password must contain at least one lowercase letter");
        isValid = false;
    } 
    // 5.4 Number Check
    else if (!/[0-9]/.test(password)) {
        // Ensure password contains at least one number
        setPasswordError("Password must contain at least one number");
        isValid = false;
    }

    // 6. Confirm Password Validation
    // Check if password and confirm password match exactly
    if (password !== confirmPassword) {
        // Set error if passwords do not match
        setPasswordError("Passwords do not match");
        isValid = false;
    }

    // 7. Return Validation Result
    // Returns true if all validations pass, false otherwise
    return isValid;
};
    
   // Main form submission handler for user registration
const handleSubmit = async (e) => {
    // 1. Prevent default form submission behavior
    // - Stops the page from reloading
    // - Allows us to handle submission programmatically
    e.preventDefault();
    
    // 2. Prevent multiple submissions
    // - If already loading, exit the function
    // - Stops duplicate form submissions
    if (loading) return;
    
    try {
        // 3. Set loading state
        // - Indicates registration process has started
        // - Disables submit button to prevent multiple clicks
        setLoading(true);
        
        // 4. Reset All Error States
        // - Clears previous error messages
        // - Ensures clean slate for new submission attempt
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setError("");

        // 5. Client-Side Form Validation
        // - Runs comprehensive form validation
        // - Checks all input fields before submission
        if (!validateForm()) {
            // If validation fails:
            // - Stop loading
            // - Prevent form submission
            setLoading(false);
            return;
        }

        // 6. API Registration Request
        // - Send registration data to backend
        // - Uses axios (api) to make POST request
        const response = await api.post("/api/user/register/", {
            // Payload with user registration details
            username,           // Chosen username
            email,              // User's email
            password,           // Chosen password
            confirm_password: confirmPassword  // Password confirmation
        });

        // 7. Log successful registration response
        // - Helps with debugging
        console.log('Registration response:', response);

        // 8. Handle Successful Registration
        if (response.status === 201) {
            // 201 status code indicates successful resource creation
            // - Show success message
            alert("Registration successful! Please login.");
            
            // - Redirect to login page
            navigate("/login");
            return;
        }

    } catch (error) {
        // 9. Comprehensive Error Logging
        // - Logs full error object for debugging
        console.error("Full registration error:", error);
        console.error("Error response:", error.response);
        console.error("Error data:", error.response?.data);
        console.error("Error status:", error.response?.status);
        
        // 10. Error Handling Scenarios
        if (error.response) {
            // 10.1 Server Responded with an Error
            // - Extract error data from server response
            const errorData = error.response.data;
            console.log("Detailed error data:", errorData);
    
            // 10.2 Flexible Error Handling
            if (errorData.error) {
                // Check for specific error types
                if (errorData.error.toLowerCase().includes('username')) {
                    // Username-related error
                    setUsernameError(
                        // Use detailed error or fallback message
                        errorData.details ? errorData.details[0] : "Username already exists"
                    );
                } else if (errorData.error.toLowerCase().includes('email')) {
                    // Email-related error
                    setEmailError(
                        // Use detailed error or fallback message
                        errorData.details ? errorData.details[0] : "Email already exists"
                    );
                } else {
                    // Generic server-side error
                    setError(errorData.error);
                }
            } else {
                // 10.3 Fallback Error Message
                // - Used when no specific error is provided
                setError("Registration failed. Please try again");
            }
        } else if (error.request) {
            // 10.4 Network Error Scenario
            // - Request was sent but no response received
            // - Likely due to network issues
            setError("No response from server. Please check your network connection.");
        } else {
            // 10.5 Request Setup Error
            // - Something went wrong before the request was sent
            setError("Error setting up the registration request");
        }
    } finally {
        // 11. Always Executed: Reset Loading State
        // - Ensures loading state is turned off
        // - Happens whether registration succeeds or fails
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