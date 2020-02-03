const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const usersController = require('../controllers/users');

/* GET dashboard page */
// If not logged in, goes to /login, sets req.session,returnTo to /users/dashboard
router.get('/dashboard', ensureLoggedIn('/login'), usersController.getDashboard);

/* POST add lapp */
router.post('/add_lapp', ensureLoggedIn('/login'), usersController.postAddLapp);

/* POST remove lapp */
router.post('/remove_lapp', ensureLoggedIn('/login'), usersController.postRemoveLapp);


module.exports = router;
