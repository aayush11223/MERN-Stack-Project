const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.DBURL 
mongoose.connect(url)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

module.exports = mongoose
