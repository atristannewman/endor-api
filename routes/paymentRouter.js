const express = require('express');
const router = express.Router();
// const paymentController = require('../controllers/paymentController');

router.post('/intent', (req, res) => {
    console.log('intent POST called');
    res.send('intent POST called');
});
router.post('/confirm-intent', (req, res) => {
    console.log('confirm intent POST called');
    res.send('confirm intent POST called');
});

module.exports = router;