const express = require('express')
const router = express.Router()
const { registerCustomer, loginCustomer, loginManager } = require('../controllers/auth')

router.post('/customer/login', loginCustomer)
router.post('/customer/register', registerCustomer)
router.post('/management/login', loginManager)

module.exports = router;