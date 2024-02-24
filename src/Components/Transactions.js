// Transactions.js (React)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CounterpartyDetails from './CounterPartyDetails';

const Transactions = () => {
    const { userID } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [selectedCounterparty, setSelectedCounterparty] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [totalAmount, setTotalAmount] = useState(0.00);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/transactions/user/${userID}?filter=${filterType}`);
                setTransactions(response.data);

                // Calculate total and available amount based on counterparty role
                const { total } = response.data.reduce((acc, transaction) => {
                    const price = parseFloat(transaction.TotalPrice);
                    acc.total += transaction.CounterpartyRole === 'seller' ? -price : price;
                    return acc;
                }, { total: 0});

                setTotalAmount(total);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [userID, filterType]);


    const handleCounterpartyClick = (counterpartyID) => {
        axios.get(`http://localhost:5000/counterparties/${counterpartyID}`)
            .then(response => {
                setSelectedCounterparty(response.data);
            })
            .catch(error => {
                console.error('Error fetching counterparty details:', error);
            });
    };

    const handleCloseCounterpartyDetails = () => {
        setSelectedCounterparty(null);
    };

    const handleFilterChange = (type) => {
        setFilterType(type);
    };

    return (
        <div>
            <h2>Transactions</h2>
            <div>
                <div>
                    <button onClick={() => handleFilterChange('sold')}>View Sold Items</button>
                    <button onClick={() => handleFilterChange('bought')}>View Bought Items</button>
                    <button onClick={() => handleFilterChange('')}>View All Items</button>
                </div>
                {(filterType === 'sold' || filterType === 'bought') && <h3>Total Amount: {totalAmount.toFixed(2)}</h3>}
                <h3>Transaction List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Transaction Date</th>
                            <th>Transaction Time</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Price</th>
                            <th>Crop ID</th>
                            <th>Counterparty ID</th>
                            <th>Counterparty Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.TransactionID}>
                                <td>{transaction.TransactionID}</td>
                                <td>{new Date(transaction.TransactionDate).toLocaleDateString()}</td> 
                                <td>{transaction.TransactionTime}</td>
                                <td>{transaction.Quantity}</td>
                                <td>{transaction.UnitPrice}</td>
                                <td>{transaction.TotalPrice}</td>
                                <td>{transaction.CropID}</td>
                                <td>
                                    <button onClick={() => handleCounterpartyClick(transaction.CounterpartyID)}>
                                        {transaction.CounterpartyID}
                                    </button>
                                </td>
                                <td>{transaction.CounterpartyRole}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Counterparty Details Popup */}
            {selectedCounterparty && (
                <CounterpartyDetails counterparty={selectedCounterparty} onClose={handleCloseCounterpartyDetails} />
            )}

            
        </div>
    );
};

export default Transactions;
