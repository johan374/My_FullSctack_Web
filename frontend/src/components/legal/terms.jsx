/**
 * Terms of Service Component
 * 
 * A React component that displays the Terms of Service page.
 * This component uses React Router for navigation and Tailwind CSS for styling.
 * 
 * Key features:
 * - Responsive layout with maximum width constraint
 * - Consistent typography hierarchy
 * - Section-based content organization
 * - Interactive elements (links)
 * - Visual separation of different content types
 */

import React from 'react';
// Import Link component from React Router for internal navigation
import { Link } from 'react-router-dom';

function Terms() {
    return (
        /* Main Container
           - container: Creates a responsive container
           - mx-auto: Centers the container horizontally
           - px-4: Horizontal padding of 1rem (16px)
           - py-8: Vertical padding of 2rem (32px)
           - max-w-4xl: Maximum width of 56rem (896px) for optimal readability
        */
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header Section
                Contains the main title and last updated date
                - text-center: Centers the text content
                - mb-8: Bottom margin of 2rem (32px)
            */}
            <div className="text-center mb-8">
                {/* Page Title
                    - text-4xl: Sets font size to 2.25rem (36px)
                    - font-bold: Sets font weight to bold (700)
                    - text-gray-800: Dark gray color for primary text (#1F2937)
                    - mb-4: Bottom margin of 1rem (16px)
                */}
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
                {/* Last Updated Text
                    - text-gray-600: Medium gray color for secondary text (#4B5563)
                */}
                <p className="text-gray-600">Last updated: December 2024</p>
            </div>

            {/* Main Content Container
                - space-y-8: Adds vertical spacing of 2rem (32px) between sections
            */}
            <div className="space-y-8">
                {/* Agreement Section
                    Basic section with title and paragraph explaining the agreement
                */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Agreement to Terms</h2>
                    <p className="text-gray-600 leading-relaxed">
                        By accessing our service, you agree to be bound by these Terms of Service. If you disagree with any
                        part of these terms, you may not access the service.
                    </p>
                </section>

                {/* User Account Section
                    Section with highlighted background containing user responsibilities
                */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Account</h2>
                    {/* Gray Background Container
                        - bg-gray-50: Light gray background (#F9FAFB)
                        - p-6: Padding of 1.5rem (24px)
                        - rounded-lg: Large border radius (8px)
                    */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-600 leading-relaxed mb-4">
                            When you create an account with us, you must provide accurate and complete information.
                            You are responsible for:
                        </p>
                        {/* Bulleted List
                            - list-disc: Adds bullet points
                            - list-inside: Places bullets inside the content box
                            - space-y-2: Adds 0.5rem (8px) spacing between items
                        */}
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Maintaining the security of your account</li>
                            <li>All activities that occur under your account</li>
                            <li>Keeping your password confidential</li>
                            <li>Notifying us immediately of any unauthorized access</li>
                        </ul>
                    </div>
                </section>

                {/* Service Usage Section
                    Section explaining prohibited uses of the service
                */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Usage</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Our service may only be used for lawful purposes and in accordance with these Terms.
                        You agree not to use our service:
                    </p>
                    {/* Usage Restrictions List
                        - mt-2: Top margin of 0.5rem (8px)
                    */}
                    <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
                        <li>In any way that violates applicable laws or regulations</li>
                        <li>To transmit harmful or malicious code</li>
                        <li>To impersonate or attempt to impersonate others</li>
                        <li>To engage in any activity that interferes with the service</li>
                    </ul>
                </section>

                {/* Intellectual Property Section
                    Simple section explaining IP rights
                */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Intellectual Property</h2>
                    <p className="text-gray-600 leading-relaxed">
                        The service and its original content, features, and functionality are owned by us and are protected
                        by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                    </p>
                </section>

                {/* Termination Section
                    Section with highlighted blue background
                */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Termination</h2>
                    {/* Blue Background Container
                        - bg-blue-50: Light blue background
                        - p-6: Padding of 1.5rem (24px)
                        - rounded-lg: Large border radius (8px)
                    */}
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <p className="text-gray-600 leading-relaxed mb-4">
                            We may terminate or suspend your account and access to the service immediately, without prior
                            notice or liability, for any reason, including:
                        </p>
                        <ul className="text-gray-600 space-y-2">
                            <li>Breach of these Terms of Service</li>
                            <li>At our sole discretion for any reason</li>
                            <li>Upon your request for account deletion</li>
                        </ul>
                    </div>
                </section>

                {/* Privacy Policy Link Section
                    Section containing link to Privacy Policy
                */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privacy Policy</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Please review our Privacy Policy, which also governs your visit to our service:
                    </p>
                    {/* React Router Link Component
                        - text-blue-600: Blue text color for link (#2563EB)
                        - hover:underline: Adds underline on hover
                    */}
                    <Link 
                        to="/privacy" 
                        className="text-blue-600 hover:underline"
                    >
                        Privacy Policy
                    </Link>
                </section>
            </div>

            {/* Footer Section
                - mt-12: Top margin of 3rem (48px)
                - pt-8: Top padding of 2rem (32px)
                - border-t: Top border
                - border-gray-200: Light gray border color (#E5E7EB)
                - text-center: Centers text
                - text-gray-500: Gray text color for footer (#6B7280)
            */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
                <p>© 2024 Your Company Name. All rights reserved.</p>
            </div>
        </div>
    );
}

// Export the component for use in other parts of the application
export default Terms;