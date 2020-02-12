const express = require('express');
const router = express.Router();

const apiController = require('../controllers/api');

/* GET API help */
router.get('/', apiController.getHelp);

/* GET API info on user */
router.get('/:uid', apiController.getUid);

router.get('/addInvoice/:uid', apiController.getInvoice);

module.exports = router;