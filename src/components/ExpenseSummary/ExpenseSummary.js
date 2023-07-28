import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

import './ExpenseSummary.css'

export const ExpenseSummary = ({ filteredData }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        generateChartData();
    }, [filteredData]);

    const COLORS = ['#ff0000', '#ff8c00', '#daa520', '#008b8b', '#6495ed', '#0000ff', '#7b68ee', '#4b0082']

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { category, amount } = payload[0].payload;

            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#ffff",
                        padding: "5px",
                        border: "1px solid #cccc"
                    }}
                >
                    <label>
                        {`${category} : ${amount}%`}
                    </label>
                </div>
            );
        }
        return null;
    };

    const generateChartData = () => {
        // Checking if the filteredData prop contains values
        if (!filteredData) {
            setChartData([]);
            return;
        } else {
            const expenseCategories = {};
        
            // forEach is a higher-order function that allows you to iterate over each element of an array and perform a specified action on each element
            filteredData.forEach((transaction) => {  // The arrow function represented in (transaction) => {...} is passed as the callback function in forEach
                const { type, category, amount } = transaction; // A destructuring assignment is used here to extract the specified properties from each individual item in the array
                
                if (type === "EXPENSE") {
                    if (expenseCategories[category]) {
                        expenseCategories[category] += amount;
                    } else {
                        expenseCategories[category] = amount;
                    }
                }
            });

            // The variable below is used to calculate and store the total sum of values of the 'expenseCategories' object
            // 'Object.values(expenseCategories)' retrieves an array of all the values from the object
            // The 'reduce()' method is then called on the array values. This method is used to reduce an array to a single value by performing a specified operation on each element of the array
            // We define a callback function inside the 'reduce()' method. 'sum' represents the accumulated sum of the values processed so far, and 'value' represents the current value being processed in the current iteration
            const totalSum = Object.values(expenseCategories).reduce(
                (sum, value) => sum + value,
                0 // indicating that the initial value for 'sum' is 0
            );
        
            // Object.entries() method is used to convert an object into an array of its entries, where each entry is represented as an array containing key-value pairs.
            // Object.entries(expenseCategories) returns an array of arrays, where each inner array consists of the "category" or key element, and its corresponding "amount" or value element.
            // The .map() method iterates over each entry array and transforms it into a new array based on the "category" and "amount" properties
            // The inside syntax of the .map() method is an arrow function with destructuring assignment and object shorthand notation. Here, the "category" and "amount" properties are assigned to their corresponding variables
            const formattedChartData = Object.entries(expenseCategories).map(
                ([category, amount]) => ({
                category,
                amount: parseFloat(((amount / totalSum) * 100).toFixed(2)), // '.toFixed()' returns a string and the 'Pie' component expects numerical values for the 'amount' property, so we use 'parseFloat()' to convert the rounded string value back to a number
                })
            );
            // The resulting value is an array of objects, where each object entry represents a category and its corresponding cumulative amount
            setChartData(formattedChartData);
        }
    };

    return (
        <div className="summary">
            <h2>Expense Summary</h2>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            color="#000000"
                            cx="50%"
                            cy="50%"
                            dataKey="amount"
                            nameKey="category"
                            fill="#8884d8"
                            outerRadius={90}
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={ <CustomTooltip/> } />
                        <Legend layout="vertical" verticalAlign="top" align="center" />  
                    </PieChart>
                </ResponsiveContainer> 
            ) : (
                chartData.length === 0 && <p>No Data Available.</p>
            )}
        </div>
    );
};

