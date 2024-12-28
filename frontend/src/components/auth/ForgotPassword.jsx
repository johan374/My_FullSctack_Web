// Import React's useState hook for managing component state
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const validatePassword = (password, confirmPwd) => {
        const validations = [
            {
                test: password.length >= 8,
                message: "Password must be at least 8 characters long"
            },
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
            {
                test: confirmPwd === '' || password === confirmPwd,
                message: "Passwords do not match"
            }
        ];

        // Find first failed validation
        // The .find() method loops through the validations array until it finds the first validation that failed
        // v => !v.test is a function that returns true when a validation test is false (failed)
        // failedValidation will contain the first failed validation object, or undefined if all passed
        const failedValidation = validations.find(v => !v.test);
        if (failedValidation) {
            setMessage(failedValidation.message);
            setHasError(true);
            return false;
        }
        
        setMessage('');
        setHasError(false);
        return true;
    };

    //useEffect for Real-time validation
    useEffect(() => {
        if (newPassword || confirmPassword) {
            validatePassword(newPassword, confirmPassword);
        }
    }, [newPassword, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePassword(newPassword, confirmPassword)) {
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
            setHasError(false);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred');
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Set New Password</h1>
            
            <div className="password-input-container">
                <input
                    className={`form-input ${hasError ? 'border-red-500' : ''}`}
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    required
                    minLength={8}
                    aria-label="New Password"
                    autoComplete="new-password"
                />
                <button
                    type="button"
                    className="password-toggle-button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={loading}
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                    {showNewPassword ? 
                        <EyeOff className="eye-icon" size={20} /> : 
                        <Eye className="eye-icon" size={20} />
                    }
                </button>
            </div>

            <div className="password-input-container">
                <input
                    className={`form-input ${hasError ? 'border-red-500' : ''}`}
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    minLength={8}
                    aria-label="Confirm Password"
                    autoComplete="new-password"
                />
                <button
                    type="button"
                    className="password-toggle-button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                    {showConfirmPassword ? 
                        <EyeOff className="eye-icon" size={20} /> : 
                        <Eye className="eye-icon" size={20} />
                    }
                </button>
            </div>

            {message && (
                <div 
                    className={`message-box ${hasError ? 'error' : 'success'}`} 
                    role="alert"
                >
                    {message}
                </div>
            )}

            <button
                className="form-button"
                type="submit"
                disabled={loading || hasError}
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
}
