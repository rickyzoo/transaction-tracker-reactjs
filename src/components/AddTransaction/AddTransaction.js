import React, { useState } from 'react';
import './AddTransaction.css';

export const AddTransaction = () => {
    const [transactionType, setTransactionType] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');

    // Handler for handling form submission
    const handleSubmit = async (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Check if all inputs are properly populated
        if (transactionType && category && date && amount) {
            // Format the date to SQL date format (YYYY-MM-DD)
            const formattedDate = new Date(date).toISOString().split('T')[0];

            // Prepare the transaction data for the API
            const transactionData = {
                'type': transactionType,
                'category': category,
                'date': formattedDate,
                'amount': amount
            };

            try {
                const response = await fetch('http://127.0.0.1:5000/api/add_transaction', {
                    method: 'POST',
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(transactionData)
                });
    
                if (response.ok) {
                    // Transaction added successfully
                    console.log('Transaction added');
                    // Reset the form selections and inputs
                    setTransactionType('');
                    setCategory('');
                    setDate('');
                    setAmount('');
                } else {
                    // Handle error case
                    console.error('Error adding transaction');
                }
            } catch (error) {
                console.error('Error adding transaction:', error);
            }
        } else {
            // Show a pop-up message or error alert to inform the user
            alert('Please input all information to add a transaction. Thank you!');
        }
    };

    return (
    <div className="add-transaction-container">
        <h2>Add New Transaction</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Select Transaction Type:
                    <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                        <option value="">Select</option>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Select category:
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select</option>
                        {transactionType === 'INCOME' && (
                            <React.Fragment>
                                <option value="Salary">Salary</option>
                                <option value="Investments">Investments</option>
                                <option value="Other">Other</option>
                            </React.Fragment>
                        )}
                        {transactionType === 'EXPENSE' && (
                            <React.Fragment>
                                <option value="Rent/Utlities">Rent/Utilities</option>
                                <option value="Groceries">Groceries</option>
                                <option value="Food/Drink">Food/Drink</option>
                                <option value="Subscriptions">Subscriptions</option>
                                <option value="Car/Transportation">Car/Transportation</option>
                                <option value="Self">Self</option>
                                <option value="Investments">Investments</option>
                                <option value="Other">Other</option>
                            </React.Fragment>
                        )}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Enter Date of Transaction:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                    Enter amount:
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                </label>
            </div>
            <button type="submit">Add Transaction</button>
        </form>
        <p>
            <b>Hover over any row and right-click to Delete!</b>
        </p>
    </div>
  );
};
