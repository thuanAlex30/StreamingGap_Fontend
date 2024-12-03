import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../common/Header'; // Import Header component
import Footer from '../common/Footer'; // Import Footer component
import UserService from '../service/UserService'; // Assuming you have a service for authentication
import '../css/SubscriptionUpgrade.css'; // Import the CSS file for styling

const SubscriptionUpgrade = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Hàm xử lý nâng cấp gói Premium
    const handleUpgrade = async () => {
        setLoading(true);
        setMessage("");
    
        const token = UserService.getToken();
        if (!token) {
            setMessage("You must be logged in to upgrade.");
            setLoading(false);
            return;
        }

       
    
        try {
            // const subscriptionId = 1; // Thay bằng ID gói đăng ký bạn muốn nâng cấp
            // const response = await axios.post(
            //     `http://localhost:1010/subscription/upgrade?subscriptionId=${subscriptionId}`, 
            //     {}, 
            //     {
            //         headers: {
            //             Authorization: `Bearer ${token}`,
            //         },
            //     }
            // );
            
            const submitOrderUpgrade = await axios.post(
                `http://localhost:1010/submitOrder/upgrade?subscriptionId=${2}`, 
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            const vnpayUrl = submitOrderUpgrade.data; // URL thanh toán nhận từ backend
            window.location.href = vnpayUrl; // Chuyển hướng người dùng tới VNPay
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data);
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Hàm để lấy tất cả các gói đăng ký
    const fetchSubscriptions = async () => {
        setLoading(true);
        const token = UserService.getToken();
        if (!token) {
            setMessage("You must be logged in to view subscriptions.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:1010/subscription', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch subscription data");
            }
            const data = await response.json();
            setSubscriptions(data);  // Cập nhật dữ liệu gói đăng ký
        } catch (error) {
            setMessage("Something went wrong while fetching subscription data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    return (
        <div>
            <Header />
            <div className="subscription-upgrade-container">
                <div className="subscription-upgrade-content">
                    <h2 className="title">Upgrade to Premium</h2>
                    <p className="description">
                        Get unlimited music and exclusive features when you upgrade to Premium.
                    </p>
                    <div className="subscriptions-list">
    {subscriptions.map((subscription) => (
        <div key={subscription.id} className="subscription-card">
            <h3>{subscription.name}</h3>
            <p>{subscription.description}</p>
            <p>Price: {subscription.price} VND</p>
        </div>
    ))}
</div>

                    <div className="upgrade-button-container">
                        <button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="upgrade-button"
                        >
                            {loading ? "Upgrading..." : "Upgrade to Premium"}
                        </button>
                    </div>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SubscriptionUpgrade;