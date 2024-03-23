import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './SellItem.scss'

const SellItem = () => {
    const navigate = useNavigate();
    const { userID } = useParams();

    // State to manage form data
    const [formData, setFormData] = useState({
        cropID: '',
        unitPrice: 0,
        price: 0,
        cropName: '',
        harvestDate: '',
        totalYield: 0,
        quality: '',
    });

    // State for success message
    const [successMessage, setSuccessMessage] = useState('');

    // State to store available crops for sale
    const [availableCrops, setAvailableCrops] = useState([]);

    // Fetch available crops for sale when the component mounts
    useEffect(() => {
        const fetchAvailableCrops = async () => {
            try {
                // Fetch all crops with purpose 'Sale'
                const allCropsResponse = await axios.get(`http://localhost:5000/crops/${userID}/sale`);
                const allCrops = allCropsResponse.data;

                // Fetch items already in the market for the current user
                const marketItemsResponse = await axios.get(`http://localhost:5000/market-items/user/belongs/${userID}`);
                const marketItems = marketItemsResponse.data;

                // Filter out items that are already in the market
                const filteredCrops = allCrops.filter(crop =>
                    !marketItems.some(item => item.ItemID === crop.CropID)
                );

                setAvailableCrops(filteredCrops);
            } catch (error) {
                console.error('Error fetching available crops:', error);
            }
        };

        fetchAvailableCrops();
    }, [userID]);

    // Function to handle crop selection
    const handleCropSelection = (selectedCropID) => {
        const selectedCrop = availableCrops.find((crop) => crop.CropID === selectedCropID);

        const parsedDate = new Date(selectedCrop.HarvestDate);
        const formattedDate = parsedDate.toISOString().split('T')[0];

        setFormData(prevState => ({
            ...prevState,
            cropID: selectedCrop.CropID,
            unitPrice: 0,
            price: 0,
            cropName: selectedCrop.CropName,
            harvestDate: formattedDate,
            totalYield: selectedCrop.TotalYield,
            quality: selectedCrop.Quality,
        }));
    };

    // Function to handle real-time calculation of total price
    // const calculateTotalPrice = () => {
    //     return formData.unitPrice * formData.totalYield;
    // };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const existingItem = await checkExistingMarketItem(formData.cropID, userID);

        if (existingItem) {
            alert('Item already exists in the market!');
            clearForm();
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/market-items', {
                itemID: formData.cropID,
                sellerID: userID,
                price: formData.price,
            });

            console.log('Item added to market:', response.data);

            setSuccessMessage('Item added to the market!');
            clearForm();

            navigate(`/market/${userID}`, { replace: true });
        } catch (error) {
            console.error('Error adding item to market:', error);
        }
    };

    const checkExistingMarketItem = async (cropID, sellerID) => {
        try {
            const response = await axios.get(`http://localhost:5000/market-items/${cropID}/${sellerID}`);
            return response.data.length > 0;
        } catch (error) {
            console.error('Error checking existing market item:', error);
            return false;
        }
    };

    const clearForm = () => {
        setFormData({
            cropID: '',
            unitPrice: 0,
            price: 0,
            cropName: '',
            harvestDate: '',
            totalYield: 0,
            quality: '',
        });
    };

    // UseEffect to listen for changes in the navigation history
    useEffect(() => {
        const handleHistoryChange = () => {
            const currentPath = window.location.pathname;
            if (currentPath.includes('/sell-item')) {
                navigate('/dashboard');
            }
        };

        window.addEventListener('popstate', handleHistoryChange);

        return () => {
            window.removeEventListener('popstate', handleHistoryChange);
        };
    }, [navigate]);

    return (
        <div className="sell-item-container">
            <h2>Sell Your Item</h2>
            <form onSubmit={handleSubmit} className="sell-item-form">
                <label htmlFor="cropID" className="form-label">Select Crop ID:</label>
                <select
                    id="cropID"
                    value={formData.cropID}
                    onChange={(e) => handleCropSelection(e.target.value)}
                    required
                    className="form-select"
                >
                    <option value="" disabled>Select a crop</option>
                    {availableCrops.map((crop) => (
                        <option key={crop.CropID} value={crop.CropID}>
                            {crop.CropID}
                        </option>
                    ))}
                </select>

                <label htmlFor="unitPrice" className="form-label">Set Price:</label>
                <input
                    type="number"
                    id="unitPrice"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData(prevState => ({ ...prevState, unitPrice: e.target.value, price: e.target.value * prevState.totalYield }))}
                    required
                    className="form-input"
                />

                <label htmlFor="price" className="form-label">Total Price:</label>
                <input
                    type="number"
                    id="price"
                    value={formData.price}
                    readOnly
                    className="form-input"
                />

                <label htmlFor="cropName" className="form-label">Crop Name:</label>
                <input type="text" id="cropName" value={formData.cropName} readOnly className="form-input" />

                <label htmlFor="harvestDate" className="form-label">Harvest Date:</label>
                <input type="text" id="harvestDate" value={formData.harvestDate} readOnly className="form-input" />

                <label htmlFor="totalYield" className="form-label">Total Yield:</label>
                <input
                    type="number"
                    id="totalYield"
                    value={formData.totalYield}
                    onChange={(e) => setFormData(prevState => ({ ...prevState, totalYield: e.target.value, price: e.target.value * prevState.unitPrice }))}
                    readOnly
                    className="form-input"
                />

                <label htmlFor="quality" className="form-label">Quality:</label>
                <input type="text" id="quality" value={formData.quality} readOnly className="form-input" />

                <button type="submit" className="form-button">Submit</button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>

    );
};

export default SellItem;
