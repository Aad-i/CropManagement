// Transactions.js (React)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CounterpartyDetails from './CounterPartyDetails';

const Transactions = () => {
    const { userID } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [selectedCounterparty, setSelectedCounterparty] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/transactions/user/${userID}`);
                console.log('Transactions response:', response.data); // Log the response data
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchTransactions();
    }, [userID]);
    

    const handleCounterpartyClick = (counterpartyID) => {
        axios.get(`http://localhost:5000/users/${counterpartyID}`)
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

    return (
        <div>
            <h2>Transactions</h2>
            <div>
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
