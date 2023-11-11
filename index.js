const express = require("express")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const bodyParser = require('body-parser');

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, "database.db")

let db = null;

const initializeDBAndServer = async () => {
    try{

        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the in-memory SQLite database.');
        });

        app.listen(3004, () => {
            console.log("Server is started at post 3004")
        })
    }
    catch(err){
        console.log("Error :", err)
        process.exit()
    }
}   

initializeDBAndServer()

// API to create a new order
app.post('/api/order', async (req, res) => {
    const { ItemType, OrderState, LastUpdateTime, BranchID, CustomerID } = req.body;
    console.log(ItemType, OrderState, LastUpdateTime, BranchID, CustomerID)
    const sql = `INSERT INTO Orders (ItemType, OrderState, LastUpdateTime, BranchID, CustomerID) VALUES (?, ?, ?, ?, ?)`;
    await db.run(sql, [ItemType, OrderState, LastUpdateTime, BranchID, CustomerID], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(this.lastID)
        res.status(201).json({ OrderID: this.lastID });
    });
});

// API to get an order by ID
app.get('/api/order/:orderid', async (req, res) => {
    const sql = 'SELECT * FROM Orders WHERE OrderID = ?';
    await db.get(sql, [req.params.orderid], (err, row) => {
        console.log(sql)
        if (err) {
            return console.error(err.message);
        }
        res.status(200).json(row);
    });
});

module.exports = app