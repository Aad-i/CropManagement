// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { item, userID } = location.state;
    const [sellerDetails, setSellerDetails] = useState(null);

    // Function to fetch seller details
    const fetchSellerDetails = async (sellerID) => {
        try {
            const response = await axios.get(`http://localhost:5000/users/${sellerID}`);
            setSellerDetails(response.data);
        } catch (error) {
            console.error('Error fetching seller details:', error);
        }
    };

    useEffect(() => {
        fetchSellerDetails(item.SellerID);
    }, [item.SellerID]);

    // Function to handle the purchase confirmation
    const handleConfirmPurchase = async () => {


        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Extract only date
            const formattedTime24hr = currentDate.toLocaleTimeString('en-US', { hour12: false }); // Extract 24hr time  

            // 3. Create transaction data for the buyer
            await axios.post(`http://localhost:5000/transactions/user/${userID}`, {
                TransactionID: '',
                TransactionDate: formattedDate,
                Quantity: item.TotalYield,
                UnitPrice: item.Price,
                TotalPrice: item.TotalYield * item.Price,
                CropID: item.ItemID,
                CounterpartyID: item.SellerID,
                UserID: userID,
                TransactionTime: formattedTime24hr,
            });

            console.log('Purchase confirmed for item:', item);

            // Update the seller's crops table (assuming an endpoint for this)
            await axios.put(`http://localhost:5000/crops/user/${item.SellerID}/${item.ItemID}`, {
                IsHidden: true,
            });


            alert('Your order has been placed successfully!');

            // Redirect to the Market page after successful purchase
            navigate(`/market/${userID}`, { replace: true });

        } catch (error) {
            console.error('Error confirming purchase:', error);
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            <p>Item Summary:</p>
            <ul>
                <li>Item ID: {item.ItemID}</li>
                <li>Item Name: {item.CropName}</li>
                <li>Quantity: {item.TotalYield}</li>
                <li>Grade: {item.Quality}</li>
                <li>Price: {item.Price}</li>
                <li>Seller ID: {item.SellerID}</li>
            </ul>
            {sellerDetails && (
                <div>
                    <p>Seller Details:</p>
                    <ul>
                        <li>Seller Name: {sellerDetails.UserName}</li>
                        <li>Contact Number: {sellerDetails.PhoneNumber}</li>
                        <li>Email: {sellerDetails.Email}</li>
                    </ul>
                </div>
            )}
            <button onClick={handleConfirmPurchase}>Confirm Purchase</button>
        </div>
    );
};

export default Checkout;
