import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CounterpartyDetails from './CounterPartyDetails';
import './Transactions.scss'; // Import your SCSS file

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
        <div className="transactions-container">
            <h2 className='transactions-title'>Transactions</h2>
            <div className="transaction-list">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th className="table-header">Transaction ID</th>
                            <th className="table-header">Transaction Date</th>
                            <th className="table-header">Transaction Time</th>
                            <th className="table-header">Quantity</th>
                            <th className="table-header">Total Price</th>
                            {/* <th className="table-header">Total Price</th> */}
                            <th className="table-header">Crop ID</th>
                            <th className="table-header">Counterparty ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.TransactionID}>
                                <td className="table-cell">{transaction.TransactionID}</td>
                                <td className="table-cell">{new Date(transaction.TransactionDate).toLocaleDateString()}</td>
                                <td className="table-cell">{transaction.TransactionTime}</td>
                                <td className="table-cell">{transaction.Quantity}</td>
                                <td className="table-cell">{transaction.UnitPrice}</td>
                                {/* <td className="table-cell">{transaction.TotalPrice}</td> */}
                                <td className="table-cell">{transaction.CropID}</td>
                                <td className="table-cell counterparty-id" onClick={() => handleCounterpartyClick(transaction.CounterpartyID)}>
                                        {transaction.CounterpartyID}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Counterparty Details Popup */}
            {selectedCounterparty && (
                <div className="counterparty-popup">
                    <CounterpartyDetails counterparty={selectedCounterparty} onClose={handleCloseCounterpartyDetails} />
                </div>
            )}
        </div>
    );
};

export default Transactions;
