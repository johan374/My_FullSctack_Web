// Imports required for component functionality
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import "../../styles/Form.css";

export function ForgotPassword() {
    // State management using React hooks
    // email - stores user's input email
    const [email, setEmail] = useState('');
    // loading - tracks API request status
    const [loading, setLoading] = useState(false);
    // message - stores feedback/error messages to display to user
    const [message, setMessage] = useState('');
    // remainingTime - stores countdown timer value
    const [remainingTime, setRemainingTime] = useState(0);
    
    // Initialize state for tracking password reset attempts, using a function to get initial value from localStorage
const [attemptCount, setAttemptCount] = useState(() => {
    // Get stored attempt count from browser storage - if none exists (null) convert to 0, otherwise convert string to number
    const stored = localStorage.getItem('resetAttemptCount');
    // If stored value exists, convert it from string to number; otherwise return 0 as default attempt count
    // parseInt() Converts string value from localStorage into a number for counting attempts (e.g., "5" becomes 5)
    return stored ? parseInt(stored) : 0;
 });
    
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // useEffect for handling 30-minute reset window
    useEffect(() => {
        // Get the timestamp of first attempt
        const resetTime = localStorage.getItem('resetAttemptsTime');
        if (resetTime) {
            const resetTimeDate = new Date(resetTime);
            const now = new Date();
            // Check if 30 minutes have passed since first attempt 30 (minutes) * 60 (seconds in a minute) * 1000 (milliseconds in a second)
            if (now.getTime() - resetTimeDate.getTime() >= 30 * 60 * 1000) {
                // Reset all rate limiting data after 30 minutes
                setAttemptCount(0);
                setRemainingTime(0);
                localStorage.removeItem('resetAttemptCount');
                localStorage.removeItem('resetAttemptsTime');
            }
        }
    }, []); // Empty dependency array means this runs once on mount

    // useEffect for managing countdown timer
    useEffect(() => {
        let timer;
        // Only start timer if there's remaining time
        if (remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime(prev => {
                    // If timer reaches 1 second or less, clear it and reset to 0
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    // Decrement timer by 1 second
                    return prev - 1;
                });
            }, 1000); // Run every second
        }

        // Cleanup function to prevent memory leaks
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [remainingTime]); // Run effect when remainingTime changes

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Check if user needs to wait before next attempt
        if (remainingTime > 0) {
            setMessage(`Please wait ${remainingTime} seconds before trying again`);
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // Attempt to send reset code
            const response = await api.post('/api/password/request-reset/', { email });
            
            // On success, increment attempt counter
            const newAttemptCount = attemptCount + 1;
            setAttemptCount(newAttemptCount);
            localStorage.setItem('resetAttemptCount', newAttemptCount.toString());
            
            // First attempt at 10:00 AM
            if (!localStorage.getItem('resetAttemptsTime')) {  // No time stored yet
                localStorage.setItem('resetAttemptsTime', new Date().toISOString());
                // Stores: "2024-12-29T10:00:00.000Z"
            }

            // Set success message
            setMessage(response.data.message || 'Reset code sent successfully');
            
            // Navigate to reset password page with email and message
            navigate('/reset-password', { 
                state: { 
                    email: email, 
                    message: 'Reset code has been sent to your email' 
                } 
            });

        } catch (error) {
            console.log('Error response:', error.response);
            
            // Handle rate limit error (429 Too Many Requests)
            if (error.response?.status === 429) {
                // Extract wait time and attempt count from server response
                const { waitTime, attemptCount: serverAttemptCount } = error.response.data;
                
                // Update our React state with the attempt count received from the server
                setAttemptCount(serverAttemptCount);
                // Save the server's attempt count to localStorage for persistence between page refreshes
                localStorage.setItem('resetAttemptCount', serverAttemptCount.toString());

                // Set countdown timer and error message
                setRemainingTime(waitTime);
                setMessage(`Too many attempts. Please wait ${waitTime} seconds before trying again.`);
                
                // Store first attempt timestamp if not already stored
                if (!localStorage.getItem('resetAttemptsTime')) {
                    localStorage.setItem('resetAttemptsTime', new Date().toISOString());
                }
            } else {
                // Handle other errors
                const errorMessage = 
                    error.response?.data?.error || 
                    error.response?.data?.detail || 
                    'An unexpected error occurred';
                setMessage(errorMessage);
            }
        } finally {
            // Always reset loading state when done
            setLoading(false);
        }
    };

    return (
        // Main container: full screen height, gray background, flex layout
        <div className="min-h-screen bg-gray-50 flex flex-col sm:px-6 py-4 lg:px-8">
            {/* Container for the form title: auto margins, controlled width on small screens */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Heading styles: top margin, centered, large bold text */}
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Reset Password
                </h2>
            </div>

            {/* Form wrapper: top margin, controlled width, centered */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                {/* White card with shadow and padding */}
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Form with vertical spacing between elements */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            {/* Label styling: block display, small text, medium weight */}
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            {/* Input wrapper with top margin */}
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    // Input styling: full width, rounded corners, border, padding, shadow, focus states
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
                                            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Conditional message box with dynamic background colors */}
                        {message && (
                            <div className={`rounded-md p-4 ${
                                message.includes('wait') ? 'bg-yellow-50 text-yellow-700' :  // Warning style
                                message.includes('success') ? 'bg-green-50 text-green-700' : // Success style
                                'bg-red-50 text-red-700'                                     // Error style
                            }`}>
                                <p className="text-sm">{message}</p>
                            </div>
                        )}

                        {/* Submit button with full width, centered content, padding, and interactive states */}
                        <button
                            type="submit"
                            disabled={loading || remainingTime > 0}
                            className="w-full flex justify-center py-2 px-4 border border-transparent 
                                    rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : 
                            remainingTime > 0 ? 
                            `Wait ${remainingTime}s` : 
                            "Send Reset Code"}
                        </button>

                        {/* Back to login link: centered, blue color with hover state */}
                        <div className="text-sm text-center">
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ResetPassword component
export function ResetPassword() {
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [hasError, setHasError] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const validateResetCode = (code) => {
        return /^\d{6}$/.test(code);
    };

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

         // Validate email and reset code
         if (!email || !resetCode) {
            setMessage('Please enter both email and reset code');
            setHasError(true);
            return;
        }

        if (!validateResetCode(resetCode)) {
            setMessage('Reset code must be 6 digits');
            setHasError(true);
            return;
        }
        
        if (!validatePassword(newPassword, confirmPassword)) {
            return;
        }
    
        setLoading(true);
        setMessage('');
    
        try {
            const response = await api.post('/api/password/verify-reset/', {
                email: email,  // You'll need to add state for email
                code: resetCode,  // You'll need to add state for reset code
                new_password: newPassword
            });
            
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
        <div className="min-h-screen bg-gray-50 flex flex-col py-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Set New Password
                </h2>
            </div>
    
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
    
                        <div>
                            <label htmlFor="reset-code" className="block text-sm font-medium text-gray-700">
                                Reset Code
                            </label>
                            <div className="mt-1">
                                <input
                                    id="reset-code"
                                    type="text"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    placeholder="Enter reset code"
                                    required
                                    maxLength={6}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
    
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New Password"
                                    required
                                    minLength={8}
                                    aria-label="New Password"
                                    autoComplete="new-password"
                                    className={`block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
                                        hasError 
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    disabled={loading}
                                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                                >
                                    {showNewPassword ? 
                                        <EyeOff className="h-5 w-5" /> : 
                                        <Eye className="h-5 w-5" />
                                    }
                                </button>
                            </div>
                        </div>
    
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    required
                                    minLength={8}
                                    aria-label="Confirm Password"
                                    autoComplete="new-password"
                                    className={`block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
                                        hasError 
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                >
                                    {showConfirmPassword ? 
                                        <EyeOff className="h-5 w-5" /> : 
                                        <Eye className="h-5 w-5" />
                                    }
                                </button>
                            </div>
                        </div>
    
                        {message && (
                            <div 
                                className={`rounded-md p-4 ${
                                    hasError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                                }`}
                                role="alert"
                            >
                                <p className="text-sm">{message}</p>
                            </div>
                        )}
    
                        <div>
                            <button
                                type="submit"
                                disabled={loading || hasError}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
