const Favourite = require('../models/Favourite');
const Property = require('../models/Property');

const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ user: req.user._id }).populate('property');
    const validFavourites = favourites.filter((f) => f.property).map((f) => f.property);
    res.json({ success: true, count: validFavourites.length, favourites: validFavourites });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const addFavourite = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found.' });

    const existing = await Favourite.findOne({ user: req.user._id, property: req.params.propertyId });
    if (existing)
      return res.status(400).json({ success: false, message: 'Property is already in your favourites.' });

    await Favourite.create({ user: req.user._id, property: req.params.propertyId });
    res.status(201).json({ success: true, message: 'Property added to favourites!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const removeFavourite = async (req, res) => {
  try {
    const favourite = await Favourite.findOneAndDelete({ user: req.user._id, property: req.params.propertyId });
    if (!favourite)
      return res.status(404).json({ success: false, message: 'Favourite not found.' });

    res.json({ success: true, message: 'Property removed from favourites.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getFavourites, addFavourite, removeFavourite };
