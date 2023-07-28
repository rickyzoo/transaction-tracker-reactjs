from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from sqlite3 import Error

# Initializing Flask app object
app = Flask(__name__)

# Allow for Cross Origin Resource Sharing so our React app can interact with our Python Flask API.
# The React app, by default, is hosted on the localhost:3000 port
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# FUNCTIONS

# Function to establish connection to the SQLite DB
def create_connection():
    conn = None
    try:
        conn = sqlite3.connect('transactions_data.db')
        print("Connected to SQLite database")
        return conn
    except Error as e:
        print(e)
    return conn

# Function to create the "transactions" table
def create_table(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY,
                type TEXT,
                category TEXT,
                date DATE,
                amount MONEY
            )
        """)
        print("Table 'transactions' created successfully")
    except Error as e:
        print(e)

# Function to insert a new transaction into the table
def insert_data(conn, transaction):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO transactions (type, category, date, amount)
            VALUES (?, ?, ?, ?)
        """, (transaction['type'], transaction['category'], transaction['date'], transaction['amount']))
        conn.commit()
        print("Transaction inserted successfully")
    except Error as e:
        print(e)

# Function to delete a transaction from the table
def delete_data(conn, transaction_id):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM transactions WHERE id = ?
        """, (transaction_id,))  # You put a comma after "transaction_id" because the "execute()" method's parameter expects a tuple or a list, even if it contains only one element
        conn.commit()
        print("Transaction deleted successfully")
    except Error as e:
        print(e)


# API ROUTES

# route to retrieve inputted data from frontend and upload it into SQLite DB
@app.route('/api/add_transaction', methods=['POST'])
def add_transaction_data():
    transaction = request.json

    conn = create_connection()

    if conn is not None:
        create_table(conn)
        insert_data(conn, transaction)
        conn.close()

    return 'Transaction added successfully'

# route to retrieve data from SQLite DB and send to frontend
@app.route('/api/get_transactions', methods=['GET'])
def get_transaction_data():
    # Retrieve query parameters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    this_month = request.args.get('this_month')
    this_year = request.args.get('this_year')

    # Creating a connection to the SQLite db using a context manager
    with sqlite3.connect('transactions_data.db') as conn:
        cursor = conn.cursor()

        query = "SELECT * FROM transactions"

        if start_date and end_date:
            query += " WHERE date BETWEEN ? AND ?"
            query_params = (start_date, end_date)
        elif this_month:
            query += " WHERE date LIKE ? || '%'"
            query_params = (this_month, )
        elif this_year:
            query += " WHERE date LIKE ? || '%'"
            query_params = (this_year,)
        query += " ORDER BY date DESC"

        cursor.execute(query, query_params if 'query_params' in locals() else ())
        records = cursor.fetchall()

        transactions = []
        for record in records:
            transaction = {
                'id': record[0],
                'type': record[1],
                'category': record[2],
                'date': record[3],
                'amount': record[4]
            }
            transactions.append(transaction)
        return jsonify(transactions)

# route to delete a transaction from the database
@app.route('/api/delete_transaction/<int:transaction_id>', methods=['DELETE'])
def delete_transaction_data(transaction_id):
    conn = create_connection()

    if conn is not None:
        delete_data(conn, transaction_id)
        conn.close()
        return 'Transaction deleted successfully'
    else:
        return 'Unable to delete transaction'

if __name__ == '__main__':
    app.run()