const express = require('express');
const passport = require('passport');
const router = express.Router();

const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get('/', passport.authenticate('jwt', { session: false }), sauceCtrl.getAllSauces);
router.post('/', multer, passport.authenticate('jwt', { session: false }), sauceCtrl.createSauce);
router.get('/:id', passport.authenticate('jwt', { session: false }), sauceCtrl.getOneSauce);
router.put('/:id', multer, passport.authenticate('jwt', { session: false }), sauceCtrl.updateSauce);
router.delete('/:id', multer, passport.authenticate('jwt', { session: false }), sauceCtrl.deleteSauce);
router.post('/:id/like', passport.authenticate('jwt', { session: false }),sauceCtrl.likeSauce);


module.exports = router;