const express = require('express');
const { getFavourites, addFavourite, removeFavourite } = require('../controllers/favouriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getFavourites);
router.post('/:propertyId', protect, addFavourite);
router.delete('/:propertyId', protect, removeFavourite);

module.exports = router;
