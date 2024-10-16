const express = require('express')
const router = express.Router()
const { viewCustomerSlots,  bookSlot, deleteSlot, viewAvailableSlots, viewCentreSlots } = require('../controllers/slot')

const authenticateUser = require('../middlewares/authentication');
const authorizeRoles = require('../middlewares/roleAuthorization');
const authenticateManager = require('../middlewares/authenticationManager');

router.get('/customer/slots', authenticateUser, authorizeRoles("CUSTOMER"), viewCustomerSlots);
router.post('/customer/book', authenticateUser, authorizeRoles('CUSTOMER'), bookSlot);
router.delete('/:slotId', authenticateUser, deleteSlot);
router.post('/customer/available', authenticateUser, authorizeRoles('CUSTOMER'), viewAvailableSlots);

router.post('/manager', authenticateManager, authorizeRoles('MANAGER'), viewCentreSlots);

module.exports = router;