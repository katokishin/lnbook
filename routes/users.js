const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const usersController = require('../controllers/users');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* GET dashboard page */
// If not logged in, goes to /login, sets req.session,returnTo to /users/dashboard
router.get('/dashboard', ensureLoggedIn('/login'), usersController.getDashboard);

/* POST add lapp */
router.post('/add_lapp', ensureLoggedIn('/login'), usersController.postAddLapp);

module.exports = router;
