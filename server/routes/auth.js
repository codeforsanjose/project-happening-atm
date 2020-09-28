const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const authMiddleware = require("../auth/authMiddleware");

// TODO: Utilize controllers here

router.route('/failed').get((req, res) => res.send('You Failed to log in!'))

router.route('/good').get(authMiddleware.isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

router.route('/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/google/callback').get(passport.authenticate('google', { failureRedirect: '/failed' }),
  (req, res) => {
    res.redirect('/good');
  }
);

router.route('/logout').get((req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

module.exports = router;