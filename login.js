const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Customer = require('./customerSchema'); // Updated model name
const Staff = require('./staffSchema'); // Import staff model

// Login route for customers
router.post('/customer', async (req, res) => {
    const { lrn, password } = req.body;
    console.log('Logging in:', { lrn, password }); // Debug logging

    try {
        const customer = await Customer.findOne({ lrn });
        console.log('Found customer:', customer); // Log the found customer document

        if (!customer) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, customer.password);
        console.log('Password match:', passwordMatch); // Log password comparison result

        if (passwordMatch) {
            const token = jwt.sign({ lrn: customer.lrn }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, firstName: customer.firstName, lastName: customer.lastName });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route for staff
router.post('/staff', async (req, res) => {
    const { mobileNumber, password } = req.body;

    try {
        const staff = await Staff.findOne({ mobileNumber });
        if (!staff) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (await bcrypt.compare(password, staff.password)) {
            const token = jwt.sign({ mobileNumber: staff.mobileNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, firstName: staff.firstName, lastName: staff.lastName });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
