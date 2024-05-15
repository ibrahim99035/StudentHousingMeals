const sqlite3 = require('sqlite3').verbose();

// Create a new database or open an existing one
const db = new sqlite3.Database('database.db');

// Create Students table
// db.run(`CREATE TABLE IF NOT EXISTS Students (
//     id INTEGER PRIMARY KEY,
//     Name TEXT NOT NULL UNIQUE,
//     serialNumber TEXT,
//     role TEXT CHECK(role IN ('Student', 'Admin', 'Chef')),
//     email TEXT
// )`);

db.run(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('Student', 'Admin', 'Chef')),
    email TEXT
)`);

// Create Meals table
db.run(`CREATE TABLE IF NOT EXISTS Meals (
    id INTEGER PRIMARY KEY,
    userID INTEGER,
    type TEXT CHECK(type IN ('breakfast', 'dinner', 'lunch')),
    content TEXT DEFAULT 'default',
    date TEXT,
    prepared BOOLEAN DEFAULT 0,
    reserved BOOLEAN DEFAULT 0,
    expired BOOLEAN DEFAULT 0,
    pending BOOLEAN DEFAULT 1,
    FOREIGN KEY (userID) REFERENCES Students(id)
)`);

// Close the database connection
db.close();