const express = require('express');
const router = express.Router();

const apiController = require('../controllers/api');

/* GET API help */
router.get('/', apiController.getHelp);

/* GET API info on user */
router.get('/:screen_name', apiController.getUserByName);

router.get('/getInvoice/:screen_name', apiController.getInvoiceByName);

module.exports = router;