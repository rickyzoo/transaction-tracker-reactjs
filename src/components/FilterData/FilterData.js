import React, { useEffect, useState } from 'react';
import { ExpenseSummary } from '../ExpenseSummary/ExpenseSummary'
import './FilterData.css';

export const FilterData = () => {
    const [transactions, setTransactions] = useState([]);
    const [filterOption, setFilterOption] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, [filterOption, startDate, endDate]);

    const handleFilterOptionChange = (e) => {
        setFilterOption(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const fetchTransactions = async () => {
        try {
            let url = 'http://127.0.0.1:5000/api/get_transactions';

            if (filterOption === 'default') {
                url = 'http://127.0.0.1:5000/api/get_transactions';
            } else if (filterOption === 'last30days') {
                const today = new Date();
                const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
                const currentDate = new Date().toLocaleDateString('en-CA');

                url += `?start_date=${thirtyDaysAgo}&end_date=${currentDate}`;
            } else if (filterOption === 'thisMonth') {
                const today = new Date();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year = today.getFullYear();
                const thisMonth = `${year}-${month}`;

                url += `?this_month=${thisMonth}`;
            } else if (filterOption === 'yearToDate') {
                const today = new Date();
                const year = today.getFullYear();

                url += `?this_year=${year}`;
            } else if (filterOption === 'custom') {
                if (startDate && endDate) {
                    url += `?start_date=${startDate}&end_date=${endDate}`;
                }
            }

            const response = await fetch(url);
            const data = await response.json();
            setTransactions(data)
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleDeleteTransaction = async (transactionID) => {
        try {
            // Pay attention to the use of backticks instead of quotes for the API url. This is because we have an expression that specifies the transactionID to be deleted
            const response = await fetch(`http://127.0.0.1:5000/api/delete_transaction/${transactionID}`, {
                method: 'DELETE',
                mode: 'cors',
            });

            if (response.ok) {
                // Transaction deleted successfully
                console.log('Transaction deleted');

                // Fetch updated transaction data
                fetchTransactions();
            } else {
                // Handle error case
                console.error('Error deleting transaction');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleContextMenu = (e, transactionID) => {
        e.preventDefault();

        handleDeleteTransaction(transactionID);
    };

    const handleApplyFilter = () => {
        fetchTransactions();
    };

    const handleNewTransaction = () => {
        fetchTransactions();
    };

    return (
        <div className="transactions-data">
            <h2>Transactions Data</h2>
            <div className="update-button">
                <button onClick={handleNewTransaction}>Update Transactions Data</button>
            </div>
            <form onSubmit={fetchTransactions}>
                <div className="filter-section">
                    <label>
                        Date Range Filter:
                        <select value={filterOption} onChange={handleFilterOptionChange}>
                            <option value="default">Default: All</option>
                            <option value="last30days">Last 30 Days</option>
                            <option value="thisMonth">This Month</option>
                            <option value="yearToDate">Year-To-Date</option>
                            <option value="custom">Custom</option>
                        </select>
                    </label>
                    <br />
                    {filterOption === 'custom' && (
                        <React.Fragment>
                            <label>
                                Start Date:
                                <input type="date" value={startDate} onChange={handleStartDateChange} />
                            </label>
                            <br />
                            <label>
                                End Date:
                                <input type="date" value={endDate} onChange={handleEndDateChange} />
                            </label>
                            <br />
                            <button type="button" onClick={handleApplyFilter}>Apply Filter</button>
                        </React.Fragment>
                    )}
                </div>
                <div className="transaction-list-container">
                    <div className="transaction-list-scroll">
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(transaction => (
                                    <tr
                                        key={transaction.id}
                                        onContextMenu={(e) => handleContextMenu(e, transaction.id)} 
                                    >
                                        <td className={transaction.type === 'EXPENSE' ? 'expense' : 'income'}>
                                            {transaction.type}
                                        </td>
                                        <td>{transaction.category}</td>
                                        <td>{transaction.date}</td>
                                        <td className={transaction.type === 'EXPENSE' ? 'expense' : 'income'}>
                                            ${transaction.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>
            <ExpenseSummary filteredData={transactions} />
        </div>
    );
};


