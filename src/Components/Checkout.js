// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Checkout.scss';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { item, userID } = location.state;
    const [sellerDetails, setSellerDetails] = useState(null);
    const [loading, setLoading] = useState(false);

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
            setLoading(true); // Set loading to true when starting the confirmation process

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

            // Generate PDF using jsPDF
            const pdf = new jsPDF();

            // Add Purchase Invoice header
            pdf.setFontSize(18);
            pdf.text('Purchase Invoice', pdf.internal.pageSize.getWidth() / 2, 25, 'center');

            // Add table for item details
            pdf.autoTable({
                startY: 45,
                // head: [['Item', 'Details']],
                body: [
                    ['Item ID', item.ItemID],
                    ['Item Name', item.CropName],
                    ['Quantity', item.TotalYield],
                    ['Grade', item.Quality],
                    ['Price', item.Price],
                    ['Date',formattedDate],
                    ['Seller ID', item.SellerID],
                    ['Seller Name', sellerDetails.UserName],
                    ['Contact Number', sellerDetails.PhoneNumber],
                    ['Email', sellerDetails.Email]
                ],
                theme:'grid',
                margin: { horizontal: 30 }, // Reduce horizontal margin
                cellHeight: 20, // Set the desired height of the rows
            });

            // Save the PDF
            pdf.save('Purchase Invoice.pdf');

            // Redirect to the Market page after successful purchase
            navigate(`/market/${userID}`, { replace: true });

        } catch (error) {
            console.error('Error confirming purchase:', error);
        } finally {
            setLoading(false); // Set loading to false when the confirmation process is done
        }
    };

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Checkout Bill</h2>

            {/* Existing table for item details */}
            <table className="bill-table">
                <tbody>
                    <tr>
                        <td>Item ID:</td>
                        <td>{item.ItemID}</td>
                    </tr>
                    <tr>
                        <td>Item Name:</td>
                        <td>{item.CropName}</td>
                    </tr>
                    <tr>
                        <td>Quantity:</td>
                        <td>{item.TotalYield}</td>
                    </tr>
                    <tr>
                        <td>Grade:</td>
                        <td>{item.Quality}</td>
                    </tr>
                    <tr>
                        <td>Price:</td>
                        <td>{item.Price}</td>
                    </tr>
                    <tr>
                        <td>Seller ID:</td>
                        <td>{item.SellerID}</td>
                    </tr>
                </tbody>
            </table>

            {sellerDetails && (
                <div className="seller-details">
                    <p className="bill-section-title">Seller Details:</p>
                    <table className="seller-details-table">
                        <tbody>
                            <tr>
                                <td>Seller Name:</td>
                                <td>{sellerDetails.UserName}</td>
                            </tr>
                            <tr>
                                <td>Contact Number:</td>
                                <td>{sellerDetails.PhoneNumber}</td>
                            </tr>
                            <tr>
                                <td>Email:</td>
                                <td>{sellerDetails.Email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            <button className="confirm-purchase-button" onClick={handleConfirmPurchase} disabled={loading}>
                {loading ? 'Confirming...' : 'Confirm Purchase'}
            </button>
        </div>
    );
};

export default Checkout;
