/** @format */

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "200420", // Replace with your MySQL password
    database: "employee_db",  // Replace with your database name
});

db.connect((err) => {
	if (err) {
		console.error("Database connection failed: ", err.message);
		return;
	}
	console.log("Connected to MySQL database.");
});

// Create Employees Table (if not exists)
db.query(
	`CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    employeeId VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(10) NOT NULL,
    department VARCHAR(50) NOT NULL,
    dateOfJoining DATE NOT NULL,
    role VARCHAR(50) NOT NULL
  )`,
	(err) => {
		if (err) console.error("Error creating table: ", err.message);
	}
);

// Endpoint to Add Employee
app.post("/api/employees", (req, res) => {
	const { name, employeeId, email, phone, department, dateOfJoining, role } =
		req.body;

	if (
		!name ||
		!employeeId ||
		!email ||
		!phone ||
		!department ||
		!dateOfJoining ||
		!role
	) {
		return res.status(400).json({ message: "All fields are required." });
	}

	const query = `INSERT INTO employees (name, employeeId, email, phone, department, dateOfJoining, role) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
	const values = [
		name,
		employeeId,
		email,
		phone,
		department,
		dateOfJoining,
		role,
	];

	db.query(query, values, (err) => {
		if (err) {
			if (err.code === "ER_DUP_ENTRY") {
				return res
					.status(400)
					.json({ message: "Employee ID or Email already exists." });
			}
			console.error("Database error: ", err.message);
			return res.status(500).json({ message: "Internal Server Error" });
		}
		res.status(201).json({ message: "Employee added successfully!" });
	});
});

// Endpoint to List All Employees
app.get("/api/employees/list", (req, res) => {
	const query = `SELECT * FROM employees`;
	db.query(query, (err, results) => {
		if (err) {
			console.error("Database error: ", err.message);
			return res.status(500).json({ message: "Internal Server Error" });
		}
		res.status(200).json(results);
	});
});

// Endpoint to Delete Employee by ID
app.delete("/api/employees/delete/:id", (req, res) => {
	const { id } = req.params;

	const query = `DELETE FROM employees WHERE id = ?`;
	db.query(query, [id], (err, result) => {
		if (err) {
			console.error("Database error: ", err.message);
			return res.status(500).json({ message: "Internal Server Error" });
		}
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Employee not found." });
		}
		res.status(200).json({ message: "Employee deleted successfully!" });
	});
});

// Endpoint to Update Employee by ID
app.put("/api/employees/update/:id", (req, res) => {
	const { id } = req.params;
	const { name, employeeId, email, phone, department, dateOfJoining, role } =
		req.body;

	if (
		!name ||
		!employeeId ||
		!email ||
		!phone ||
		!department ||
		!dateOfJoining ||
		!role
	) {
		return res.status(400).json({ message: "All fields are required." });
	}

	const query = `UPDATE employees SET name = ?, employeeId = ?, email = ?, phone = ?, department = ?, dateOfJoining = ?, role = ? WHERE id = ?`;
	const values = [
		name,
		employeeId,
		email,
		phone,
		department,
		dateOfJoining,
		role,
		id,
	];

	db.query(query, values, (err, result) => {
		if (err) {
			console.error("Database error: ", err.message);
			return res.status(500).json({ message: "Internal Server Error" });
		}
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Employee not found." });
		}
		res.status(200).json({ message: "Employee updated successfully!" });
	});
});

// Start the Server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
