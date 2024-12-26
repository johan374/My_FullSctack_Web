// 1. Imports
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../utils/api';

// PaymentForm component takes planType and amount as props from parent
const PaymentForm = ({ planType, amount }) => {
    // Initialize Stripe hooks and navigation
    const stripe = useStripe();          // Hook to access Stripe's API methods
    const elements = useElements();       // Hook to access Stripe form elements
    const navigate = useNavigate();       // Hook for programmatic navigation

    // State management for payment process
    const [error, setError] = useState(null);       // Store error messages
    const [processing, setProcessing] = useState(false);  // Track payment processing state

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior
        
        // Early return if Stripe isn't loaded yet
        if (!stripe || !elements) {
            return;
        }

        // Start processing state
        setProcessing(true);  // Show loading state
        setError(null);       // Clear any previous errors

        try {
            // Step 1: Create Payment Intent on backend
            // This sets up the payment with Stripe and returns necessary data
            const response = await api.createPaymentIntent({
                amount: amount,       // Amount to charge
                planType: planType    // Type of subscription plan
            });

            // Extract necessary data from response
            const { clientSecret, payment_id } = response.data;

            // Step 2: Confirm the payment with Stripe
            const result = await stripe.confirmCardPayment(
                clientSecret,  // Secret key for this specific payment
                {
                    payment_method: {
                        // Get card details from Stripe Elements
                        card: elements.getElement(CardElement),
                        // Add billing details
                        billing_details: {
                            name: 'User Name', // Hardcoded for now
                        },
                    },
                }
            );

            // Step 3: Handle the result
            if (result.error) {
                // If payment failed, show error
                setError(result.error.message);
            } else {
                // If payment succeeded:
                // 1. Confirm payment on our backend
                await api.confirmPayment(payment_id);
                // 2. Navigate to success page
                navigate('/success');
            }
        } catch (err) {
            // Handle any errors in the try block
            setError(err.message || 'An error occurred');
        } finally {
            // Always stop processing state, whether payment succeeded or failed
            setProcessing(false);
        }
    };

    return (
        // Main form container with styling for width, margin, padding, and shadow
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
            {/* Payment form title */}
            <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h2>
            
            {/* Payment details section */}
            <div className="mb-6">
                {/* Display the selected plan type and amount */}
                <p className="text-lg font-medium mb-2">Plan: {planType}</p>
                <p className="text-lg font-medium mb-4">Amount: ${amount}</p>
                
                {/* Stripe's CardElement container with styling */}
                <div className="border rounded-md p-4 bg-gray-50">
                    {/* Stripe's pre-built card input component
                        Handles:
                        - Card number
                        - Expiry date
                        - CVC
                        - Input validation */}
                    <CardElement 
                        options={{
                            style: {
                                base: {
                                    // Styling for the card input
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
    
            {/* Error message display - only shows if there's an error */}
            {error && (
                <div className="mb-4 text-red-500 text-sm">
                    {error}
                </div>
            )}
    
            {/* Submit button that triggers payment process */}
            <button
                type="submit"
                // Button is disabled when Stripe isn't loaded or payment is processing
                disabled={!stripe || processing}
                className="w-full bg-[#00df9a] text-white py-3 rounded-md font-medium hover:bg-[#00c589] transition-colors duration-300 disabled:opacity-50"
            >
                {/* Button text changes based on processing state */}
                {processing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};
// Main Payment Page Component
const PaymentPage = () => {
    // Get route location to access state passed during navigation
    const location = useLocation();
    
    // Destructure planType and amount from location.state
    // The '|| {}' provides a default empty object if state is null
    const { planType, amount } = location.state || {};
    
    // State to store the initialized Stripe instance
    const [stripePromise, setStripePromise] = useState(null);

    // useEffect to initialize Stripe when component mounts
    useEffect(() => {
        const getStripeKey = async () => {
            try {
                // Get publishable key from backend
                const response = await api.getStripeConfig();
                // Initialize Stripe with the key
                const stripe = await loadStripe(response.data.publicKey);
                // Store Stripe instance in state
                setStripePromise(stripe);
            } catch (err) {
                console.error('Failed to load Stripe:', err);
            }
        };
        
        // Call the initialization function
        getStripeKey();
    }, []); // Empty dependency array means this runs once when component mounts

    // Guard clause: If no plan type or amount, show error
    if (!planType || !amount) {
        return <div>Invalid payment information</div>;
    }

    // Guard clause: If Stripe hasn't initialized, show loading
    if (!stripePromise) {
        return <div>Loading...</div>;
    }

    // Main render
    return (
        // Stripe Elements provider wraps payment form
        <Elements stripe={stripePromise}>
            {/* Container with full height and styling */}
            <div className="min-h-screen bg-gray-100 py-12 px-4">
                {/* Payment form with passed props */}
                <PaymentForm planType={planType} amount={amount} />
            </div>
        </Elements>
     );
};

export default PaymentPage;