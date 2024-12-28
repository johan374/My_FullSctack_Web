// Import React's useState hook for managing component state
import { useState } from 'react';

// Import necessary routing components from react-router-dom:
// - Link: For navigation between pages
// - useParams: To access URL parameters
// - useNavigate: For programmatic navigation
import { Link, useParams, useNavigate } from 'react-router-dom';

// Import custom API utility for making HTTP requests
import api from '../../utils/api';

// Import CSS styles for the form
import "../../styles/Form.css";

// ForgotPassword component - Handles password reset request functionality
export function ForgotPassword() {
    // State management using useState hooks:
    // email - stores user's email input
    const [email, setEmail] = useState('');
    // loading - tracks API request status
    const [loading, setLoading] = useState(false);
    // message - stores feedback messages to display to user
    const [message, setMessage] = useState('');
    // attemptCount - tracks number of reset attempts
    const [attemptCount, setAttemptCount] = useState(0);
    // nextAttemptTime - stores timestamp when next attempt is allowed
    const [nextAttemptTime, setNextAttemptTime] = useState(null);

    // Form submission handler
    const handleSubmit = async (e) => {
        // Prevent default form submission behavior
        e.preventDefault();

        // Rate limiting check: Verify if user needs to wait before next attempt
        if (nextAttemptTime && new Date() < nextAttemptTime) {
            // Calculate remaining wait time in seconds
            /*Math.ceil(...) Rounds up to the nearest whole number Ej: Math.ceil(5.1) = 6
            we divide by 1000 because it give us the seconds 1s= 1000ms 2000/1000 = 2s*/
            const waitSeconds = Math.ceil((nextAttemptTime - new Date()) / 1000);
            setMessage(`Please wait ${waitSeconds} seconds before trying again`);
            return;
        }

        // Set loading state to true and clear any previous messages
        setLoading(true);
        setMessage('');

        try {
            // Make API request to initiate password reset
            const response = await api.post('/api/password/request-reset/', { email });
            setMessage(response.data.message);
            
            // Rate limiting implementation:
            // Increment attempt counter
            // prev = previous value
            setAttemptCount(prev => prev + 1);
            // Calculate delay for next attempt (5 seconds * number of attempts)
            const delaySeconds = attemptCount * 5;
            // Calculate next allowed attempt time
            const nextTime = new Date();
            nextTime.setSeconds(nextTime.getSeconds() + delaySeconds);
            setNextAttemptTime(nextTime);

            // Implement countdown timer:
            // Updates every second to show remaining wait time
            const updateCountdown = setInterval(() => {
                const now = new Date();
                if (nextTime > now) {
                    // Calculate and display remaining seconds
                    const remainingSeconds = Math.ceil((nextTime - now) / 1000);
                    setMessage(`Reset link sent. Please wait ${remainingSeconds} seconds before trying again`);
                } else {
                    // Clear interval when countdown completes
                    clearInterval(updateCountdown);
                    setMessage('You can now request another reset link');
                }
            }, 1000);

        } catch (error) {
            // Handle API request errors
            setMessage(error.response?.data?.error || 'An error occurred');
            // Apply same rate limiting for failed attempts
            setAttemptCount(prev => prev + 1);
            const delaySeconds = attemptCount * 5;
            const nextTime = new Date();
            nextTime.setSeconds(nextTime.getSeconds() + delaySeconds);
            setNextAttemptTime(nextTime);
        } finally {
            // Reset loading state regardless of success/failure
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Reset Password</h1>
            
            <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />

            {message && (
                <div className="message-box">
                    {message}
                </div>
            )}

            <button
                className="form-button"
                type="submit"
                disabled={loading || (nextAttemptTime && new Date() < nextAttemptTime)}
            >
                {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="form-footer">
                <Link to="/login">Back to Login</Link>
            </div>
        </form>
    );
}

// ResetPassword component
export function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const validatePassword = (password) => {
        // Creating an array of validation rules
        const validations = [
            {
                test: password === confirmPassword,
                message: "Passwords do not match"
            },
            {
                test: password.length >= 8,
                message: "Password must be at least 8 characters long"
            },
            // .test(password) checks if the password contains any character matching that pattern
            {
                test: /[A-Z]/.test(password),
                message: "Password must contain at least one uppercase letter"
            },
            {
                test: /[a-z]/.test(password),
                message: "Password must contain at least one lowercase letter"
            },
            {
                test: /[0-9]/.test(password),
                message: "Password must contain at least one number"
            },
        ];

        // Find first failed validation
        // The .find() method loops through the validations array until it finds the first validation that failed
        // v => !v.test is a function that returns true when a validation test is false (failed)
        // failedValidation will contain the first failed validation object, or undefined if all passed
        const failedValidation = validations.find(v => !v.test);
        
        if (failedValidation) {
            setMessage(failedValidation.message);
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate password before proceeding
        if (!validatePassword(newPassword)) {
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await api.post(
                `/api/password/confirm-reset/${uid}/${token}/`,
                { new_password: newPassword }
            );
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Set New Password</h1>
            
            {/* Password requirements display */}
            <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                    <li>At least 8 characters</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One number (0-9)</li>
                    <li>One special character (!@#$%^&*)</li>
                </ul>
            </div>
    
            <input
                className="form-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
                minLength={8}
                aria-label="New Password"
                autoComplete="new-password"
            />
    
            <input
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                minLength={8}
                aria-label="Confirm Password"
                autoComplete="new-password"
            />
    
            {message && (
                <div className="message-box" role="alert">
                    {message}
                </div>
            )}
    
            <button
                className="form-button"
                type="submit"
                disabled={loading}
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
}