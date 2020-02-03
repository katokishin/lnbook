const express = require('express');
const router = express.Router();
const passport = require('passport');

const staticController = require('../controllers/static');

/* GET home page */
router.get('/', staticController.getIndexPage);

/* GET features page */
router.get('/features', staticController.getFeaturesPage);

/* GET about page */
router.get('/about', staticController.getAboutPage);

/* GET login page */
router.get('/login', staticController.getLoginPage);

/* POST login action via passport's twitter strategy */
router.post('/login', passport.authenticate('twitter', { sccuessReturnToOrRedirect: '/', failureRedirect: '/login' }));

/* GET logout action */
router.get('/logout', (req, res, next) => {
  console.log('logging out...');
  req.logout();
  console.log('logged out');
  console.log(req.session);
  res.redirect('/');
})

module.exports = router;
