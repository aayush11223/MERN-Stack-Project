const express = require('express');
const Property = require('../models/Property');
const Favourite = require('../models/Favourite');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const properties = await Property.find();
    const userFavourites = await Favourite.find({ user: req.user._id }).select('property');
    const favouriteIds = userFavourites
      .filter((f) => f.property)
      .map((f) => f.property.toString());

    const propertiesWithFavStatus = properties.map((p) => ({
      ...p.toObject(),
      isFavourited: favouriteIds.includes(p._id.toString()),
    }));

    res.json({ success: true, properties: propertiesWithFavStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/seed', async (req, res) => {
  try {
    await Property.deleteMany();
    const sampleProperties = [
      {
        title: 'Modern Apartment in Lazimpat',
        description: 'A beautiful 2BHK apartment with city views and modern amenities in the heart of Kathmandu.',
        price: 15000000,
        location: 'Lazimpat, Kathmandu',
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        type: 'apartment',
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      },
      {
        title: 'Luxury Villa in Budhanilkantha',
        description: 'Spacious villa with garden, parking, and mountain views. Perfect for families.',
        price: 45000000,
        location: 'Budhanilkantha, Kathmandu',
        bedrooms: 4,
        bathrooms: 3,
        area: 3200,
        type: 'villa',
        imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      },
      {
        title: 'Cozy House in Bhaktapur',
        description: 'Traditional Newari-style house with modern renovation. Close to Durbar Square.',
        price: 22000000,
        location: 'Bhaktapur',
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        type: 'house',
        imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      },
      {
        title: 'Studio Apartment in Thamel',
        description: 'Ideal for professionals or students. Walking distance to restaurants and shops.',
        price: 8500000,
        location: 'Thamel, Kathmandu',
        bedrooms: 1,
        bathrooms: 1,
        area: 550,
        type: 'apartment',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      },
      {
        title: 'Commercial Space in New Baneshwor',
        description: 'Ground floor commercial space suitable for office or retail. High foot traffic area.',
        price: 35000000,
        location: 'New Baneshwor, Kathmandu',
        bedrooms: 0,
        bathrooms: 2,
        area: 2000,
        type: 'commercial',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      },
      {
        title: 'Family Home in Lalitpur',
        description: 'Quiet residential area with easy access to schools and hospitals.',
        price: 28000000,
        location: 'Patan, Lalitpur',
        bedrooms: 3,
        bathrooms: 2,
        area: 2100,
        type: 'house',
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      },
    ];

    await Property.insertMany(sampleProperties);
    res.json({ success: true, message: `${sampleProperties.length} properties seeded!` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Seeding failed.' });
  }
});

module.exports = router;
