// Import necessary hooks and components
import { useState } from "react";              // Hook for managing state
import api from "../../utils/api";                      // Custom API module for making HTTP requests
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import LoadingIndicator from "../../components/common/LoadingIndicator"; // Loading spinner component
import "../../styles/Form.css";                   // Import CSS styles for the form
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function Register() {
    // State declarations using useState hook
    const [username, setUsername] = useState("");   // State for username input
    const [email, setEmail] = useState("");        // State for email input
    const [password, setPassword] = useState("");   // State for password input
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false); // State for tracking loading status
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");  // Set error message
            setLoading(false);                   // Disable loading state       
            return false;                        // Stop form submission
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


    // Get the navigate function for redirecting users
    const navigate = useNavigate();

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
<<<<<<< HEAD
        
        // Prevent submission if already loading
=======
        console.log("Form submitted"); // Debug log

>>>>>>> 64c79861667e7f1f262993f3df8d3f520e0d3b8a
        if (loading) return;
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError("");
<<<<<<< HEAD
    
            if (!validateForm()) {
                setLoading(false);  // Don't forget to reset loading if validation fails
                return;
            }
    
=======

            console.log("Sending registration request with:", { username, email }); // Debug log

>>>>>>> 64c79861667e7f1f262993f3df8d3f520e0d3b8a
            const response = await api.post("/api/user/register/", {
                username,
                email,
                password,
                confirm_password: confirmPassword
            });
<<<<<<< HEAD
    
            console.log('Registration response:', response);
    
            // Check for successful response (200 or 201)
            if (response.status === 201) {
                alert("Registration successful! Please login.");
=======

            console.log("Registration response:", response); // Debug log

            if (response.status === 201) {
                console.log("Registration successful");
                toast.success("Registration successful! Please login.");
>>>>>>> 64c79861667e7f1f262993f3df8d3f520e0d3b8a
                navigate("/login");
            }
    
        } catch (error) {
<<<<<<< HEAD
            console.error("Registration error:", error.response);
            
            let errorMessage = "";
=======
            console.error("Full error object:", error); // Debug log
            console.error("Error response data:", error.response?.data); // Debug log

            // Handle backend validation errors
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else if (error.response?.status === 409) {
                setError("Username or email already exists");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
>>>>>>> 64c79861667e7f1f262993f3df8d3f520e0d3b8a
    
            // First check for specific error messages from backend
            if (error.response?.data?.error) {
                const errorText = error.response.data.error;
                if (errorText.includes('username already exists')) {
                    errorMessage = "Username already exists";
                } else if (errorText.includes('email already exists')) {
                    errorMessage = "Email already exists";
                } else {
                    // Use the error message from the backend
                    errorMessage = errorText;
                }
            } else {
                // If no specific error message, handle by status code
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
      // Main form element with onSubmit handler and CSS class
      <form onSubmit={handleSubmit} className="form-container">
          {/* Form title */}
          <h1>Register</h1>

          {error && <div className="error-message">{error}</div>}
          
          {/* Username input field */}
          <input
              className="form-input"            // CSS styling class
              type="text"                       // Text input field
              value={username}                  // Controlled input - value from state
              onChange={(e) => setUsername(e.target.value)}  // Update username state when typing
              placeholder="Username"            // Placeholder text when empty
              required                          // Makes field mandatory
              minLength={3}
          />
  
          {/* Email input field */}
          <input
              className="form-input"            // CSS styling class
              type="email"                      // Email input type (includes validation)
              value={email}                     // Controlled input - value from state
              onChange={(e) => setEmail(e.target.value)}  // Update email state when typing
              placeholder="Email"               // Placeholder text when empty
              required                          // Makes field mandatory
          />
  
          {/* Password input field */}
          <div className="password-input-container ml-8">
          <input
              className="form-input"            // CSS styling class
              type={showPassword ? "text" : "password"}                   // Password input (hides characters)
              value={password}                  // Controlled input - value from state
              onChange={(e) => setPassword(e.target.value)}  // Update password state when typing
              placeholder="Password"            // Placeholder text when empty
              required                          // Makes field mandatory
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
          {/* congirm Password input field */}
        <div className="password-input-container ml-8">
          <input
              className="form-input"            // CSS styling class
              type={showPassword ? "text" : "password"}                   // Password input (hides characters)
              value={confirmPassword}                  // Controlled input - value from state
              onChange={(e) => setConfirmPassword(e.target.value)}  // Update password state when typing
              placeholder="Confirm Password"    // Placeholder text when empty
              required                          // Makes field mandatory
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
  
          {/* Show loading indicator when loading is true */}
          {loading && <LoadingIndicator />}
          
          {/* Submit button */}
          <button
              className="form-button"           // CSS styling class
              type="submit"                     // Makes it submit the form
              disabled={loading || !username || !email || !password || !confirmPassword} // Disable when loading or anything of theses
          >
              {/* Show "Loading..." when loading, otherwise show "Register" */}
              {loading ? "Loading..." : "Register"}
          </button>

        {/* Container div for checkbox and label */}
        <div className="flex items-center justify-center gap-2 mb-3">
        {/* flex: makes container flexible */}
        {/* items-center: vertically centers items */}
        {/* justify-center: horizontally centers items */}
        {/* gap-2: adds spacing between items */}
        {/* mb-3: margin bottom of 0.75rem */}

        {/* Checkbox input */}
        <input 
            type="checkbox" 
            id="policy-terms"   // ID to connect with label's htmlFor
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            required
            // w-4 h-4: width and height of 1rem
            // text-blue-600: color when checked
            // rounded: rounded corners
            // border-gray-300: light gray border
            // focus:ring-blue-500: blue ring when focused
        />

        {/* Label for checkbox */}
        <label 
            htmlFor="policy-terms"  // Connects label to checkbox input
            className="text-gray-600"  // Gray text color
        >
            I accept the {' '} {/* Space added*/}
            {/* Link to Terms page */}
            <Link 
                to="/terms" 
                className="text-blue-600 hover:underline"
                // text-blue-600: blue text color
                // hover:underline: adds underline on hover
            >
                Terms of Service
            </Link>
            
            {' '}and{' '}  {/* Space between links */}
            
            {/* Link to Privacy page */}
            <Link 
                to="/privacy" 
                className="text-blue-600 hover:underline"
            >
                Privacy Policy
            </Link>
        </label>
        </div>
    
        {/* Link to login page */}
        <div className="form-footer">
        Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
  );
}
  // Export the Register component so it can be imported elsewhere
  export default Register;
