// Import the CSS file for styling the loading indicator
import "../../styles/components/LoadingIndicator.css";

/*
 * LoadingIndicator Component
 * Purpose: Displays a spinner/loader animation to indicate a loading state.
 */
const LoadingIndicator = () => {
    return (
        <div className="loading-container">
            {/* Outer container for the loader, providing styling and alignment */}
            <div className="loader"></div>
            {/* Inner loader element, styled to create the spinning animation */}
        </div>
    );
};

// Export the LoadingIndicator component for use in other files
export default LoadingIndicator;
