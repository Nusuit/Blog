const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../app/controller/authController');

// Thay đổi routes để bỏ 'auth/' ở đầu vì đã có prefix trong server.js
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    authController.googleCallback
);

// router.get('/outlook',
//     passport.authenticate('microsoft', { scope: ['user.read'] })
// );

// router.get('/outlook/callback',
//     passport.authenticate('microsoft', { failureRedirect: '/login' }),
//     authController.outlookCallback
// );

module.exports = router;