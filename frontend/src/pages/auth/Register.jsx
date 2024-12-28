// Import necessary dependencies
import { useState, useEffect } from "react";  // React hooks for state management and side effects
import api from "../../utils/api";            // Custom API utility for HTTP requests
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import LoadingIndicator from "../../components/common/LoadingIndicator";
import { Link } from 'react-router-dom';      // For navigation links
import { Eye, EyeOff } from 'lucide-react';   // Icons for password visibility toggle

function Register() {
    // State declarations using useState hook
    // Each useState returns an array with [value, setter function]
    const [username, setUsername] = useState("");          // Store username input
    const [email, setEmail] = useState("");               // Store email input
    const [password, setPassword] = useState("");         // Store password input
    const [confirmPassword, setConfirmPassword] = useState(""); // Store password confirmation
    const [loading, setLoading] = useState(false);        // Track loading state
    const [error, setError] = useState("");              // Store error messages
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    
    // Object to store validation errors for each field
    const [validationErrors, setValidationErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Get navigate function for redirecting after successful registration
    const navigate = useNavigate();

    // Username validation effect
    // Runs whenever username changes
    useEffect(() => {
        if (username) {  // Only validate if username is not empty
            if (username.length < 3) {
                // Username too short
                setValidationErrors(prev => ({
                    ...prev,  // Keep previous validation errors
                    username: "Username must be at least 3 characters long"
                }));
            } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                // Username contains invalid characters
                // Regex explanation: 
                // ^ - start of string
                // [a-zA-Z0-9_] - only letters, numbers, and underscore allowed
                // + - one or more of the above characters
                // $ - end of string
                setValidationErrors(prev => ({
                    ...prev,
                    username: "Username can only contain letters, numbers, and underscores"
                }));
            } else {
                // Username is valid, clear error
                setValidationErrors(prev => ({ ...prev, username: "" }));
            }
        }
    }, [username]);  // Dependency array - effect runs when username changes

    // Email validation effect
    useEffect(() => {
        if (email) {  // Only validate if email is not empty
            // Email regex pattern:
            // [^\s@] - any character except whitespace or @
            // + - one or more of the above
            // @ - literal @ symbol
            // \. - literal dot
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setValidationErrors(prev => ({
                    ...prev,
                    email: "Please enter a valid email address"
                }));
            } else {
                setValidationErrors(prev => ({ ...prev, email: "" }));
            }
        }
    }, [email]);  // Run when email changes

    // Password validation effect
    useEffect(() => {
        if (password) {  // Only validate if password is not empty
            // Array of validation rules
            const validations = [
                {
                    test: password.length >= 8,
                    message: "Password must be at least 8 characters long"
                },
                {
                    test: /[A-Z]/.test(password),  // Contains uppercase letter
                    message: "Password must contain at least one uppercase letter"
                },
                {
                    test: /[a-z]/.test(password),  // Contains lowercase letter
                    message: "Password must contain at least one lowercase letter"
                },
                {
                    test: /[0-9]/.test(password),  // Contains number
                    message: "Password must contain at least one number"
                }
            ];

            // Find first failed validation rule
            const failedValidation = validations.find(v => !v.test);
            if (failedValidation) {
                // Update error message with first failed validation
                setValidationErrors(prev => ({
                    ...prev,
                    password: failedValidation.message
                }));
            } else {
                // All validations passed, clear error
                setValidationErrors(prev => ({ ...prev, password: "" }));
            }
        }
    }, [password]);  // Run when password changes

    // Confirm password validation effect
    useEffect(() => {
        if (confirmPassword || password) {  // Validate if either password field has input
            if (password !== confirmPassword) {
                // Passwords don't match
                setValidationErrors(prev => ({
                    ...prev,
                    confirmPassword: "Passwords do not match"
                }));
            } else {
                // Passwords match, clear error
                setValidationErrors(prev => ({ ...prev, confirmPassword: "" }));
            }
        }
    }, [password, confirmPassword]);  // Run when either password changes

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior
        
        // Check for any validation errors
        if (Object.values(validationErrors).some(error => error !== "")) {
            setError("Please fix all validation errors before submitting");
            return;
        }

        setLoading(true);  // Start loading state
        setError("");      // Clear any previous errors

        try {
            // Make API request to register user
            const response = await api.post("/api/user/register/", {
                username,
                email,
                password,
                confirm_password: confirmPassword
            });

            // Check if registration was successful
            if (response.status >= 200 && response.status < 300) {
                alert("Registration successful! Please login.");
                navigate("/login");  // Redirect to login page
                return;
            }
        } catch (error) {
            // Variable to store the final error message we'll show to the user
            let errorMessage;
        
            // Check if error has a response with data
            // The '?' is optional chaining - prevents error if response is undefined
            if (error.response?.data) {
                
                // Check if the error data is a simple string
                if (typeof error.response.data === 'string') {
                    // If it's a string, use it directly
                    // Example: "Username already exists"
                    errorMessage = error.response.data;
                } 
                // Check if the error data is an object
                else if (typeof error.response.data === 'object') {
                    // Convert error object to string using Object.entries()
                    // Object.entries() converts object to array of [key, value] pairs
                    // Example error.response.data might look like:
                    // {
                    //    username: ["This username is taken"],
                    //    email: ["Invalid email format"]
                    // }
                    
                    errorMessage = Object.entries(error.response.data)
                        // For each [key, value] pair in the error object:
                        .map(([key, value]) => {
                            // Check if the value is an array
                            // If it is, take first element, otherwise use value as is
                            // Example: 
                            // key = "username", value = ["This username is taken"]
                            // becomes "username: This username is taken"
                            return `${key}: ${Array.isArray(value) ? value[0] : value}`;
                        })
                        // Join all error messages with newlines
                        // Example result:
                        // "username: This username is taken
                        //  email: Invalid email format"
                        .join('\n');
                }
            }
        
            // Set the error state
            // If errorMessage is undefined, use fallback message
            // || is the OR operator - uses right side if left side is falsy
            setError(errorMessage || "Registration failed. Please try again.");
        
        } finally {
            // finally block always runs, whether there was an error or not
            // Make sure to turn off loading state
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md space-y-6">
            {/* max-w-md: Maximum width of 28rem (448px)*/}
            {/* mx-auto: Margin auto on left and right (centers the form)*/}
            {/* mt-8: Margin top of 2rem (32px)*/}
            {/* p-6: Padding of 1.5rem (24px)*/}
            {/* shadow-md: Medium box shadow*/}
            {/*space-y-6: Adds vertical spacing of 1.5rem between child elements*/}
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h1>
    
            {error && (
                <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md" role="alert">
                    {error}
                </div>
            )}
            
            <div className="space-y-2">
            {/*Input container*/}
            {/* space-y-2: Adds vertical spacing of 0.5rem between child elements*/}
                {/*Input container*/}
                {/* w-full: Width 100%*/}
                {/* px-4: Padding left and right of 1rem*/}
                {/* py-2: Padding top and bottom of 0.5rem*/}
                {/* focus:outline-none: Removes default browser outline on focus*/}
                {/* focus:ring-2: Adds a 2px outline ring when focused*/}
                {/* focus:ring-blue-500: Ring color is blue*/}
                {/* border-red-500: Red border for error state*/}
                {/* border-gray-300: Default gray border*/}
                <input
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                        ${validationErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    minLength={3}
                />
                {validationErrors.username && 
                    <p className="text-sm text-red-500 mt-1">{validationErrors.username}</p>
                }
            </div>
    
            <div className="space-y-2">
                <input
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                {validationErrors.email && 
                    <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
                }
            </div>
    
            <div className="space-y-2">
                <div className="relative">
                {/* relative: Enables absolute positioning for children*/}
                    <input
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${validationErrors.password ? 'border-red-500' : 'border-gray-300'}`}
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                    // absolute: Position absolutely within relative parent
                    // right-3: Right padding of 0.75rem
                    // top-1/2: Places at vertical center
                    // -translate-y-1/2: Shifts up by half its height (centers vertically)
                    // disabled:opacity-50: 50% opacity when disabled
                    // disabled:cursor-not-allowed: Shows 'not-allowed' cursor when disabled
                    >
                        
                        {showPassword ? 
                            <EyeOff className="w-5 h-5" /> : 
                            <Eye className="w-5 h-5" />
                        }
                    </button>
                </div>
                {validationErrors.password && 
                    <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
                }
            </div>
    
            <div className="space-y-2">
                <div className="relative">
                    <input
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                    >
                        {showPassword ? 
                            <EyeOff className="w-5 h-5" /> : 
                            <Eye className="w-5 h-5" />
                        }
                    </button>
                </div>
                {validationErrors.confirmPassword && 
                    <p className="text-sm text-red-500 mt-1">{validationErrors.confirmPassword}</p>
                }
            </div>
    
            {loading && (
                <div className="flex justify-center items-center">
                    <LoadingIndicator />
                </div>
            )}
            
            <button
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                type="submit"
                disabled={loading || !username || !email || !password || !confirmPassword || 
                         Object.values(validationErrors).some(error => error !== "")}
                // focus:ring-offset-2: Adds 2px space between button and focus ring
                // transition-colors: Smooth color transitions for hover/focus states
            >
                {loading ? "Loading..." : "Register"}
            </button>
    
            <div className="flex items-center justify-center gap-2">
                <input 
                    type="checkbox" 
                    id="policy-terms"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    // w-4 h-4: Width and height of 1rem (16px)
                    // text-blue-600: Sets the checkbox color when checked
                    required
                />
                <label htmlFor="policy-terms" className="text-sm text-gray-600">
                    I accept the {' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                    </Link>
                </label>
            </div>
    
            <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Login here
                </Link>
            </div>
        </form>
    );
}

export default Register;