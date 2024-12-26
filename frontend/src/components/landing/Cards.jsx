import React from "react";
import Single from "../../assets/single.png";
import Double from "../../assets/double.png";
import Triple from "../../assets/triple.png";
import { useNavigate } from 'react-router-dom';

const Cards = () => {
    const navigate = useNavigate();

    // Function to handle payment - you'll integrate your payment processor here
    const handlePayment = (planType, amount) => {
        const token = localStorage.getItem('access'); // Check if user is logged in
        if (!token) {
            navigate('/login');
            return;
        }
        // Navigate to payment page with plan details
        navigate('/payment', { 
            state: { 
                planType: planType,
                amount: amount 
            }
        });
    };

    return (
        <div className="w-full py-[5rem] sm:py-[10rem] px-4 bg-white">
            <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8">
                
                {/* Single User Card */}
                <div className="w-full shadow-xl flex flex-col p-4 md:my-0 my-8 rounded-lg hover:scale-105 duration-300">
                    <img className="w-20 mx-auto mt-[-3rem] bg-white" src={Single} alt="/" />
                    <h2 className="text-2xl font-bold text-center py-8">Single User</h2>
                    <div className="text-center">
                        <p className="text-4xl font-bold">$149</p>
                        <p className="text-gray-500 mt-2">Billed monthly</p>
                    </div>
                    
                    <div className="text-center font-medium">
                        <p className="py-2 border-b mx-8 mt-8">500 GB Storage</p>
                        <p className="py-2 border-b mx-8">1 Granted User</p>
                        <p className="py-2 border-b mx-8">Send up to 2 GB</p>
                    </div>

                    {/* Payment section */}
                    <div className="space-y-4 mt-6">
                        <button 
                            onClick={() => handlePayment('single', 149)}
                            className="bg-[#00df9a] w-[200px] rounded-md font-medium mx-auto px-6 py-3 flex items-center justify-center gap-2 hover:bg-[#00c589] transition-colors duration-300"
                        >
                            <span>Pay with Card</span>
                            <span className="text-sm">($149)</span>
                        </button>
                        
                        <p className="text-xs text-gray-500 text-center px-6">
                            Secure payment processing • Cancel anytime
                        </p>
                    </div>
                </div>

                {/* Partnership Card */}
                <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
                    <img className="w-20 mx-auto mt-[-3rem] bg-transparent" src={Double} alt="/" />
                    <h2 className="text-2xl font-bold text-center py-8">Partnership</h2>
                    <div className="text-center">
                        <p className="text-4xl font-bold">$199</p>
                        <p className="text-gray-500 mt-2">Billed monthly</p>
                    </div>
                    
                    <div className="text-center font-medium">
                        <p className="py-2 border-b mx-8 mt-8">1TB Storage</p>
                        <p className="py-2 border-b mx-8">3 Granted Users</p>
                        <p className="py-2 border-b mx-8">Send up to 10 GB</p>
                    </div>

                    {/* Payment section */}
                    <div className="space-y-4 mt-6">
                        <button 
                            onClick={() => handlePayment('partnership', 199)}
                            className="bg-black text-[#00df9a] w-[200px] rounded-md font-medium mx-auto px-6 py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors duration-300"
                        >
                            <span>Pay with Card</span>
                            <span className="text-sm">($199)</span>
                        </button>
                        
                        <p className="text-xs text-gray-500 text-center px-6">
                            Secure payment processing • Cancel anytime
                        </p>
                    </div>
                </div>

                {/* Group Account Card */}
                <div className="w-full shadow-xl bg-gray-100 flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
                    <img className="w-20 mx-auto mt-[-3rem] bg-white" src={Triple} alt="/" />
                    <h2 className="text-2xl font-bold text-center py-8">Group Account</h2>
                    <div className="text-center">
                        <p className="text-4xl font-bold">$299</p>
                        <p className="text-gray-500 mt-2">Billed monthly</p>
                    </div>
                    
                    <div className="text-center font-medium">
                        <p className="py-2 border-b mx-8 mt-8">5 TB Storage</p>
                        <p className="py-2 border-b mx-8">10 Granted Users</p>
                        <p className="py-2 border-b mx-8">Send up to 20 GB</p>
                    </div>

                    {/* Payment section */}
                    <div className="space-y-4 mt-6">
                        <button 
                            onClick={() => handlePayment('group', 299)}
                            className="bg-[#00df9a] w-[200px] rounded-md font-medium mx-auto px-6 py-3 flex items-center justify-center gap-2 hover:bg-[#00c589] transition-colors duration-300"
                        >
                            <span>Pay with Card</span>
                            <span className="text-sm">($299)</span>
                        </button>
                        
                        <p className="text-xs text-gray-500 text-center px-6">
                            Secure payment processing • Cancel anytime
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cards;