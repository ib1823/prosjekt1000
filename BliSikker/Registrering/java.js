const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');

const app = express();

// Database tilkobling
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Koblet til databasen');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST /register for å registrere ny bruker
app.post('/register', (req, res) => {
    const { fullname, email, username, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send('Passordene stemmer ikke overens');
    }

    // Sjekk om brukernavnet allerede er tatt
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            return res.status(400).send('Brukernavnet er allerede tatt');
        }

        // Krypter passordet
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Lagre bruker i databasen
        const sql = 'INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [fullname, email, username, hashedPassword], (err, result) => {
            if (err) throw err;
            res.status(200).send('Bruker registrert!');
        });
    });
});

// Start serveren
app.listen(3000, () => {
    console.log('Serveren kjører på http://localhost:3000');
});
