const express = require('express');
const bouncer = require('express-bouncer')(10000, 900000, 2); // Protection contre les attaques Bruteforce
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);

module.exports = router;