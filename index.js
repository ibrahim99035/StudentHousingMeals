const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

require('dotenv').config();
require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const KEY = process.env.SECERT_KEY;
// Create SQLite database connection
const db = new sqlite3.Database('./database.db');

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static('public'));

// User Registration
app.post('/register', async (req, res) => {
    const { username, password, role, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO Users (username, password, role, email) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, role, email],
            function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, user) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Wrong password' });
            }

            const token = jwt.sign({ userId: user.id }, KEY , { expiresIn: '5h' });
            console.log("Logged In");
            res.json({ token, user });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}

app.get('/test-token', authenticateToken, (req, res) => {
    res.json({ message: 'Token is valid', user: req.user });
});

// Route to retrieve user profile by user ID
app.get('/profile/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;
    db.get('SELECT * FROM Users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
});

// Route to retrieve user profile by username
app.get('/profile/:username', authenticateToken, (req, res) => {
    const { username } = req.params;
    db.get('SELECT * FROM Users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
});

//------------------------------------------------------------------
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/reservation', (req, res) => {
    res.sendFile(__dirname + '/public/table.html');
});

app.get('/contacts', (req, res) => {
    res.sendFile(__dirname + '/public/social.html');
});

app.get('/meals-panel', (req, res) => {
    res.sendFile(__dirname + '/public/meals-table.html');
});

app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/public/profile.html');
});
// -----------------------------------------------------------------
// Route to get all meals in the database
app.get('/meals', (req, res) => {
    db.all('SELECT Meals.*, Users.username, Users.email, Users.role FROM Meals INNER JOIN Users ON Meals.userID = Users.id', (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(rows);
    });
});

// Route to post a new meal
app.post('/meals', (req, res) => {
    const { userID, type, content = 'default', date } = req.body;
    db.run('INSERT INTO Meals (userID, type, content, date) VALUES (?, ?, ?, ?)', [userID, type, content, date], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        db.get('SELECT * FROM Meals WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            db.get('SELECT * FROM Users WHERE id = ?', [userID], async (err, user) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
    
                if (!user) {
                    return res.status(401).json({ error: 'There is no user with that id.' });
                }
    
                res.status(201).json({row, user});
            });
            
        });
    });
});

// Route to delete a meal by ID within 1 hour
app.delete('/meals/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM Meals WHERE id = ?', [id], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Meal deleted successfully' });
    });
});

// Route to update a meal by ID within 1 hour
app.put('/meals/:id', (req, res) => {
    const { id } = req.params;
    const { type, content, date } = req.body;
    db.run('UPDATE Meals SET type = ?, content = ?, date = ? WHERE id = ?', [type, content, date, id], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Meal updated successfully' });
    });
});

// Route to get meals for a specific user
app.get('/meals/user/:userId', (req, res) => {
    const { userId } = req.params;
    db.all('SELECT Meals.*, Users.username, Users.email, Users.role FROM Meals INNER JOIN Users ON Meals.userID = Users.id WHERE Users.id = ?', [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(rows);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
