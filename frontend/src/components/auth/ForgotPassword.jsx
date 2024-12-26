import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import "../../styles/Form.css";

// ForgotPassword component
export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [attemptCount, setAttemptCount] = useState(0);
    const [nextAttemptTime, setNextAttemptTime] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if we need to wait
        if (nextAttemptTime && new Date() < nextAttemptTime) {
            const waitSeconds = Math.ceil((nextAttemptTime - new Date()) / 1000);
            setMessage(`Please wait ${waitSeconds} seconds before trying again`);
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await api.post('/api/password/request-reset/', { email });
            setMessage(response.data.message);
            
            // Increment attempt count and set next attempt time
            setAttemptCount(prev => prev + 1);
            const delaySeconds = attemptCount * 5; // 5 seconds more each time
            const nextTime = new Date();
            nextTime.setSeconds(nextTime.getSeconds() + delaySeconds);
            setNextAttemptTime(nextTime);

            // Start countdown timer
            const updateCountdown = setInterval(() => {
                const now = new Date();
                if (nextTime > now) {
                    const remainingSeconds = Math.ceil((nextTime - now) / 1000);
                    setMessage(`Reset link sent. Please wait ${remainingSeconds} seconds before trying again`);
                } else {
                    clearInterval(updateCountdown);
                    setMessage('You can now request another reset link');
                }
            }, 1000);

        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred');
            // Also increment attempt count for failed attempts
            setAttemptCount(prev => prev + 1);
            const delaySeconds = attemptCount * 5;
            const nextTime = new Date();
            nextTime.setSeconds(nextTime.getSeconds() + delaySeconds);
            setNextAttemptTime(nextTime);
        } finally {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
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
            
            <input
                className="form-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
                minLength={8}
            />

            <input
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                minLength={8}
            />

            {message && (
                <div className="message-box">
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