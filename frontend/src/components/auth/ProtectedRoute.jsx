// Import required dependencies
import { Navigate } from "react-router-dom"; // Used for programmatic navigation in React Router
import { jwtDecode } from "jwt-decode"; // Library to decode JWT (JSON Web Tokens)
import api from "../../utils/api"; // Custom API service/instance for making HTTP requests
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../utils/constants"; // Constants storing token key names
import { useState, useEffect } from "react"; // React hooks for state management and side effects

// ProtectedRoute component definition
// Takes 'children' as a prop - these are the components that should only be shown to authenticated users
function ProtectedRoute({ children }) {
    // Initialize state for authorization status
    // null = initial loading state
    // true = user is authorized
    // false = user is unauthorized
    const [isAuthorized, setIsAuthorized] = useState(null);

    // useEffect hook runs when component mounts (empty dependency array [])
    // Initiates authentication check and handles failure
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    // Function to refresh the access token
    const refreshToken = async () => {
        // Retrieve refresh token from browser's localStorage
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        
        try {
            // Make API request to refresh token endpoint
            // await pauses execution until request completes
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken, // Send refresh token in request body
            });

            // If request successful (status 200)
            if (res.status === 200) {
                // Store new access token in localStorage
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                // Update state to show user is authorized
                setIsAuthorized(true)
            } else {
                // If request failed, mark as unauthorized
                setIsAuthorized(false)
            }
        } catch (error) {
            // Log any errors that occur during the request
            console.log(error);
            // Mark user as unauthorized if refresh fails
            setIsAuthorized(false);
        }
    };

    // Main authentication check function
    const auth = async () => {
        // Get current access token from localStorage
        const token = localStorage.getItem(ACCESS_TOKEN);
        
        // If no token exists, immediately mark as unauthorized
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        // Decode the JWT token to access its contents
        const decoded = jwtDecode(token);
        // Get expiration timestamp from token
        const tokenExpiration = decoded.exp;
        // Get current time in seconds (JWT uses seconds)
        const now = Date.now() / 1000;

        // Check if token is expired
        if (tokenExpiration < now) {
            // If expired, attempt to refresh the token
            await refreshToken();
        } else {
            // If token is still valid, mark as authorized
            setIsAuthorized(true);
        }
    };

    // If authorization status is still null (initial loading)
    // Show loading indicator
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // Final render decision:
    // If authorized: render the protected content (children)
    // If unauthorized: redirect to login page using Navigate component
    return isAuthorized ? children : <Navigate to="/login" />;
}

// Export the component for use in other parts of the application
export default ProtectedRoute;